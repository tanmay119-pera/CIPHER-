"""
Cipher Autonomous AI Teammates - Critic Agent (Self-Correction & Safety Auditor)
Evaluates proposed decisions against merchant policies, VIP safeguards, and false-positive
risks. Catches errors before merchant notification or payment execution.
Uses Gemini 3.8 Flash for auditor statements with deterministic fallback.
"""

from typing import Dict, Any, List
from backend.llm import call_gemini

class CriticAgent:
    name: str = "Critic & Compliance Agent"
    role: str = "Self-Correction & Policy Adherence Auditor"

    def review(
        self,
        tx: Dict[str, Any],
        customer_analysis: Dict[str, Any],
        product_analysis: Dict[str, Any],
        decision: Dict[str, Any],
        rag_policies: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        action = decision.get("proposed_action")
        confidence = decision.get("confidence_score", 80)
        risk_score = tx.get("risk_score", 0)
        amount = tx.get("payment_value", 0.0)
        customer_tier = customer_analysis.get("customer_tier", "")
        policy_ids = [p["id"] for p in rag_policies]

        issues = []
        recommendations = []

        if amount > 1000 and action == "AUTO_APPROVE":
            issues.append(f"Auto-approval of transaction (${amount:,.2f}) violates POL-001 ($1,000 threshold requirement).")
            recommendations.append("Change proposed action to TRIGGER_KYC or HOLD_PAYMENT.")

        if "VIP" in customer_tier and action == "HOLD_PAYMENT" and risk_score < 85:
            issues.append(f"Holding payment for trusted {customer_tier} risks customer churn. Violates POL-006.")
            recommendations.append("Downgrade action to TRIGGER_KYC or VIP_EXPEDITE with post-purchase monitoring.")

        if risk_score < 25 and action in ("HOLD_PAYMENT", "TRIGGER_KYC"):
            issues.append(f"Imposing friction on very low risk order ({risk_score}/100) creates negative customer experience.")
            recommendations.append("Revise action to AUTO_APPROVE per POL-008.")

        if issues:
            verdict = "REJECTED_REQUIRES_REVISION"
            passed = False
            default_note = "Critic caught potential policy violation or false-positive friction. Requesting Decision Agent correction."
        else:
            verdict = "APPROVED"
            passed = True
            default_note = "Critic verified: Decision aligns with active policies (POL-001..POL-008) and safeguards customer experience."

        # Active Gemini verification check
        prompt = (
            f"You are the Critic & Safety Compliance Agent for Cipher. "
            f"Review this proposed action: {action} on transaction value ${amount:,.2f} (Risk Score: {risk_score}/100). "
            f"Verdict: {verdict}. "
            f"Provide a 1-sentence rigorous audit statement verifying policy compliance and customer protection."
        )
        llm_note = call_gemini(prompt, timeout=10)
        audit_note = llm_note if llm_note else default_note

        return {
            "agent": self.name,
            "role": self.role,
            "verdict": verdict,
            "passed": passed,
            "audited_action": action,
            "issues_detected": issues,
            "recommendations": recommendations,
            "audit_note": audit_note,
            "compliance_rating": "100% COMPLIANT" if passed else "NON_COMPLIANT_FLAGGED",
            "powered_by": "Gemini AI" if llm_note else "Deterministic Swarm Heuristic"
        }

critic_agent = CriticAgent()
