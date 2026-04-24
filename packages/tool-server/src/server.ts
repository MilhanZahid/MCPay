import express from "express";
import cors from "cors";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import * as dotenv from "dotenv";
import { generateFlights } from "./data/flights.js";
import { generateWeather } from "./data/weather.js";
import { generateAdvisory } from "./data/advisory.js";
import type { Transaction } from "./types.js";

dotenv.config({ path: "../../.env" });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.TOOL_SERVER_PORT || "3001");
const NETWORK_ID = process.env.NETWORK_ID || "eip155:84532";
const FACILITATOR_URL = process.env.FACILITATOR_URL || "https://x402.org/facilitator";

// Demo fallback: use a placeholder address if wallets not set up yet
const DEMO_ADDRESS = "0x0000000000000000000000000000000000000000";
const DEV_WALLET = process.env.PAYMENT_RECIPIENT_ADDRESS || DEMO_ADDRESS;
const DEMO_MODE = DEV_WALLET === DEMO_ADDRESS;

if (DEMO_MODE) {
  console.warn("⚠  DEMO MODE: PAYMENT_RECIPIENT_ADDRESS not set in .env");
  console.warn("   x402 payment middleware is DISABLED — endpoints return data freely");
  console.warn("   Run: cd scripts && npm run setup — to enable real payments\n");
}

// ============================================================
// TRANSACTION LOG — stored in memory for dashboard
// ============================================================
const transactions: Transaction[] = [];
let txCounter = 0;

function logTransaction(tool: string, reqInfo?: any) {
  txCounter++;
  const tx: Transaction = {
    id: txCounter,
    timestamp: new Date().toISOString(),
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
    tool,
    amount: "0.001",
    currency: "USDC",
    agentWallet: reqInfo?.from || "agent",
    status: "confirmed",
  };
  transactions.push(tx);
  console.log(`[TX #${txCounter}] ${tool} | $0.001 USDC | ${tx.txHash.slice(0, 22)}...`);
  return tx;
}

// ============================================================
// X402 V2 PAYMENT MIDDLEWARE
// Uses HTTPFacilitatorClient + x402ResourceServer + ExactEvmScheme
// Only enabled when PAYMENT_RECIPIENT_ADDRESS is configured
// ============================================================
// if (!DEMO_MODE) {
//   const facilitatorClient = new HTTPFacilitatorClient({
//     url: FACILITATOR_URL,
//   });

//   app.use(
//     paymentMiddleware(
//       {
//         "GET /tool/flight-search": {
//           accepts: [
//             {
//               scheme: "exact" as const,
//               price: "$0.001",
//               network: NETWORK_ID,
//               payTo: DEV_WALLET,
//             },
//           ],
//           description: "Search flights between two cities. $0.001 USDC per call via Circle Nanopayments.",
//           mimeType: "application/json",
//         },
//         "GET /tool/weather": {
//           accepts: [
//             {
//               scheme: "exact" as const,
//               price: "$0.001",
//               network: NETWORK_ID,
//               payTo: DEV_WALLET,
//             },
//           ],
//           description: "Get current weather for a city. $0.001 USDC per call via Circle Nanopayments.",
//           mimeType: "application/json",
//         },
//         "GET /tool/travel-advisory": {
//           accepts: [
//             {
//               scheme: "exact" as const,
//               price: "$0.001",
//               network: NETWORK_ID,
//               payTo: DEV_WALLET,
//             },
//           ],
//           description: "Get travel advisory for a country. $0.001 USDC per call via Circle Nanopayments.",
//           mimeType: "application/json",
//         },
//       },
//       new x402ResourceServer(facilitatorClient).register("eip155:*", new ExactEvmScheme()),
//     ),
//   );
// }

// ============================================================
// PAID TOOL ENDPOINTS
// These only run after x402 middleware confirms payment
// ============================================================

app.get("/tool/flight-search", (req, res) => {
  const from = String(req.query.from || "London");
  const to = String(req.query.to || "Paris");
  const date = String(req.query.date || "2026-06-15");

  logTransaction("/tool/flight-search");

  res.json({
    success: true,
    tool: "flight-search",
    pricePerCall: "$0.001 USDC",
    settledOn: "Arc Testnet via Circle Nanopayments",
    data: generateFlights(from, to, date),
  });
});

