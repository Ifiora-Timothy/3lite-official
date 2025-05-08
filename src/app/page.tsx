"use client";
import React from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import WhyChooseUs from "./components/WhyChooseUs";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  return (
    <div
      style={{
        backgroundColor: "var(--home-bg)",
        color: "var(--text-color)",
      }}
      className="font-sans "
    >
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <WhyChooseUs />
      <CTA />

      <Footer />
    </div>
  );
}

export default App;
