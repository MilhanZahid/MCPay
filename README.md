# MCPay — Payment Layer for MCP Tool Servers

## Hackathon: Agentic Economy on Arc · lablab.ai · April 2026

### The Problem

10,000+ MCP tool servers exist. Every developer earns $0 per call despite agents using their tools thousands of times daily.

Traditional payment rails make sub-cent billing impossible:
- **Stripe:** $0.30 minimum fee = 300× the value of a $0.001 call
- **Ethereum gas:** $0.05+ per tx = still 50× the call value

### The Solution

MCPay adds x402 Nanopayments to any MCP server. Agents pay $0.001 USDC per tool call. Payments settle on Arc via Circle Nanopayments with zero gas cost. Developers earn per call for the first time.

### Economic Proof (Why Only Arc Makes This Work)

For 80 tool calls at $0.001 each:

| Rail | Gas/Fee Cost | Viability |
|------|-------------|-----------|
| Stripe | $24.00 | Impossible (fee > payment value) |
| Ethereum L2 | $4.00 | Unviable (fee > 50× payment) |
| **Arc Nanopayments** | **$0.00** | **Works — Circle batches settlement** |

### Tracks
- Track 1: Per-API Monetization Engine
- Track 2: Agent-to-Agent Payment Loop

### Technologies Used

| Technology | Role |
|-----------|------|
| Arc Testnet | On-chain settlement layer |
| USDC | Payment currency |
| Circle Nanopayments | Gas-free batched settlement |
| Circle Wallets | Agent and developer wallets |
| x402 Protocol | HTTP payment standard |
| Gemini Flash | Primary AI agent (Google prize) |
| Featherless AI / Qwen | Secondary AI agent (Featherless prize) |
| MCP Protocol | Tool connection standard |

### Architecture

```
AI Agents (Gemini/Featherless)
       │
       ▼
MCP Server (stdio) ──► MCPay HTTP Tool Server (Express)
                              │
                        x402 Middleware
                              │
                     ┌────────┴────────┐
                     │                 │
              Circle Nanopayments   Tool Data
              (Arc Testnet)         (flights, weather, advisory)
                     │
              React Dashboard
              (live tx feed + margin proof)
```

### Running Locally

```bash
# 1. Install all dependencies
npm install

# 2. Install sub-package dependencies
cd packages/tool-server && npm install && cd ../..
cd packages/mcp-server && npm install && cd ../..
cd packages/frontend && npm install && cd ../..
cd scripts && npm install && cd ..

# 3. Fill in API keys in .env
#    - CIRCLE_API_KEY, CIRCLE_ENTITY_SECRET
#    - GEMINI_API_KEY
#    - FEATHERLESS_API_KEY

# 4. Setup wallets (requires Circle API key in .env)
cd scripts && npm run setup && cd ..

# 5. Start tool server (terminal 1)
cd packages/tool-server && npm run dev

# 6. Start frontend (terminal 2)
cd packages/frontend && npm run dev

# 7. Install Python deps + run agents (terminal 3)
cd packages/agents
pip install -r requirements.txt
python run_both_agents.py
```

### Demo

- **Dashboard:** http://localhost:5173
- **Tool server:** http://localhost:3001/health
- **Arc explorer:** https://testnet.arcscan.app

### Built By

**MILHAN ZAHID**
- GitHub: [github.com/MilhanZahid](https://github.com/MilhanZahid)
- Email: write2milhan@gmail.com

### License

MIT
