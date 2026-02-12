import Navbar from "./Navbar/Navbar";
import { observer } from "mobx-react";

import Footer from "./Navbar/Footer";
import MainContent from "./MainContents/MainContent";
import { useState } from "react";
import OrderSample from "./MainContents/OrderSample/OrderSample";

export const Viewer = observer(() => {
  const [isOrderSampleOpen, setIsOrderSampleOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <Navbar onOrderSampleClick={() => setIsOrderSampleOpen(true)} />
      <div className="flex-1 overflow-auto">
        <MainContent />
        <Footer />
      </div>
      <OrderSample
        isOpen={isOrderSampleOpen}
        onClose={() => setIsOrderSampleOpen(false)}
      />
    </div>
  );
});
