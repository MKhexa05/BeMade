import TableCheckoutSummary from "./TableCheckoutSummary";
import SampleCheckoutSummary from "./SampleCheckoutSummary";

type OrderSummaryProps = {
  mode?: "table" | "samples";
  sampleNames?: string[];
};

const OrderSummary = ({ mode = "table", sampleNames = [] }: OrderSummaryProps) =>
  mode === "samples" ? (
    <SampleCheckoutSummary sampleNames={sampleNames} />
  ) : (
    <TableCheckoutSummary />
  );

export default OrderSummary;
