import React from "react";

const TestimonialCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="md:w-[650px] sm:w-[530px] w-[300px] sm:h-[300px] h-[420px] rounded-3xl p-[1px] bg-gradient-to-b from-white to-[#136aed]">
      <div className="rounded-3xl overflow-hidden h-full bg-[#136aed]/90">
        <div className="h-full py-8 sm:py-10 bg-gradient-to-br from-[#2076f5] via-[#1562d8] to-[#0c4fb8] backdrop-blur-3xl">
          <div className="w-full flex flex-col h-full justify-between">
            <div className="flex flex-col gap-y-4">
              <h2 className="text-center font-Poppins sm:px-10 px-4 md:text-3xl font-semibold text-2xl md:font-medium text-white">
                {title}
              </h2>
              <p className="text-base px-10 text-pretty text-opacity-70 font-Poppins font-light text-white text-center">
                {description}
              </p>
            </div>

            {/* Added bottom element - 5 stars rating */}
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-5 h-5 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
