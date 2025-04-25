import React from "react";
import { Star, Award, Clock } from "lucide-react";

const ChooseUs = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <p className="text-purple-600 font-semibold mb-2">OUR ADVANTAGES</p>
          <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
            <div className="bg-purple-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Personalized Guidance
            </h3>
            <p className="text-gray-600">
              Tailored advice and strategies based on your unique academic
              profile, interests, and career goals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
            <div className="bg-purple-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Trusted Experts
            </h3>
            <p className="text-gray-600">
              Our counselors have years of experience and deep knowledge of
              admission processes at top institutions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transition-all">
            <div className="bg-purple-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Flexible Scheduling
            </h3>
            <p className="text-gray-600">
              Book sessions at your convenience with our easy-to-use scheduling
              system that works around your timetable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;
