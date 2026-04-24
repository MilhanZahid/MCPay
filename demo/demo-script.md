# MCPay — 2-Minute Demo Script

## Setup (before demo starts)
- Tool server running on localhost:3001
- Dashboard open at localhost:5173
- Both agent scripts ready to run

---

## The Script (2 minutes)

### Opening (15 seconds)

"MCPay adds a payment layer to MCP tool servers so AI agents pay per tool call in USDC on Arc — the first economic infrastructure for the MCP ecosystem."

"Today there are 10,000+ MCP tools. Every single one is free. Developers earn zero per call. MCPay changes that."

### Show Dashboard (15 seconds)

"This is our live dashboard. Right now — zero transactions. Let's fix that."

"I'm about to run two AI agents. A Gemini Flash agent planning a European trip, and a Featherless Qwen agent researching global cities. Each one calls three paid tools per city."

### Start the Agents (10 seconds)

Run `python run_both_agents.py` in terminal.

"Watch the transaction counter."

### Wait for Transactions (30 seconds)

Let counter run. Point at the screen as numbers climb.

"Every number you see is a real on-chain transaction on Arc Testnet. Each one is $0.001 USDC. The developer wallet is filling up in real time."

### Margin Proof (30 seconds — THE KEY MOMENT)

Point directly at the margin table.

"Here's why this only works on Arc. Look at the numbers."

"For these [X] tool calls: Stripe would charge $[X × 0.30] in fees alone — that's 300 times the value of each payment. Impossible."

"Ethereum L2 gas would cost $[X × 0.05]. Still 50 times the payment value. Unviable."

"Arc with Circle Nanopayments: zero dollars. Circle batches the settlement. The developer keeps every cent. This business model does not exist on any other chain."

### Arc Explorer (10 seconds)

Click a transaction hash in the feed.

"Every transaction is verifiable on Arc's block explorer."

### Close (10 seconds)

"MCPay is plug-and-play. One npm package, three lines of code. Any MCP developer adds it to their server and starts earning per call."

"That's our contribution to the agentic economy on Arc."

---

## Key Numbers to Memorize
- Price per call: $0.001 USDC
- Stripe fee ratio: 300:1 (impossible)
- Ethereum fee ratio: 50:1 (unviable)
- Arc fee: $0.00 (Circle batches)
- Target transactions in demo: 30+
