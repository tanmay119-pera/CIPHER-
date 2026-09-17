"""
Cipher Autonomous AI Teammates - Product & Sales Intelligence Agent
Specialized agent that examines catalog category vulnerability, price-to-weight ratios,
shipping freight disparities, and seller performance risks.
"""

from typing import Dict, Any

HIGH_THEFT_CATEGORIES = {
    "watches_gifts", "telephony", "electronics", "computers_accessories", 
    "audio", "small_appliances", "consoles_games"
}

class ProductSalesAgent:
    name: str = "Sales & Product Intelligence Agent"
    role: str = "Catalog Risk & Merchant Logistics Analyst"

    def analyze(self, tx: Dict[str, Any]) -> Dict[str, Any]:
        category = (tx.get("product_category_name") or "General").lower()
        price = tx.get("price", 0.0)
        shipping = tx.get("shipping_charges", 0.0)
        weight = tx.get("product_weight_g", 0.0)
        shipping_ratio = tx.get("shipping_to_price_ratio", 0.0)
        seller_id = tx.get("seller_id", "Unknown")
        item_count = tx.get("item_count", 1)

        is_high_risk_cat = any(c in category for c in HIGH_THEFT_CATEGORIES)
        category_risk = "HIGH" if is_high_risk_cat else "STANDARD"

        product_flags = []
        logistics_recommendation = "STANDARD_SHIPPING"

        # Check for shipping disparity
        if shipping_ratio > 0.5:
            product_flags.append(f"Shipping freight is {int(shipping_ratio*100)}% of item price (${shipping:,.2f} on ${price:,.2f})")
            logistics_recommendation = "AUDIT_SELLER_FREIGHT"

        # Check high-value vulnerable category
        if is_high_risk_cat and price > 200:
            product_flags.append(f"High-theft category '{category.title()}' with unit price ${price:,.2f}")
            logistics_recommendation = "ENFORCE_SIGNATURE_DELIVERY"

        # Weight vs shipping check
        if weight > 10000 and shipping < 15:
            product_flags.append("Heavy item (>10kg) with abnormally low shipping - potential weight misdeclaration")

        summary = (
            f"Product in category '{category.title()}' (Seller {seller_id[:8]}...) evaluated at ${price:,.2f} "
            f"across {item_count} unit(s). Logistics profile: {logistics_recommendation}. "
        )
        if product_flags:
            summary += "Catalog alerts: " + "; ".join(product_flags) + "."
        else:
            summary += "Pricing and freight metrics match healthy category distributions."

        return {
            "agent": self.name,
            "role": self.role,
            "product_category": category.title(),
            "category_risk_level": category_risk,
            "shipping_ratio_pct": int(shipping_ratio * 100),
            "logistics_recommendation": logistics_recommendation,
            "product_flags": product_flags,
            "summary": summary
        }

product_sales_agent = ProductSalesAgent()
