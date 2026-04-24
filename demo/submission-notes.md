# MCPay — Hackathon Submission Notes

## Project Title
MCPay — Payment Infrastructure Layer for MCP Tool Servers

## One-Line Description
MCPay adds x402 nanopayments to MCP tool servers so AI agents pay $0.001 USDC per tool call on Arc Testnet, creating the first economic model for the MCP ecosystem.

## Tracks
- Track 1: Per-API Monetization Engine
- Track 2: Agent-to-Agent Payment Loop

## Problem
10,000+ MCP tool servers exist with zero monetization. Traditional payment rails (Stripe: $0.30/tx, Ethereum: $0.05/tx) make sub-cent billing mathematically impossible.

## Solution
MCPay is drop-in Express middleware using x402 + Circle Nanopayments on Arc. Agents pay $0.001 USDC per tool call with zero gas cost (Circle batches settlement).

## Technologies Used
- **Arc Testnet** — on-chain settlement
- **USDC** — payment currency
- **Circle Nanopayments** — gas-free batched settlement
- **Circle Developer-Controlled Wallets** — agent + developer wallets
- **x402 Protocol** (coinbase/x402) — HTTP payment standard
- **Gemini Flash** (gemini-2.5-flash-preview-04-17) — primary AI agent
- **Featherless AI** (Qwen2.5-72B-Instruct) — secondary AI agent
- **MCP Protocol** — tool connection standard
- **React + Vite** — live demo dashboard

## On-Chain Proof
- 30+ transactions per demo run (15 per agent × 2 agents)
- Run agents multiple times to exceed 50 transaction minimum
- Each transaction: $0.001 USDC on Arc Testnet
- Verifiable at testnet.arcscan.app

## Margin Explanation
For 80 tool calls at $0.001 each ($0.08 total value):
- Stripe: $24.00 in fees (300× payment value) — IMPOSSIBLE
- Ethereum L2: $4.00 in gas (50× payment value) — UNVIABLE
- Arc Nanopayments: $0.00 in fees — WORKS

## Circle Product Feedback (for $500 USDC bonus)

### Products Used
- Arc Testnet (settlement layer)
- USDC (payment currency)
- Circle Nanopayments (gas-free batched settlement)
- Circle Developer-Controlled Wallets SDK (@circle-fin/developer-controlled-wallets)
- x402 protocol (@x402/express)

### What Worked Well
- Developer-Controlled Wallets SDK was straightforward to set up
- Arc Testnet faucet was easy to use and fast
- x402 middleware from the x402 foundation repo had clear examples
- The economic model (zero gas for micropayments) is genuinely novel

### What Could Be Improved
[Fill in honestly from actual build experience]

### Recommendations
[Fill in honestly — judges appreciate genuine developer feedback]

## Demo Video Checklist
- [ ] Show dashboard with live status
- [ ] Run agents, show transaction counter climbing
- [ ] Point out margin table with exact numbers
- [ ] Click transaction hash → Arc explorer
- [ ] Show developer wallet balance growing
- [ ] Explain why this fails on Stripe and Ethereum
