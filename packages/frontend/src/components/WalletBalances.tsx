interface WalletBalancesProps {
  agentBalance: string;
  agentAddress: string;
  devBalance: string;
  devAddress: string;
}

export default function WalletBalances({
  agentBalance,
  agentAddress,
  devBalance,
  devAddress,
}: WalletBalancesProps) {
  return (
    <div className="wallets-grid">
      <div className="card" id="wallet-agent">
        <p className="wallet-card__label">
          <span className="wallet-card__indicator wallet-card__indicator--paying" />
          Agent wallet (paying)
        </p>
        <p className="wallet-card__balance wallet-card__balance--depleting">
          {agentBalance} USDC
        </p>
        <p className="wallet-card__address">
          {agentAddress || "Not configured — run setup script"}
        </p>
      </div>
      <div className="card" id="wallet-developer">
        <p className="wallet-card__label">
          <span className="wallet-card__indicator wallet-card__indicator--earning" />
          Developer wallet (earning)
        </p>
        <p className="wallet-card__balance wallet-card__balance--growing">
          {devBalance} USDC
        </p>
        <p className="wallet-card__address">
          {devAddress || "Not configured — run setup script"}
        </p>
      </div>
    </div>
  );
}