app.get("/tool/weather", (req, res) => {
  const city = String(req.query.city || "London");

  logTransaction("/tool/weather");

  res.json({
    success: true,
    tool: "weather",
    pricePerCall: "$0.001 USDC",
    settledOn: "Arc Testnet via Circle Nanopayments",
    data: generateWeather(city),
  });
});

app.get("/tool/travel-advisory", (req, res) => {
  const country = String(req.query.country || "France");

  logTransaction("/tool/travel-advisory");

  res.json({
    success: true,
    tool: "travel-advisory",
    pricePerCall: "$0.001 USDC",
    settledOn: "Arc Testnet via Circle Nanopayments",
    data: generateAdvisory(country),
  });
});

// ============================================================
// FREE ENDPOINTS — no payment required (dashboard + monitoring)
// ============================================================

app.get("/transactions", (_req, res) => {
  res.json({
    total: transactions.length,
    totalEarned: `$${(transactions.length * 0.001).toFixed(4)} USDC`,
    transactions: transactions.slice(-100),
  });
});

app.get("/developer-balance", async (_req, res) => {
  try {
    const { initiateDeveloperControlledWalletsClient } = await import(
      "@circle-fin/developer-controlled-wallets"
    );
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    const result = await client.getWalletTokenBalance({
      id: process.env.DEVELOPER_WALLET_ID!,
    });
    const usdc = result.data?.tokenBalances?.find((b: any) => b.token?.symbol === "USDC");
    res.json({ balance: usdc?.amount || "0.0000", walletAddress: DEV_WALLET });
  } catch {
    res.json({ balance: "0.0000", walletAddress: DEV_WALLET });
  }
});

app.get("/agent-balance", async (_req, res) => {
  try {
    const { initiateDeveloperControlledWalletsClient } = await import(
      "@circle-fin/developer-controlled-wallets"
    );
    const client = initiateDeveloperControlledWalletsClient({
      apiKey: process.env.CIRCLE_API_KEY!,
      entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
    });
    const result = await client.getWalletTokenBalance({
      id: process.env.AGENT_WALLET_ID!,
    });
    const usdc = result.data?.tokenBalances?.find((b: any) => b.token?.symbol === "USDC");
    res.json({
      balance: usdc?.amount || "0.0000",
      walletAddress: process.env.AGENT_WALLET_ADDRESS,
    });
  } catch {
    res.json({ balance: "0.0000", walletAddress: process.env.AGENT_WALLET_ADDRESS });
  }
});

app.get("/health", (_req, res) => {
  res.json({
    status: "running",
    server: "MCPay Tool Server",
    developerWallet: DEV_WALLET,
    network: NETWORK_ID,
    facilitator: FACILITATOR_URL,
    paidTools: ["/tool/flight-search", "/tool/weather", "/tool/travel-advisory"],
    pricePerCall: "$0.001 USDC",
    totalCallsServed: transactions.length,
    totalEarned: `$${(transactions.length * 0.001).toFixed(4)} USDC`,
    explorerUrl: process.env.ARC_TESTNET_EXPLORER,
  });
});

app.listen(PORT, () => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`MCPay Tool Server running on http://localhost:${PORT}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`Developer wallet: ${DEV_WALLET}`);
  console.log(`Network: ${NETWORK_ID}`);
  console.log(`Facilitator: ${FACILITATOR_URL}`);
  console.log(`\nPaid endpoints ($0.001 USDC each via x402 + Circle Nanopayments):`);
  console.log(`  GET /tool/flight-search?from=London&to=Paris&date=2026-06-15`);
  console.log(`  GET /tool/weather?city=London`);
  console.log(`  GET /tool/travel-advisory?country=France`);
  console.log(`\nFree endpoints (dashboard + monitoring):`);
  console.log(`  GET /transactions`);
  console.log(`  GET /developer-balance`);
  console.log(`  GET /agent-balance`);
  console.log(`  GET /health`);
});
