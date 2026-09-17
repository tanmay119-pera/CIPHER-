"""
Cipher Autonomous AI Teammates - Customer Intelligence Agent
Specialized agent that evaluates buyer reputation, order history, geographic risk,
and payment behavioral signals.
"""

from typing import Dict, Any

class CustomerAgent:
    name: str = "Customer Intelligence Agent"
    role: str = "Buyer Profiling & Behavioral Risk Analyst"

    def analyze(self, tx: Dict[str, Any]) -> Dict[str, Any]:
        customer_id = tx.get("customer_id", "Unknown")
        city = tx.get("customer_city", "Unknown")
        state = tx.get("customer_state", "Unknown")
        order_count = tx.get("customer_order_count", 1)
        amount = tx.get("payment_value", 0.0)
        installments = tx.get("payment_installments", 1)
        p_type = tx.get("payment_type", "credit_card")
        status = tx.get("order_status", "delivered")

        # Determine Customer Tier
        if order_count >= 3:
            tier = "Tier-1 (VIP Trusted Buyer)"
            trust_score = 92
            friction_recommendation = "LOW_FRICTION"
        elif order_count == 2:
            tier = "Tier-2 (Repeat Buyer)"
            trust_score = 78
            friction_recommendation = "STANDARD"
        else:
            tier = "Tier-3 (New / First-Time Buyer)"
            trust_score = 55
            friction_recommendation = "VERIFY_IF_HIGH_VALUE"

        # Behavioral anomalies
        flags = []
        if installments >= 8 and amount > 400:
            flags.append(f"Excessive installment leverage ({installments} payments on ${amount:,.2f})")
            trust_score -= 15

        if p_type == "wallet" and amount > 800:
            flags.append(f"High digital wallet transaction without card authorization")
            trust_score -= 12

        if status == "canceled":
            flags.append("Customer has prior canceled order record in session")
            trust_score -= 25

        trust_score = max(10, min(99, trust_score))

        assessment = (
            f"Customer {customer_id[:8]}... located in {city}, {state} classified as {tier} "
            f"with {order_count} recorded order(s). "
        )
        if flags:
            assessment += "Behavioral flags detected: " + "; ".join(flags) + ". "
        else:
            assessment += "Normal behavioral pattern consistent with historical baseline. "

        return {
            "agent": self.name,
            "role": self.role,
            "customer_tier": tier,
            "trust_score": trust_score,
            "behavioral_flags": flags,
            "friction_recommendation": friction_recommendation,
            "summary": assessment
        }

customer_agent = CustomerAgent()
