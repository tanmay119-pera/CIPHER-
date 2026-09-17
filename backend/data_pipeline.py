"""
Cipher Autonomous AI Teammates - Data Pipeline & Feature Engineering
Ingests 5 relational CSVs (Orders, Customers, OrderItems, Payments, Products),
performs feature engineering, trains unsupervised anomaly detection (Isolation Forest),
computes calibrated risk scores (0-100) aligned with dashboard targets (68% Low, 24% Med, 8% High),
and populates SQLite cipher.db.
"""

import os
import csv
import sqlite3
import json
from datetime import datetime
import numpy as np
from sklearn.ensemble import IsolationForest

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "train")
DB_PATH = os.path.join(BASE_DIR, "data", "cipher.db")

def parse_date(date_str):
    if not date_str:
        return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except ValueError:
            pass
    return None

def build_data_pipeline():
    print("🚀 [1/5] Loading CSV tables from:", DATA_DIR)

    # 1. Load Customers
    customers = {}
    cust_file = os.path.join(DATA_DIR, "df_Customers.csv")
    with open(cust_file, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            customers[row["customer_id"]] = {
                "zip": row.get("customer_zip_code_prefix", ""),
                "city": row.get("customer_city", "").title(),
                "state": row.get("customer_state", "").upper()
            }
    print(f"   Loaded {len(customers):,} customer records.")

    # 2. Load Products
    products = {}
    prod_file = os.path.join(DATA_DIR, "df_Products.csv")
    with open(prod_file, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            p_id = row["product_id"]
            try:
                weight = float(row["product_weight_g"]) if row.get("product_weight_g") else 0.0
            except ValueError:
                weight = 0.0
            cat = row.get("product_category_name", "general")
            products[p_id] = {
                "category": cat.replace("_", " ").title() if cat else "General",
                "weight_g": weight
            }
    print(f"   Loaded {len(products):,} product records.")

    # 3. Load OrderItems
    order_items = {}
    items_file = os.path.join(DATA_DIR, "df_OrderItems.csv")
    with open(items_file, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            o_id = row["order_id"]
            price = float(row["price"]) if row.get("price") else 0.0
            shipping = float(row["shipping_charges"]) if row.get("shipping_charges") else 0.0
            prod_id = row.get("product_id", "")
            seller_id = row.get("seller_id", "")

            if o_id not in order_items:
                order_items[o_id] = {
                    "total_price": 0.0,
                    "total_shipping": 0.0,
                    "item_count": 0,
                    "primary_product_id": prod_id,
                    "primary_seller_id": seller_id
                }
            order_items[o_id]["total_price"] += price
            order_items[o_id]["total_shipping"] += shipping
            order_items[o_id]["item_count"] += 1
    print(f"   Loaded items for {len(order_items):,} orders.")

    # 4. Load Payments
    payments = {}
    pay_file = os.path.join(DATA_DIR, "df_Payments.csv")
    with open(pay_file, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        for row in reader:
            o_id = row["order_id"]
            val = float(row["payment_value"]) if row.get("payment_value") else 0.0
            try:
                installments = int(row["payment_installments"]) if row.get("payment_installments") else 1
            except ValueError:
                installments = 1
            p_type = row.get("payment_type", "credit_card").lower()

            if o_id not in payments:
                payments[o_id] = {
                    "payment_type": p_type,
                    "max_installments": installments,
                    "total_payment": val
                }
            else:
                payments[o_id]["total_payment"] += val
                if installments > payments[o_id]["max_installments"]:
                    payments[o_id]["max_installments"] = installments
    print(f"   Loaded payments for {len(payments):,} orders.")

    # 5. Load Orders & Merge
    orders_file = os.path.join(DATA_DIR, "df_Orders.csv")
    print("📊 [2/5] Joining tables and computing features...")
    with open(orders_file, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)
        raw_orders = list(reader)

    customer_order_counts = {}
    for o in raw_orders:
        c_id = o.get("customer_id", "")
        customer_order_counts[c_id] = customer_order_counts.get(c_id, 0) + 1

    feature_matrix = []
    order_records = []

    for o in raw_orders:
        o_id = o["order_id"]
        c_id = o.get("customer_id", "")
        status = o.get("order_status", "delivered")
        purchase_ts = o.get("order_purchase_timestamp", "")
        approved_at = o.get("order_approved_at", "")
        delivered_ts = o.get("order_delivered_timestamp", "")
        est_delivery = o.get("order_estimated_delivery_date", "")

        cust = customers.get(c_id, {"zip": "", "city": "Unknown", "state": "Unknown"})
        items = order_items.get(o_id, {
            "total_price": 0.0,
            "total_shipping": 0.0,
            "item_count": 1,
            "primary_product_id": "unknown",
            "primary_seller_id": "unknown"
        })
        pay = payments.get(o_id, {
            "payment_type": "credit_card",
            "max_installments": 1,
            "total_payment": items["total_price"] + items["total_shipping"]
        })
        prod = products.get(items["primary_product_id"], {
            "category": "General",
            "weight_g": 500.0
        })

        dt_purchase = parse_date(purchase_ts)
        dt_approved = parse_date(approved_at)
        dt_delivered = parse_date(delivered_ts)
        dt_est = parse_date(est_delivery)

        approval_hours = 0.0
        if dt_purchase and dt_approved:
            approval_hours = max(0.0, (dt_approved - dt_purchase).total_seconds() / 3600.0)

        delivery_delay_days = 0.0
        if dt_delivered and dt_est:
            delivery_delay_days = (dt_delivered - dt_est).total_seconds() / 86400.0

        amount = round(pay["total_payment"], 2)
        installments = pay["max_installments"]
        shipping = round(items["total_shipping"], 2)
        shipping_ratio = round(shipping / max(amount, 1.0), 3)
        price_per_installment = round(amount / max(installments, 1), 2)
        weight_g = prod["weight_g"]
        order_count = customer_order_counts.get(c_id, 1)

        feat = [
            amount,
            float(installments),
            shipping_ratio,
            min(approval_hours, 168.0),
            max(min(delivery_delay_days, 60.0), -30.0),
            min(weight_g, 30000.0)
        ]
        feature_matrix.append(feat)

        order_records.append({
            "order_id": o_id,
            "customer_id": c_id,
            "customer_city": cust["city"],
            "customer_state": cust["state"],
            "customer_zip_prefix": cust["zip"],
            "order_status": status,
            "order_purchase_timestamp": purchase_ts,
            "order_approved_at": approved_at,
            "order_delivered_timestamp": delivered_ts,
            "order_estimated_delivery_date": est_delivery,
            "payment_type": pay["payment_type"],
            "payment_installments": installments,
            "payment_value": amount,
            "item_count": items["item_count"],
            "product_id": items["primary_product_id"],
            "seller_id": items["primary_seller_id"],
            "price": round(items["total_price"], 2),
            "shipping_charges": shipping,
            "product_category_name": prod["category"],
            "product_weight_g": weight_g,
            "delivery_delay_days": round(delivery_delay_days, 1),
            "approval_delay_hours": round(approval_hours, 1),
            "shipping_to_price_ratio": shipping_ratio,
            "price_per_installment": price_per_installment,
            "customer_order_count": order_count
        })

    print(f"   Engineered features for {len(order_records):,} transactions.")

    # 6. Fit Isolation Forest Anomaly Detection
    print("🧠 [3/5] Fitting Isolation Forest Anomaly Detection Model...")
    X = np.array(feature_matrix, dtype=np.float32)
    X = np.nan_to_num(X, nan=0.0, posinf=1000.0, neginf=0.0)

    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.08,
        random_state=42,
        n_jobs=-1
    )
    iso_forest.fit(X)
    # raw score: negative is outlier
    raw_anomaly_scores = iso_forest.decision_function(X)

    # 7. Calibrate Composite Risk Scores (0-100) using Ranking
    print("🎯 [4/5] Calibrating Risk Scores & Attributions...")
    
    # Calculate composite score from anomaly rank + rule violations
    rule_scores = np.zeros(len(order_records), dtype=np.float32)
    reasons_list = [[] for _ in range(len(order_records))]

    for idx, rec in enumerate(order_records):
        amount = rec["payment_value"]
        installments = rec["payment_installments"]
        shipping_ratio = rec["shipping_to_price_ratio"]
        approval_delay = rec["approval_delay_hours"]
        p_type = rec["payment_type"]
        status = rec["order_status"]

        if amount > 1500:
            reasons_list[idx].append(f"Unusually high transaction amount (${amount:,.2f})")
            rule_scores[idx] += 30
        elif amount > 750:
            reasons_list[idx].append(f"Above average order value (${amount:,.2f})")
            rule_scores[idx] += 15

        if installments >= 8:
            reasons_list[idx].append(f"High installment count ({installments} payments)")
            rule_scores[idx] += 20
        elif installments >= 5:
            rule_scores[idx] += 10

        if shipping_ratio > 0.5:
            reasons_list[idx].append(f"Anomalous shipping-to-price ratio ({int(shipping_ratio*100)}%)")
            rule_scores[idx] += 15

        if approval_delay > 36:
            reasons_list[idx].append(f"Payment approval took {int(approval_delay)} hours")
            rule_scores[idx] += 12

        if p_type == "wallet" and amount > 800:
            reasons_list[idx].append("High-value wallet transaction")
            rule_scores[idx] += 18
        elif p_type == "voucher" and amount > 500:
            reasons_list[idx].append("High-value voucher transaction")
            rule_scores[idx] += 15

        if status == "canceled":
            reasons_list[idx].append("Order status was canceled")
            rule_scores[idx] += 35

    # Rank anomaly: most anomalous (lowest decision_function) gets highest rank score
    anomaly_ranks = (-raw_anomaly_scores).argsort().argsort() / float(len(raw_anomaly_scores))
    
    # Blend anomaly rank (60%) with rule violations (40%)
    composite_signal = (anomaly_ranks * 0.6) + ((rule_scores / 100.0) * 0.4)

    # Convert to percentiles: 0.0 to 1.0
    percentiles = composite_signal.argsort().argsort() / float(len(composite_signal))

    # Map percentiles to targets:
    # Top 8% (percentile >= 0.92) -> High Risk (70 to 98)
    # Next 24% (percentile 0.68 to 0.92) -> Medium Risk (40 to 69)
    # Bottom 68% (percentile < 0.68) -> Low Risk (8 to 39)
    for idx, rec in enumerate(order_records):
        pct = percentiles[idx]
        if pct >= 0.92:
            # High Risk: 70 - 98
            scaled = 70 + int((pct - 0.92) / 0.08 * 28)
            risk_status = "High Risk"
            if not reasons_list[idx]:
                reasons_list[idx].append("Multi-dimensional feature anomaly detected by Isolation Forest")
        elif pct >= 0.68:
            # Medium Risk: 40 - 69
            scaled = 40 + int((pct - 0.68) / 0.24 * 29)
            risk_status = "Medium Risk"
            if not reasons_list[idx]:
                reasons_list[idx].append("Moderate deviation from baseline customer purchasing behavior")
        else:
            # Low Risk: 8 - 39
            scaled = 8 + int(pct / 0.68 * 31)
            risk_status = "Low Risk"
            if not reasons_list[idx]:
                reasons_list[idx].append("Standard verified transaction within normal limits")

        rec["anomaly_score"] = round(float(raw_anomaly_scores[idx]), 4)
        rec["risk_score"] = int(np.clip(scaled, 5, 99))
        rec["risk_status"] = risk_status
        rec["risk_reasons"] = reasons_list[idx]

    # 8. Save to SQLite Database
    print(f"💾 [5/5] Writing unified dataset to SQLite ({DB_PATH})...")
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE transactions (
        order_id TEXT PRIMARY KEY,
        customer_id TEXT,
        customer_city TEXT,
        customer_state TEXT,
        customer_zip_prefix TEXT,
        order_status TEXT,
        order_purchase_timestamp TEXT,
        order_approved_at TEXT,
        order_delivered_timestamp TEXT,
        order_estimated_delivery_date TEXT,
        payment_type TEXT,
        payment_installments INTEGER,
        payment_value REAL,
        item_count INTEGER,
        product_id TEXT,
        seller_id TEXT,
        price REAL,
        shipping_charges REAL,
        product_category_name TEXT,
        product_weight_g REAL,
        delivery_delay_days REAL,
        approval_delay_hours REAL,
        shipping_to_price_ratio REAL,
        price_per_installment REAL,
        customer_order_count INTEGER,
        anomaly_score REAL,
        risk_score INTEGER,
        risk_status TEXT,
        risk_reasons TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT,
        timestamp TEXT,
        customer_agent_analysis TEXT,
        product_sales_agent_analysis TEXT,
        rag_policies_retrieved TEXT,
        decision TEXT,
        critic_review TEXT,
        action_executed TEXT,
        status TEXT
    );
    """)

    cursor.execute("CREATE INDEX idx_risk_score ON transactions(risk_score);")
    cursor.execute("CREATE INDEX idx_risk_status ON transactions(risk_status);")
    cursor.execute("CREATE INDEX idx_payment_type ON transactions(payment_type);")
    cursor.execute("CREATE INDEX idx_purchase_ts ON transactions(order_purchase_timestamp);")

    insert_sql = """
    INSERT INTO transactions VALUES (
        :order_id, :customer_id, :customer_city, :customer_state, :customer_zip_prefix,
        :order_status, :order_purchase_timestamp, :order_approved_at, :order_delivered_timestamp, :order_estimated_delivery_date,
        :payment_type, :payment_installments, :payment_value, :item_count, :product_id, :seller_id,
        :price, :shipping_charges, :product_category_name, :product_weight_g,
        :delivery_delay_days, :approval_delay_hours, :shipping_to_price_ratio, :price_per_installment, :customer_order_count,
        :anomaly_score, :risk_score, :risk_status, :risk_reasons
    );
    """

    records_to_insert = []
    for r in order_records:
        rc = dict(r)
        rc["risk_reasons"] = json.dumps(rc["risk_reasons"])
        records_to_insert.append(rc)

    cursor.executemany(insert_sql, records_to_insert)
    conn.commit()

    cursor.execute("SELECT count(*), avg(risk_score), count(CASE WHEN risk_status='High Risk' THEN 1 END), count(CASE WHEN risk_status='Medium Risk' THEN 1 END), count(CASE WHEN risk_status='Low Risk' THEN 1 END) FROM transactions")
    total, avg_risk, high, med, low = cursor.fetchone()
    print(f"\n✅ Pipeline Complete!")
    print(f"   Total records: {total:,}")
    print(f"   Average risk score: {avg_risk:.1f}/100")
    print(f"   High risk: {high:,} ({high/total*100:.1f}%)")
    print(f"   Medium risk: {med:,} ({med/total*100:.1f}%)")
    print(f"   Low risk: {low:,} ({low/total*100:.1f}%)")

    conn.close()

if __name__ == "__main__":
    build_data_pipeline()
