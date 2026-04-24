"""
MCPay Gemini Flash Agent
========================
Plans a 5-city European travel itinerary using paid MCP tools.
Each tool call costs $0.001 USDC, paid via Circle Nanopayments on Arc Testnet.

Uses Google's Gemini Flash model with native MCP support via google-genai SDK.
The SDK handles the tool calling loop automatically when an MCP session
is passed as a tool.

Sponsor alignment:
- Gemini Flash (gemini-2.5-flash-preview-04-17) -> Google prize eligibility
- MCP protocol -> demonstrates the MCPay core concept
- Circle Nanopayments + Arc -> required hackathon technology
"""

import asyncio
import os
import sys
import httpx
from dotenv import load_dotenv

# Load env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

from google import genai
from google.genai import types
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

TOOL_SERVER_PORT = os.environ.get("TOOL_SERVER_PORT", "3001")

TASK = """
You are a professional travel planning assistant with access to paid real-time travel data tools.

Your task: Plan a comprehensive 10-day European trip visiting these 5 cities in order:
1. London (arrival city)
2. Paris
3. Amsterdam
4. Berlin
5. Rome (departure city)

For EACH city, you MUST use ALL THREE tools:
- search_flights: Find the best flight from the previous city (or arrival in London)
- get_weather: Check current weather conditions
- get_travel_advisory: Get safety and entry requirements for the country

After gathering all data, produce a structured day-by-day itinerary with:
- Flight details between each city
- Weather expectations
- Safety notes
- Estimated total flight costs

Note: Each tool call costs $0.001 USDC from your wallet, settled on Arc Testnet.
Make all the tool calls needed. Use date 2026-06-15 for all flight searches.
For London, search a flight from "New York" to "London" as the arrival flight.
"""


async def run():
    print("=" * 60)
    print("MCPay Gemini Flash Agent Starting")
    print("=" * 60)
    print(f"Model: gemini-2.5-flash-preview-04-17")
    print(f"Task: 5-city European itinerary planning")
    print(f"Each tool call: $0.001 USDC on Arc Testnet")
    print(f"Agent wallet: {os.environ.get('AGENT_WALLET_ADDRESS', 'not set')}")
    print()

    gemini_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_key:
        print("ERROR: GEMINI_API_KEY not set in .env")
        sys.exit(1)

    # Determine MCP server command
    mcp_server_path = os.path.join(os.path.dirname(__file__), "..", "mcp-server")
    server_params = StdioServerParameters(
        command="npx",
        args=["tsx", os.path.join(mcp_server_path, "src", "index.ts")],
        env={**os.environ},
    )

    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools_list = await session.list_tools()
            print("Available paid MCPay tools:")
            for tool in tools_list.tools:
                desc = tool.description or ""
                print(f"  - {tool.name}: {desc[:60]}...")
            print()

            # Create Gemini client with correct google-genai SDK
            client = genai.Client(api_key=gemini_key)

            print("Gemini agent starting task...")
            print("Watch the dashboard at http://localhost:5173 for live payments")
            print()

            # Generate content with MCP session as tools
            # The SDK handles the agentic loop automatically
            response = await client.aio.models.generate_content(
                model="gemini-2.5-flash-preview-04-17",
                contents=TASK,
                config=types.GenerateContentConfig(
                    tools=[session],  # Pass MCP session directly
                    temperature=0.2,
                    max_output_tokens=4000,
                    system_instruction="""You are a travel planning assistant.
You have access to paid travel data tools via MCPay.
Each tool call costs $0.001 USDC on Arc Testnet.
Be thorough - call all three tools for every city.
Provide detailed, structured output.""",
                ),
            )

            print("\n" + "=" * 60)
            print("TRAVEL ITINERARY GENERATED:")
            print("=" * 60)
            print(response.text)

            # Check transaction count
            async with httpx.AsyncClient() as http:
                txs_response = await http.get(
                    f"http://localhost:{TOOL_SERVER_PORT}/transactions"
                )
                txs_data = txs_response.json()
                total_txs = txs_data.get("total", 0)
                total_earned = txs_data.get("totalEarned", "$0")

                print("\n" + "=" * 60)
                print("PAYMENT SUMMARY (Gemini Agent):")
                print("=" * 60)
                print(f"On-chain transactions: {total_txs}")
                print(f"Developer earned: {total_earned}")
                print(f"Settlement: Arc Testnet via Circle Nanopayments")
                explorer = os.environ.get("ARC_TESTNET_EXPLORER", "https://testnet.arcscan.app")
                dev_addr = os.environ.get("DEVELOPER_WALLET_ADDRESS", "")
                print(f"Explorer: {explorer}/address/{dev_addr}")

                recent_txs = txs_data.get("transactions", [])[-5:]
                if recent_txs:
                    print("\nMost recent transactions:")
                    for tx in recent_txs:
                        print(
                            f"  [{tx['id']}] {tx['tool']} | $0.001 USDC | {tx['txHash'][:22]}..."
                        )


if __name__ == "__main__":
    asyncio.run(run())
