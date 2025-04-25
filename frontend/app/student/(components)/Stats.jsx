import React from "react";

const Stats = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-3xl font-bold text-purple-600 mb-1">5000+</h3>
            <p className="text-gray-600 font-medium">Students Helped</p>
          </div>
          <div className="p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-3xl font-bold text-purple-600 mb-1">95%</h3>
            <p className="text-gray-600 font-medium">Success Rate</p>
          </div>
          <div className="p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-3xl font-bold text-purple-600 mb-1">200+</h3>
            <p className="text-gray-600 font-medium">Partner Colleges</p>
          </div>
          <div className="p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-3xl font-bold text-purple-600 mb-1">10+</h3>
            <p className="text-gray-600 font-medium">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
