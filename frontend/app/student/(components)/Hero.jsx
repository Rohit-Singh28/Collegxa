import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Academic Journey Begins Here
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Connect with expert counselors to plan your future with clarity
              and confidence. We'll help you navigate the path to your dream
              college.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-100 transition-colors">
                Find Your Counselor
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden md:block w-1/3">
            <div className="relative h-80 w-full">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Student consulting"
                fill
                className="object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
