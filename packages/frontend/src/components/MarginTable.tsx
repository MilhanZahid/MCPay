interface MarginTableProps {
  txCount: number;
}

export default function MarginTable({ txCount }: MarginTableProps) {
  const stripeFees = (txCount * 0.3).toFixed(2);
  const ethFees = (txCount * 0.05).toFixed(2);

  return (
    <div className="margin-table" id="margin-proof">
      <div className="margin-table__header">
        <span className="margin-table__icon">⚡</span>
        <span className="margin-table__title">
          Why this only works on Arc — margin proof
        </span>
        <span className="margin-table__subtitle">
          {txCount} tool calls at $0.001 each
        </span>
      </div>

      <div className="margin-table__grid">
        {/* Stripe */}
        <div className="margin-table__cell margin-table__cell--stripe">
          <p className="margin-table__cell-label">
            Stripe fees for {txCount} calls
          </p>
          <p className="margin-table__cell-value margin-table__cell-value--red">
            ${stripeFees}
          </p>
          <p className="margin-table__cell-fee">$0.30 minimum per transaction</p>
          <div className="margin-table__cell-verdict margin-table__cell-verdict--impossible">
            impossible — fee is 300× the payment value
          </div>
        </div>

        {/* Ethereum L2 */}
        <div className="margin-table__cell margin-table__cell--eth">
          <p className="margin-table__cell-label">
            Ethereum L2 gas for {txCount} calls
          </p>
          <p className="margin-table__cell-value margin-table__cell-value--orange">
            ${ethFees}
          </p>
          <p className="margin-table__cell-fee">~$0.05 avg per transaction</p>
          <div className="margin-table__cell-verdict margin-table__cell-verdict--unviable">
            unviable — fee still exceeds payment
          </div>
        </div>

        {/* Arc Nanopayments */}
        <div className="margin-table__cell margin-table__cell--arc">
          <p className="margin-table__cell-label">
            Arc Nanopayments for {txCount} calls
          </p>
          <p className="margin-table__cell-value margin-table__cell-value--green">
            $0.00
          </p>
          <p className="margin-table__cell-fee">batched settlement by Circle</p>
          <div className="margin-table__cell-verdict margin-table__cell-verdict--works">
            Circle batches settlement — this model only exists here
          </div>
        </div>
      </div>
    </div>
  );
}
