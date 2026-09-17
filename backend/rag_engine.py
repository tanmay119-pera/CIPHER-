"""
Cipher Autonomous AI Teammates - RAG Context & Policy Knowledge Engine
Stores e-commerce fraud policies, chargeback SLAs, category guidelines, and merchant rules.
Provides hybrid semantic retrieval (dense TF-IDF/BM25 + Cosine similarity) for agents.
"""

import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# E-commerce Operational Knowledge Base
POLICIES = [
    {
        "id": "POL-001",
        "title": "High-Value Transaction Identity Verification",
        "category": "Payment Security",
        "threshold": "$1,000.00",
        "text": "Transactions exceeding $1,000 or wallet/alternative payments above $800 require enhanced customer verification (2FA or merchant confirmation) before fulfillment to prevent unauthorized account takeover and high-amount chargebacks.",
        "action_required": "FLAG_FOR_2FA_OR_KYC"
    },
    {
        "id": "POL-002",
        "title": "Installment Exposure & Credit Risk Management",
        "category": "Credit Risk",
        "threshold": "8+ Installments",
        "text": "Transactions structured with 8 or more installments on credit cards for values exceeding $350 carry elevated default and dispute probability. Requires card issuer authorization code match and behavioral risk check.",
        "action_required": "VERIFY_ISSUER_AUTH"
    },
    {
        "id": "POL-003",
        "title": "High-Risk Merchandise & Category Fraud Protocols",
        "category": "Catalog & Product",
        "threshold": "Watches, Electronics, Luxury",
        "text": "Merchandise in high-theft categories (watches, electronics, luxury accessories, computers) where item price exceeds $200 requires verified delivery tracking with signature confirmation to protect against 'item not received' disputes.",
        "action_required": "ENFORCE_SIGNATURE_DELIVERY"
    },
    {
        "id": "POL-004",
        "title": "Freight & Shipping Charge Disparity (Fee Gouging / Phantom Item)",
        "category": "Logistics & Seller",
        "threshold": "Shipping > 50% of Order Value",
        "text": "When shipping charges exceed 50% of total order value or deviate significantly from weight-based logistics tables, investigate for seller shipping fee exploitation or phantom listing maneuvers.",
        "action_required": "AUDIT_SELLER_SHIPPING"
    },
    {
        "id": "POL-005",
        "title": "Delivery Delay SLA & Proactive Dispute Mitigation",
        "category": "Customer Experience",
        "threshold": "Delay > 5 Days",
        "text": "When delivery exceeds the estimated delivery date by more than 5 days, customer dissatisfaction surges and chargeback risk triples. Proactively dispatch tracking updates and issue courier investigation ticket.",
        "action_required": "DISPATCH_COURIER_INQUIRY"
    },
    {
        "id": "POL-006",
        "title": "Trusted Repeat Buyer White-Glove Expedited Fulfillment",
        "category": "VIP & Loyalty",
        "threshold": "3+ Completed Orders",
        "text": "Customers with 3 or more completed purchases without historical chargebacks qualify for Tier-1 trusted status. Friction should be minimized; false-positive flag suppression is authorized up to $1,500.",
        "action_required": "APPROVE_WITH_VIP_EXPEDITE"
    },
    {
        "id": "POL-007",
        "title": "Anomalous Wallet & Boleto Velocity Regulation",
        "category": "Payment Security",
        "threshold": "Wallet / Boleto > $700",
        "text": "Digital wallet and voucher transactions exceeding $700 cannot be reversed as easily as credit cards upon fraud discovery. Hold payment clearing for 2 hours for automated fraud graph verification.",
        "action_required": "HOLD_PAYMENT_CLEARING"
    },
    {
        "id": "POL-008",
        "title": "Standard Low-Risk Auto-Clear Protocol",
        "category": "Automation",
        "threshold": "Risk Score < 40",
        "text": "Orders with low anomaly scores, standard domestic shipping, and normal installment structures shall be automatically cleared for immediate warehouse dispatch without human delay.",
        "action_required": "AUTO_APPROVE"
    }
]

class PolicyRAGEngine:
    def __init__(self):
        self.policies = POLICIES
        self.corpus = [
            f"{p['id']} {p['title']} {p['category']} {p['text']} {p['threshold']} {p['action_required']}"
            for p in self.policies
        ]
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus)

    def retrieve(self, query: str, top_k: int = 3) -> list[dict]:
        """
        Retrieves the top-k most relevant policies for an order query or risk scenario.
        """
        if not query.strip():
            return self.policies[:top_k]

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix)[0]

        ranked_indices = similarities.argsort()[::-1][:top_k]
        results = []
        for idx in ranked_indices:
            score = float(similarities[idx])
            p = dict(self.policies[idx])
            p["relevance_score"] = round(score, 3)
            results.append(p)

        return results

    def retrieve_for_transaction(self, tx: dict, top_k: int = 3) -> list[dict]:
        """
        Synthesizes a transaction profile into a search query and retrieves applicable policies.
        """
        query_parts = []
        if tx.get("payment_value", 0) > 800:
            query_parts.append(f"high value transaction amount ${tx.get('payment_value')} verification")
        if tx.get("payment_installments", 1) >= 6:
            query_parts.append(f"high installment count {tx.get('payment_installments')} credit risk")
        if tx.get("payment_type") in ("wallet", "voucher", "boleto"):
            query_parts.append(f"{tx.get('payment_type')} alternative payment security")
        if tx.get("shipping_to_price_ratio", 0) > 0.4:
            query_parts.append("high shipping fee disparity seller charges")
        if tx.get("delivery_delay_days", 0) > 3:
            query_parts.append("delivery delay late shipment SLA dispute")
        if tx.get("customer_order_count", 1) >= 2:
            query_parts.append("trusted repeat customer loyalty VIP")
        if tx.get("product_category_name"):
            query_parts.append(f"{tx.get('product_category_name')} merchandise category")

        query_str = " ".join(query_parts) if query_parts else "standard order low risk verification"
        return self.retrieve(query_str, top_k=top_k)

# Singleton instance
rag_engine = PolicyRAGEngine()

if __name__ == "__main__":
    test_query = "High value wallet transaction $1521 8 installments watches"
    docs = rag_engine.retrieve(test_query, top_k=3)
    print("RAG Retrieval Test for query:", test_query)
    for d in docs:
        print(f"  -> [{d['id']}] {d['title']} (Score: {d['relevance_score']}) Action: {d['action_required']}")
