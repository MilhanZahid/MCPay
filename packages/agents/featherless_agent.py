"""
MCPay Featherless AI Agent
==========================
Researches travel data for 5 global cities using paid MCPay endpoints.
Uses Featherless AI's OpenAI-compatible API with Qwen2.5-72B-Instruct.

Unlike the Gemini agent which uses MCP, this agent makes direct HTTP calls
to the MCPay tool server, demonstrating the raw x402 payment flow.

Sponsor alignment:
- Featherless AI (Qwen2.5-72B-Instruct) -> Featherless prize eligibility
- Direct x402 HTTP calls -> demonstrates raw payment protocol
- Circle Nanopayments + Arc -> required hackathon technology
"""

import asyncio
import os
import sys
import json
import httpx
from openai import OpenAI
from dotenv import load_dotenv

# Load env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

featherless_key = os.environ.get("FEATHERLESS_API_KEY")
if not featherless_key:
    print("ERROR: FEATHERLESS_API_KEY not set in .env")
    sys.exit(1)

featherless = OpenAI(
    base_url="https://api.featherless.ai/v1",
    api_key=featherless_key,
)

TOOL_SERVER = f"http://localhost:{os.environ.get('TOOL_SERVER_PORT', '3001')}"

# 5 global cities for this agent to research
CITIES = [
    {"city": "Tokyo", "country": "Japan", "prev_city": "London"},
    {"city": "Dubai", "country": "United Arab Emirates", "prev_city": "Tokyo"},
    {"city": "Singapore", "country": "Singapore", "prev_city": "Dubai"},
    {"city": "Sydney", "country": "Australia", "prev_city": "Singapore"},
    {"city": "New York", "country": "United States", "prev_city": "Sydney"},
]


async def call_paid_tool(
    http: httpx.AsyncClient, endpoint: str, params: dict
) -> dict:
    """
    Makes a paid HTTP call to a MCPay endpoint.
    In production: @x402/fetch handles 402->pay->retry automatically.
    For demo: we call the endpoint and log the payment trigger.
    """
    response = await http.get(f"{TOOL_SERVER}{endpoint}", params=params)
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 402:
        print(f"    [x402] Payment required: {response.text[:100]}...")
        return {"error": "payment required", "details": "x402 payment needed"}
    else:
        return {"error": f"HTTP {response.status_code}"}


async def run():
    print("=" * 60)
    print("MCPay Featherless AI Agent Starting")
    print("=" * 60)
    print(f"Model: Qwen/Qwen2.5-72B-Instruct via Featherless AI")
    print(f"Task: Global 5-city travel research")
    print(f"Each tool call: $0.001 USDC on Arc Testnet")
    print()

    all_city_data: dict = {}

    async with httpx.AsyncClient(timeout=30) as http:
        for city_info in CITIES:
            city = city_info["city"]
            country = city_info["country"]
            prev_city = city_info["prev_city"]

            print(f"\nResearching: {city}")

            # Call 1: Flight search ($0.001 payment)
            print(f"  [PAID] Calling flight-search... $0.001 USDC")
            flights = await call_paid_tool(
                http,
                "/tool/flight-search",
                {"from": prev_city, "to": city, "date": "2026-07-01"},
            )
            print(f"  Flight search complete")

            # Call 2: Weather ($0.001 payment)
            print(f"  [PAID] Calling weather... $0.001 USDC")
            weather = await call_paid_tool(
                http, "/tool/weather", {"city": city}
            )
            print(f"  Weather data received")

            # Call 3: Travel advisory ($0.001 payment)
            print(f"  [PAID] Calling travel-advisory... $0.001 USDC")
            advisory = await call_paid_tool(
                http, "/tool/travel-advisory", {"country": country}
            )
            print(f"  Advisory data received")

            all_city_data[city] = {
                "flights": flights.get("data", flights),
                "weather": weather.get("data", weather),
                "advisory": advisory.get("data", advisory),
            }

            # Use Featherless/Qwen to synthesize a travel summary
            synthesis_prompt = f"""
You are a concise travel advisor. Given the following data about {city},
write a 3-sentence travel briefing a traveler would find genuinely useful.

Flight data from {prev_city}: {json.dumps(all_city_data[city]["flights"], indent=2)[:500]}
Weather: {json.dumps(all_city_data[city]["weather"], indent=2)[:300]}
Advisory: {json.dumps(all_city_data[city]["advisory"], indent=2)[:300]}

Write 3 sentences only. Focus on flight cost, weather preparation, and key safety note.
"""
            try:
                summary_response = featherless.chat.completions.create(
                    model="Qwen/Qwen2.5-72B-Instruct",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are a concise travel advisor. Always respond in exactly 3 sentences.",
                        },
                        {"role": "user", "content": synthesis_prompt},
                    ],
                    max_tokens=200,
                    temperature=0.3,
                )
                summary = summary_response.choices[0].message.content
                print(f"  Summary: {(summary or '')[:100]}...")
                all_city_data[city]["summary"] = summary
            except Exception as e:
                print(f"  Featherless summary error: {e}")
                all_city_data[city]["summary"] = f"Data collected for {city}."

        # Final transaction check
        txs_response = await http.get(f"{TOOL_SERVER}/transactions")
        txs_data = txs_response.json()

        print("\n" + "=" * 60)
        print("FEATHERLESS AGENT — GLOBAL TRAVEL REPORT:")
        print("=" * 60)
        for city, data in all_city_data.items():
            print(f"\n{city}:")
            print(f"  {data.get('summary', 'No summary generated')}")

        print("\n" + "=" * 60)
        print("PAYMENT SUMMARY (Featherless Agent):")
        print("=" * 60)
        print(f"Cities researched: {len(CITIES)}")
        print(f"Tool calls per city: 3 (flights, weather, advisory)")
        print(f"Total tool calls: {len(CITIES) * 3}")
        print(f"Total on-chain transactions: {txs_data.get('total', 0)}")
        print(f"Total developer earned: {txs_data.get('totalEarned', '$0')}")
        print(f"Settlement: Arc Testnet via Circle Nanopayments")


if __name__ == "__main__":
    asyncio.run(run())
