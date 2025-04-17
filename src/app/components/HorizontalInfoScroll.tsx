import React from "react";
import { displayCoreFeatures } from "../../utils/constants";
import CustomIcon from "./ui/CustomIcon";

const HorizontalInfoScroll = () => {
  return (
    <div className="w-full overflow-hidden bg-white/10 backdrop-blur-sm py-4 md:py-6">
      <div className="flex animate-marquee whitespace-nowrap">
        {/* First set of features */}
        {displayCoreFeatures
          .concat(displayCoreFeatures)
          .map((feature, index) => (
            <div
              key={`first-${index}`}
              className="flex items-center mx-6 md:mx-12 group transition-all duration-300 hover:scale-105"
            >
              <CustomIcon
                name="zap"
                className="text-yellow-400 group-hover:text-yellow-300 transition-colors"
                width={30}
                height={34}
              />
              <p className="text-xl md:text-3xl lg:text-4xl text-white/30 group-hover:text-white/50 font-medium ml-3 transition-colors">
                {feature}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HorizontalInfoScroll;
