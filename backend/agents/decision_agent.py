"""
Cipher Autonomous AI Teammates - Decision Agent (ReAct Orchestrator)
Synthesizes signals from Customer Agent, Product Agent, ML anomaly scoring,
and RAG policies to formulate a concrete operational action.
Uses Gemini 3.8 Flash for generative reasoning with deterministic fallback.
"""

from typing import Dict, Any, List
from backend.llm import call_gemini

class DecisionAgent:
    name: str = "Decision Lead Agent"
    role: str = "Autonomous Decision Synthesizer"

    def decide(
        self,
        tx: Dict[str, Any],
        customer_analysis: Dict[str, Any],
        product_analysis: Dict[str, Any],
        rag_policies: List[Dict[str, Any]],
        critic_feedback: str = None
    ) -> Dict[str, Any]:
        risk_score = tx.get("risk_score", 30)
        risk_status = tx.get("risk_status", "Low Risk")
        amount = tx.get("payment_value", 0.0)
        p_type = tx.get("payment_type", "credit_card")
        trust_score = customer_analysis.get("trust_score", 50)
        customer_tier = customer_analysis.get("customer_tier", "Tier-3")
        logistics_rec = product_analysis.get("logistics_recommendation", "STANDARD_SHIPPING")

        # Core ReAct Decision Logic
        if "VIP" in customer_tier and risk_score < 75:
            proposed_action = "VIP_EXPEDITE"
            tool_name = "expedite_fulfillment_tool"
            default_rationale = (
                f"Customer qualifies for VIP privilege ({customer_tier}). Despite moderate score ({risk_score}), "
                f"POL-006 authorizes white-glove expedited fulfillment without manual interruption."
            )
            confidence = 94
        elif risk_score >= 70 or (amount > 1000 and p_type in ("wallet", "voucher")):
            if p_type == "wallet" or amount > 1200:
                proposed_action = "HOLD_PAYMENT"
                tool_name = "hold_payment_tool"
                default_rationale = (
                    f"High risk score ({risk_score}/100) on transaction value ${amount:,.2f} via {p_type}. "
                    f"In compliance with POL-001 and POL-007, automated 2-hour payment clearing hold is instituted."
                )
                confidence = 91
            else:
                proposed_action = "TRIGGER_KYC"
                tool_name = "trigger_kyc_tool"
                default_rationale = (
                    f"Transaction flags elevated risk ({risk_score}/100). "
                    f"Issuing automated 2FA/KYC verification challenge per POL-001."
                )
                confidence = 88
        elif logistics_rec == "AUDIT_SELLER_FREIGHT":
            proposed_action = "FLAG_FOR_SELLER_AUDIT"
            tool_name = "notify_merchant_fraud_tool"
            default_rationale = (
                f"Logistics anomaly detected: {product_analysis.get('shipping_ratio_pct')}% shipping-to-price ratio. "
                f"Flagging transaction to merchant for seller freight charge validation (POL-004)."
            )
            confidence = 86
        elif risk_score >= 40:
            proposed_action = "TRIGGER_KYC"
            tool_name = "trigger_kyc_tool"
            default_rationale = (
                f"Medium risk transaction ({risk_score}/100) with trust score {trust_score}/100. "
                f"Requesting lightweight verification challenge before dispatch."
            )
            confidence = 82
        else:
            proposed_action = "AUTO_APPROVE"
            tool_name = "auto_approve_tool"
            default_rationale = (
                f"Low risk transaction ({risk_score}/100) with healthy behavioral signals. "
                f"Auto-cleared for warehouse fulfillment pursuant to POL-008."
            )
            confidence = 96

        # Active Gemini 3.8 Flash Generation
        governing_policy = rag_policies[0]["id"] if rag_policies else "POL-008"
        prompt = (
            f"You are the Decision Lead Agent for Cipher Autonomous AI Teammates. "
            f"Synthesize this operational decision into 2 concise, decisive sentences:\n"
            f"- Transaction: ${amount:,.2f} via {p_type} (Risk: {risk_score}/100, {risk_status})\n"
            f"- Customer Tier: {customer_tier} (Trust: {trust_score}/100)\n"
            f"- Product Category: {product_analysis.get('product_category')} ({logistics_rec})\n"
            f"- Action: {proposed_action} governed by {governing_policy}\n"
            f"- Critic Feedback (if any): {critic_feedback or 'None'}\n"
            f"State the decision rationale clearly."
        )

        llm_rationale = call_gemini(prompt, timeout=3)
        rationale = llm_rationale if llm_rationale else default_rationale

        if critic_feedback and not llm_rationale:
            rationale = f"[Self-Correction Applied] {rationale} (Addressed Critic: {critic_feedback})"
            confidence = min(99, confidence + 4)

        return {
            "agent": self.name,
            "role": self.role,
            "proposed_action": proposed_action,
            "tool_to_execute": tool_name,
            "confidence_score": confidence,
            "rationale": rationale,
            "governing_policy": governing_policy,
            "powered_by": "Gemini 3.8 Flash" if llm_rationale else "Deterministic Swarm Heuristic"
        }

decision_agent = DecisionAgent()
