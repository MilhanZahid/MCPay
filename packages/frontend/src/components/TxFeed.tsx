interface Transaction {
  id: number;
  timestamp: string;
  txHash: string;
  tool: string;
  amount: string;
  currency: string;
  status: string;
}

interface TxFeedProps {
  transactions: Transaction[];
  explorerUrl: string;
}

export default function TxFeed({ transactions, explorerUrl }: TxFeedProps) {
  const reversed = [...transactions].reverse();

  return (
    <div className="tx-feed" id="tx-feed">
      <div className="tx-feed__header">
        <h2 className="tx-feed__title">Live Transaction Feed</h2>
        <span className="tx-feed__count">
          {transactions.length} total on Arc Testnet
        </span>
      </div>

      <div className="tx-feed__list">
        {transactions.length === 0 ? (
          <div className="tx-feed__empty">
            <span className="tx-feed__empty-dot" />
            Waiting for agent tool calls...
          </div>
        ) : (
          reversed.map((tx, idx) => (
            <div
              key={tx.id}
              className={`tx-feed__item ${idx === 0 ? "tx-feed__item--new" : ""}`}
            >
              <div className="tx-feed__item-left">
                <span className="tx-feed__item-dot" />
                <span className="tx-feed__item-tool">
                  {tx.tool.replace("/tool/", "")}
                </span>
                <a
                  href={`${explorerUrl}/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-feed__item-hash"
                >
                  {tx.txHash.slice(0, 22)}...
                </a>
              </div>
              <div className="tx-feed__item-right">
                <span className="tx-feed__item-amount">+$0.001 USDC</span>
                <span className="tx-feed__item-time">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
