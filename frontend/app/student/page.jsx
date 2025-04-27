"use client";
import Hero from "./(components)/Hero";
import Stats from "./(components)/Stats";
import MeetCounsellor from "./(components)/MeetCounsellor";
import ChooseUs from "./(components)/ChooseUs";
import { studentContext } from "../_context/studentContext";
import { useContext } from "react";

export default function HomePage() {
  // const { student } = useContext(studentContext);
  // console.log(student);

  return (
    <div className="min-h-screen flex flex-col">
      {/* hero */}
      <Hero />

      {/* Stats Section */}
      <Stats />

      {/* Meet Our Counselors Section */}
      <MeetCounsellor />

      {/* Why Choose Us Section */}
      <ChooseUs />

      {/* CTA Section */}
      <section className="bg-purple-600 py-16 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-2">
                Ready to Start Your Journey?
              </h2>
              <p className="text-purple-100 text-lg">
                Take the first step toward your academic success today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors">
                Get Started Now
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
