import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";
import * as fs from "fs";
import * as readline from "readline";
import * as dotenv from "dotenv";
dotenv.config({ path: "../.env" });

async function main() {
  const apiKey = process.env.CIRCLE_API_KEY;
  const entitySecret = process.env.CIRCLE_ENTITY_SECRET;

  if (!apiKey || !entitySecret) {
    console.error("ERROR: CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET must be set in .env");
    console.error("Get them from: https://developers.circle.com");
    process.exit(1);
  }

  const client = initiateDeveloperControlledWalletsClient({
    apiKey,
    entitySecret,
  });

  console.log("Creating MCPay wallet set on Arc Testnet...");

  const walletSet = await client.createWalletSet({
    name: "mcpay-demo-" + Date.now(),
  });
  const walletSetId = walletSet.data?.walletSet?.id!;
  console.log("Wallet set created:", walletSetId);

  // Create agent wallet (the AI agent that pays for tool calls)
  const agentResult = await client.createWallets({
    blockchains: ["ARC-TESTNET"],
    count: 1,
    walletSetId,
  });
  const agentWallet = agentResult.data?.wallets?.[0]!;
  console.log("\nAgent wallet created:");
  console.log("  ID:", agentWallet.id);
  console.log("  Address:", agentWallet.address);

  // Create developer wallet (receives $0.001 per tool call)
  const devResult = await client.createWallets({
    blockchains: ["ARC-TESTNET"],
    count: 1,
    walletSetId,
  });
  const devWallet = devResult.data?.wallets?.[0]!;
  console.log("\nDeveloper wallet created:");
  console.log("  ID:", devWallet.id);
  console.log("  Address:", devWallet.address);

  // Prompt to fund agent wallet
  console.log("\n" + "=".repeat(60));
  console.log("ACTION REQUIRED: Fund the AGENT wallet with testnet USDC");
  console.log("=".repeat(60));
  console.log("1. Go to: https://faucet.circle.com");
  console.log("2. Select: Arc Testnet");
  console.log("3. Paste agent address:", agentWallet.address);
  console.log("4. Request 20 USDC");
  console.log("5. Wait for confirmation (usually 30 seconds)");
  console.log("\nPress ENTER when done...");

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise<void>((resolve) =>
    rl.once("line", () => {
      rl.close();
      resolve();
    })
  );

  // Verify balance
  try {
    const balances = await client.getWalletTokenBalance({ id: agentWallet.id });
    const usdcBalance = balances.data?.tokenBalances?.find(
      (b: any) => b.token?.symbol === "USDC"
    );
    console.log(
      "\nAgent wallet USDC balance:",
      usdcBalance?.amount || "0 (may take a moment to appear)"
    );
  } catch {
    console.log("\nCould not verify balance yet — it may take a moment to appear.");
  }

  // Write to .env
  const envPath = "../.env";
  let currentEnv = fs.readFileSync(envPath, "utf8");
  currentEnv = currentEnv
    .replace(/AGENT_WALLET_ID=.*/g, `AGENT_WALLET_ID=${agentWallet.id}`)
    .replace(/AGENT_WALLET_ADDRESS=.*/g, `AGENT_WALLET_ADDRESS=${agentWallet.address}`)
    .replace(/DEVELOPER_WALLET_ID=.*/g, `DEVELOPER_WALLET_ID=${devWallet.id}`)
    .replace(/DEVELOPER_WALLET_ADDRESS=.*/g, `DEVELOPER_WALLET_ADDRESS=${devWallet.address}`)
    .replace(/PAYMENT_RECIPIENT_ADDRESS=.*/g, `PAYMENT_RECIPIENT_ADDRESS=${devWallet.address}`);

  fs.writeFileSync(envPath, currentEnv);
  console.log("\nAll wallet IDs saved to .env");
  console.log("\nSetup complete! You can now run the MCPay server.");
}

main().catch(console.error);
