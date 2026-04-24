"""
Run both MCPay agents sequentially.
Gemini agent: 5 European cities x 3 tools = 15 transactions
Featherless agent: 5 Global cities x 3 tools = 15 transactions
Total: 30+ on-chain transactions on Arc Testnet
"""

import subprocess
import sys
import os


def main():
    agents_dir = os.path.dirname(os.path.abspath(__file__))

    print("=" * 60)
    print("Starting MCPay Full Demo - Both Agents")
    print("=" * 60)
    print("Target: 30+ on-chain transactions on Arc Testnet")
    print()

    print("=" * 60)
    print("AGENT 1: Gemini Flash (European Itinerary)")
    print("=" * 60)
    subprocess.run(
        [sys.executable, os.path.join(agents_dir, "gemini_agent.py")],
    )

    print()
    print("=" * 60)
    print("AGENT 2: Featherless/Qwen (Global Research)")
    print("=" * 60)
    subprocess.run(
        [sys.executable, os.path.join(agents_dir, "featherless_agent.py")],
    )

    print()
    print("=" * 60)
    print("DEMO COMPLETE")
    print("=" * 60)
    print("Check your dashboard: http://localhost:5173")
    print("Check Arc explorer for transactions")


if __name__ == "__main__":
    main()
