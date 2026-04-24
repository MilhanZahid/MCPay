import { useState, useEffect, useCallback } from "react";
import StatCard from "./components/StatCard";
import WalletBalances from "./components/WalletBalances";
import MarginTable from "./components/MarginTable";
import TxFeed from "./components/TxFeed";

const TOOL_SERVER = `http://localhost:${import.meta.env.VITE_TOOL_SERVER_PORT || 3001}`;
const ARC_EXPLORER = import.meta.env.VITE_ARC_EXPLORER || "https://testnet.arcscan.app";

interface Transaction {
  id: number;
  timestamp: string;
  txHash: string;
  tool: string;
  amount: string;
  currency: string;
  status: string;
}

interface WalletBalance {
  balance: string;
  walletAddress: string;
}

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [devBalance, setDevBalance] = useState<WalletBalance>({
    balance: "0.0000",
    walletAddress: "",
  });
  const [agentBalance, setAgentBalance] = useState<WalletBalance>({
    balance: "0.0000",
    walletAddress: "",
  });
  const [isLive, setIsLive] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [txRes, devRes, agentRes] = await Promise.all([
        fetch(`${TOOL_SERVER}/transactions`),
        fetch(`${TOOL_SERVER}/developer-balance`),
        fetch(`${TOOL_SERVER}/agent-balance`),
      ]);

      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData.transactions || []);
        setIsLive(true);
      }
      if (devRes.ok) setDevBalance(await devRes.json());
      if (agentRes.ok) setAgentBalance(await agentRes.json());
    } catch {
      setIsLive(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const txCount = transactions.length;
  const totalEarned = (txCount * 0.001).toFixed(4);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header__brand">
          <h1>MCPay</h1>
          <p className="header__subtitle">
            Payment layer for MCP tool servers · Arc Testnet · Circle Nanopayments
          </p>
        </div>
        <div className="header__status">
          <div
            className={`header__dot ${isLive ? "header__dot--live" : "header__dot--offline"}`}
          />
          <span
            className={`header__status-text ${
              isLive ? "header__status-text--live" : "header__status-text--offline"
            }`}
          >
            {isLive ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </header>

      {/* Main Stats */}
      <div className="stats-grid">
        <StatCard
          label="On-chain transactions"
          value={String(txCount)}
          detail="Arc Testnet"
          color="green"
        />
        <StatCard
          label="Developer earned"
          value={`$${totalEarned}`}
          detail="USDC"
          color="blue"
        />
        <StatCard
          label="Price per tool call"
          value="$0.001"
          detail="USDC via x402"
          color="purple"
        />
        <StatCard
          label="Gas cost per tx"
          value="$0.00"
          detail="batched by Circle"
          color="teal"
        />
      </div>

      {/* Wallet Balances */}
      <WalletBalances
        agentBalance={agentBalance.balance}
        agentAddress={agentBalance.walletAddress}
        devBalance={devBalance.balance}
        devAddress={devBalance.walletAddress}
      />

      {/* Margin Proof Table — THE most important demo element */}
      <MarginTable txCount={txCount} />

      {/* Live Transaction Feed */}
      <TxFeed transactions={transactions} explorerUrl={ARC_EXPLORER} />

      {/* Footer */}
      <footer className="footer">
        Agentic Economy on Arc Hackathon · lablab.ai ·
        Powered by Circle Nanopayments, x402, Arc, Gemini Flash, Featherless AI
      </footer>
    </div>
  );
}
