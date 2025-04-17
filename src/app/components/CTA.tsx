import Header from "./Header";
import CustomIcon from "./ui/CustomIcon";

const CTA = () => {
  return (
    <section className="w-full   py-12 md:py-20 lg:py-24">
      <div className="relative w-full flex flex-col items-center justify-center space-y-3 px-5">
        <div className="absolute size-full overflow-hidden flex items-center left-0">
          <CustomIcon
            name="left-circle-bg"
            className="fill-brand"
            width={400}
            height={400}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12 relative z-10">
          <Header title="Join 3lite" />
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-lg max-w-2xl mx-auto py-10 px-6 md:px-16 md:py-16 relative z-10">
          <div className="text-black text-center mb-8">
            <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
              Start your Project&apos;s journey with us
            </h2>
            <p className="text-sm md:text-base text-gray-700 max-w-lg mx-auto">
              With a solid understanding of the Web3 world and a passion for
              excellence, I&apos;m here to help projects succeed. Here&apos;s
              why you should work with me:
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-6 py-3 flex justify-center items-center gap-x-2 bg-[#C2C0F3] hover:bg-[#b2b0e3] transition-colors rounded-lg text-brand font-medium">
              <span>Socials</span>
              <CustomIcon name="internet" width={20} height={20} />
            </button>
            <button className="w-full sm:w-auto px-6 py-3 flex justify-center items-center gap-x-2 bg-brand-light hover:opacity-90 transition-opacity rounded-lg text-white font-medium">
              <span>Book a Call</span>
              <CustomIcon name="message" width={22} height={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
