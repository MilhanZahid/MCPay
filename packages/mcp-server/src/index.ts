import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import { x402Client, wrapAxiosWithPayment } from "@x402/axios";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

// This MCP server wraps the HTTP tool server endpoints.
// When an agent calls a tool, this server makes an HTTP request to the tool server.
// The tool server has x402 payment middleware — so the MCP server uses @x402/axios
// to automatically handle the 402 → pay → retry flow.

const HTTP_BASE = `http://localhost:${process.env.TOOL_SERVER_PORT || 3001}`;

// Setup x402 client for automatic payment on 402 responses
// The EVM_PRIVATE_KEY is the agent wallet's private key
const evmPrivateKey = process.env.EVM_PRIVATE_KEY as `0x${string}` | undefined;

async function createHttpClient() {
  if (evmPrivateKey) {
    // Full x402 payment flow: auto-detect 402, sign payment, retry
    const client = new x402Client();
    const signer = privateKeyToAccount(evmPrivateKey);
    client.register("eip155:*", new ExactEvmScheme(signer));
    return wrapAxiosWithPayment(axios.create({ baseURL: HTTP_BASE }), client);
  }
  // Fallback: plain axios (for demos where payment is handled server-side)
  return axios.create({ baseURL: HTTP_BASE });
}

async function main() {
  const api = await createHttpClient();

  const server = new McpServer({
    name: "mcpay-travel",
    version: "1.0.0",
    description:
      "MCPay paid travel data tools. Each call costs $0.001 USDC settled on Arc Testnet via Circle Nanopayments.",
  });

  // TOOL 1: Flight Search — $0.001 USDC per call
  server.tool(
    "search_flights",
    "Search for available flights between two cities. Each call costs $0.001 USDC paid via Circle Nanopayments on Arc Testnet.",
    {
      from: z.string().describe("Departure city name (e.g. 'London', 'Paris')"),
      to: z.string().describe("Destination city name (e.g. 'Amsterdam', 'Berlin')"),
      date: z.string().describe("Travel date in YYYY-MM-DD format"),
    },
    async ({ from, to, date }) => {
      try {
        const response = await api.get("/tool/flight-search", {
          params: { from, to, date },
        });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(response.data.data, null, 2) }],
        };
      } catch (error: any) {
        if (error.response?.status === 402) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Payment required: ${JSON.stringify(error.response.data)}. Ensure EVM_PRIVATE_KEY is set with a funded wallet.`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [{ type: "text" as const, text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    },
  );

  // TOOL 2: Weather — $0.001 USDC per call
  server.tool(
    "get_weather",
    "Get current weather conditions for any city. Each call costs $0.001 USDC paid via Circle Nanopayments on Arc Testnet.",
    {
      city: z.string().describe("City name to get weather for (e.g. 'London', 'Tokyo')"),
    },
    async ({ city }) => {
      try {
        const response = await api.get("/tool/weather", { params: { city } });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(response.data.data, null, 2) }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    },
  );

  // TOOL 3: Travel Advisory — $0.001 USDC per call
  server.tool(
    "get_travel_advisory",
    "Get travel safety advisory and entry requirements for any country. Each call costs $0.001 USDC paid via Circle Nanopayments on Arc Testnet.",
    {
      country: z.string().describe("Country name (e.g. 'France', 'Japan', 'Germany')"),
    },
    async ({ country }) => {
      try {
        const response = await api.get("/tool/travel-advisory", { params: { country } });
        return {
          content: [{ type: "text" as const, text: JSON.stringify(response.data.data, null, 2) }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCPay MCP Server running — waiting for agent connections");
}

main().catch(console.error);
