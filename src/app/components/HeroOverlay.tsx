import React from "react";
import CustomIcon from "./ui/CustomIcon";

const HeroOverlay = () => {
  return (
    <div className="relative h-[400px] flex justify-center ">
      <div className="absolute z-[50] left-0">
        <CustomIcon
          name="hero-overlay-1"
          className=" fill-brand"
          width={490}
          height={622}
        />
      </div>
      <div className="dotted hidden md:block absolute h-[250px] right-0">
        <CustomIcon
          name="hero-overlay-2"
          className=" fill-brand"
          width={429}
          height={811}
        />
      </div>
    </div>
  );
};

export default HeroOverlay;
