"use client";
import React from "react";
import Header from "./(components)/header/Header";
import Hero from "./(components)/Hero/Hero";
import About from "./(components)/aboutUs/AboutUs";
import Reviews from "./(components)/review/Review";
import Footer from "./(components)/footer/Footer";
import WhyCollexga from "./(components)/whyCollexga/WhyCollexga";

const page = () => {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <WhyCollexga />
      <Reviews />
      <Footer />
    </div>
  );
};

export default page;
