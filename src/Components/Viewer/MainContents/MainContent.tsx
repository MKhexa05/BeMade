import React from "react";
import RightUI from "./RightUI";
import Viewer3D from "../../Viewer3D/Viewer3D";

const MainContent = () => {
  return (
    <div className="h-[calc(100dvh-61px)] lg:h-[calc(100vh-144px)]">
      <div className="flex flex-col lg:flex-row gap-0 xl:gap-3 h-full w-full p-0 lg:p-3 xl:p-6 overflow-hidden">
        <div className="transition-all duration-500 ease-in-out flex-auto relative lg:rounded-2xl h-[50%] lg:h-full bg-gray  overflow-hidden">
          <Viewer3D />
        </div>
        <RightUI />
      </div>
    </div>
  );
};

export default MainContent;
