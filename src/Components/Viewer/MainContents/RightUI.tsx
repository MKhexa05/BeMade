import { observer } from "mobx-react";
import Chair from "./Chair/ChairUI";
import OrderSummary from "./OrderSummary";
import Base from "./Table/Base";
import BaseColor from "./Table/BaseColor";
import Dimensions from "./Table/Dimensions";
import TableTopColor from "./Table/TableTopColor";
import TableTopShape from "./Table/TableTopShape";
import PlaceOrder from "./PlaceOrder";

const RightUI = observer(() => {
  return (
    <div className="transition-all duration-500 ease-in-out transform w-[100%] min-w-auto 2xl:min-w-[520px] lg:w-[35%] xl:w-[35%] 2xl:w-[27%] overflow-y-auto xl:overflow-y-hidden h-[50%] lg:h-full relative">
      <div
        id="right-ui-scroll"
        className="overflow-y-auto h-full p-3 px-3 lg:px-2 py-0 space-y-3 lg:space-y-6"
      >
        <section id="section-base">
          <Base />
        </section>
        <section id="section-base-color">
          <BaseColor />
        </section>
        <section id="section-top-color">
          <TableTopColor />
        </section>
        <section id="section-top-shape">
          <TableTopShape />
        </section>
        <section id="section-dimensions">
          <Dimensions />
        </section>
        <section id="section-chair">
          <Chair />
        </section>
        <section id="section-summary">
          <OrderSummary />
        </section>
        <PlaceOrder />
      </div>
    </div>
  );
});

export default RightUI;
