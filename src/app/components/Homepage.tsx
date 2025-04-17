import HeroComponent from "./HeroEdited";

import Testimonials from "./Testimonials";

import NewFeatures from "./NewFeatures";
import CTA from "./CTA";
import Footer from "./Footer";

const OPTIONS = { loop: true };
// const SLIDE_COUNT = 5
// const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const Homepage = () => {
  return (
    <div className="text-white h-full bg-brand flex flex-col pb-0 mb-0  w-screen overflow-x-hidden">
      <HeroComponent />

      <NewFeatures />

      <Testimonials options={OPTIONS} />
      <CTA />

      <Footer />
    </div>
  );
};

export default Homepage;
