"""
Cipher Autonomous AI Teammates - Multi-Agent Swarm Orchestrator
Executes the 5-step architecture:
[01 Analyze (RAG)] -> [02 Insights (ML)] -> [03 Decide (ReAct)] -> [04 Review (Critic)] -> [05 Act (Tool Calling)]
with self-correction feedback loop.
"""

import time
import sqlite3
import json
import os
from typing import Dict, Any, List

from backend.rag_engine import rag_engine
from backend.agents.customer_agent import customer_agent
from backend.agents.product_sales_agent import product_sales_agent
from backend.agents.decision_agent import decision_agent
from backend.agents.critic_agent import critic_agent
import backend.tools as tools

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "cipher.db")

class SwarmOrchestrator:
    def __init__(self):
        self.rag = rag_engine
        self.customer = customer_agent
        self.product = product_sales_agent
        self.decision = decision_agent
        self.critic = critic_agent

    def run_workflow(self, tx: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs the full autonomous AI teammate swarm on a single transaction.
        Returns a rich execution timeline and audit bundle.
        """
        start_time = time.time()
        order_id = tx.get("order_id", "CUSTOM-TX")
        timeline = []

        # ----------------------------------------------------
        # Step 01: Analyze (RAG Policy Retrieval)
        # ----------------------------------------------------
        rag_start = time.time()
        policies = self.rag.retrieve_for_transaction(tx, top_k=3)
        timeline.append({
            "step": 1,
            "step_name": "Analyze (RAG)",
            "agent": "Policy Knowledge Engine",
            "duration_ms": round((time.time() - rag_start) * 1000, 1),
            "status": "COMPLETED",
            "output_summary": f"Retrieved {len(policies)} governing policies: " + ", ".join([p["id"] for p in policies]),
            "details": policies
        })

        # ----------------------------------------------------
        # Step 02: Insights (ML Anomaly & Risk Model)
        # ----------------------------------------------------
        ml_start = time.time()
        risk_score = tx.get("risk_score", 35)
        risk_status = tx.get("risk_status", "Low Risk")
        anomaly_score = tx.get("anomaly_score", -0.05)
        reasons = tx.get("risk_reasons", [])
        if isinstance(reasons, str):
            try:
                reasons = json.loads(reasons)
            except Exception:
                reasons = [reasons]

        ml_insights = {
            "risk_score": risk_score,
            "risk_status": risk_status,
            "isolation_forest_anomaly_score": anomaly_score,
            "model_confidence": 91 if risk_score >= 70 else (88 if risk_score >= 40 else 96),
            "risk_factors": reasons
        }
        timeline.append({
            "step": 2,
            "step_name": "Insights (ML)",
            "agent": "Isolation Forest & Anomaly Model",
            "duration_ms": round((time.time() - ml_start) * 1000, 1),
            "status": "COMPLETED",
            "output_summary": f"Computed calibrated risk score {risk_score}/100 ({risk_status}). Detected {len(reasons)} key risk factors.",
            "details": ml_insights
        })

        # ----------------------------------------------------
        # Step 03: Parallel Swarm Evaluation (Customer + Product)
        # ----------------------------------------------------
        swarm_start = time.time()
        cust_eval = self.customer.analyze(tx)
        prod_eval = self.product.analyze(tx)
        timeline.append({
            "step": 3,
            "step_name": "Swarm Investigation",
            "agent": "Customer & Sales Agents (Parallel)",
            "duration_ms": round((time.time() - swarm_start) * 1000, 1),
            "status": "COMPLETED",
            "output_summary": f"Customer Trust: {cust_eval['trust_score']}/100 ({cust_eval['customer_tier']}). Category Risk: {prod_eval['category_risk_level']}.",
            "details": {
                "customer_agent": cust_eval,
                "product_agent": prod_eval
            }
        })

        # ----------------------------------------------------
        # Step 04: Decide (ReAct Decision Agent)
        # ----------------------------------------------------
        decide_start = time.time()
        proposed_decision = self.decision.decide(
            tx=tx,
            customer_analysis=cust_eval,
            product_analysis=prod_eval,
            rag_policies=policies
        )
        timeline.append({
            "step": 4,
            "step_name": "Decide (ReAct)",
            "agent": proposed_decision["agent"],
            "duration_ms": round((time.time() - decide_start) * 1000, 1),
            "status": "COMPLETED",
            "output_summary": f"Proposed Action: {proposed_decision['proposed_action']} (Confidence: {proposed_decision['confidence_score']}%)",
            "details": proposed_decision
        })

        # ----------------------------------------------------
        # Step 05: Review (Critic Agent & Self-Correction)
        # ----------------------------------------------------
        critic_start = time.time()
        critic_review = self.critic.review(
            tx=tx,
            customer_analysis=cust_eval,
            product_analysis=prod_eval,
            decision=proposed_decision,
            rag_policies=policies
        )

        final_decision = proposed_decision
        self_corrected = False

        # Self-correction feedback loop if Critic catches an error
        if not critic_review["passed"]:
            correction_start = time.time()
            self_corrected = True
            correction_note = "; ".join(critic_review["recommendations"])
            final_decision = self.decision.decide(
                tx=tx,
                customer_analysis=cust_eval,
                product_analysis=prod_eval,
                rag_policies=policies,
                critic_feedback=correction_note
            )
            # Re-review with Critic
            critic_review = self.critic.review(
                tx=tx,
                customer_analysis=cust_eval,
                product_analysis=prod_eval,
                decision=final_decision,
                rag_policies=policies
            )

        timeline.append({
            "step": 5,
            "step_name": "Review (Critic)",
            "agent": critic_review["agent"],
            "duration_ms": round((time.time() - critic_start) * 1000, 1),
            "status": "COMPLETED",
            "output_summary": f"Critic Verdict: {critic_review['verdict']} ({critic_review['compliance_rating']}). Self-correction applied: {self_corrected}",
            "details": {
                "initial_critic_review": critic_review,
                "self_corrected": self_corrected,
                "final_authorized_action": final_decision["proposed_action"]
            }
        })

        # ----------------------------------------------------
        # Step 06: Act (Deterministic Tool Calling)
        # ----------------------------------------------------
        act_start = time.time()
        tool_to_call = final_decision["tool_to_execute"]
        action_result = {}

        if tool_to_call == "hold_payment_tool":
            action_result = tools.hold_payment_tool(order_id, final_decision["rationale"])
        elif tool_to_call == "trigger_kyc_tool":
            action_result = tools.trigger_kyc_tool(order_id, tx.get("customer_id", "cust_1"), final_decision["rationale"])
        elif tool_to_call == "expedite_fulfillment_tool":
            action_result = tools.expedite_fulfillment_tool(order_id, tx.get("customer_id", "cust_1"), cust_eval["customer_tier"])
        elif tool_to_call == "notify_merchant_fraud_tool":
            action_result = tools.notify_merchant_fraud_tool(order_id, risk_score, reasons)
        else:
            action_result = tools.auto_approve_tool(order_id)

        timeline.append({
            "step": 6,
            "step_name": "Act (Tool Calling)",
            "agent": "Deterministic Tool Executor",
            "duration_ms": round((time.time() - act_start) * 1000, 1),
            "status": "SUCCESS",
            "output_summary": f"Executed tool `{tool_to_call}` -> {action_result['action']}",
            "details": action_result
        })

        total_latency_ms = round((time.time() - start_time) * 1000, 1)

        # Build comprehensive final response
        return {
            "order_id": order_id,
            "total_latency_ms": total_latency_ms,
            "risk_score": risk_score,
            "risk_status": risk_status,
            "amount": tx.get("payment_value", 0.0),
            "payment_type": tx.get("payment_type", "credit_card"),
            "customer_id": tx.get("customer_id", "Unknown"),
            "product_category": prod_eval["product_category"],
            "ml_insights": ml_insights,
            "customer_analysis": cust_eval,
            "product_analysis": prod_eval,
            "rag_policies": policies,
            "decision": final_decision,
            "critic_review": critic_review,
            "action_executed": action_result,
            "timeline": timeline
        }

orchestrator = SwarmOrchestrator()

if __name__ == "__main__":
    # Test sample transaction
    sample_tx = {
        "order_id": "DzNM8wrcMGFH",
        "customer_id": "9Csx6oXlpLl1",
        "customer_city": "Bebedouro",
        "customer_state": "SP",
        "payment_type": "wallet",
        "payment_installments": 1,
        "payment_value": 1521.75,
        "price": 779.0,
        "shipping_charges": 34.86,
        "product_category_name": "toys",
        "risk_score": 93,
        "risk_status": "High Risk",
        "risk_reasons": ["Unusually high transaction amount ($1,521.75)", "High-value wallet transaction"],
        "anomaly_score": -0.15,
        "customer_order_count": 1
    }
    result = orchestrator.run_workflow(sample_tx)
    print("\n✅ Multi-Agent Orchestrator Test Finished in", result["total_latency_ms"], "ms")
    print("Action Executed:", result["action_executed"]["action"])
    print("Critic Verdict:", result["critic_review"]["verdict"])
