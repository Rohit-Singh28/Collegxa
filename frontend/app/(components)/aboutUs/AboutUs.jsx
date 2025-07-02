export default function About() {
  const marqueeItems = [
    "Vision",
    "Mission",
    "Values",
    "Empathy",
    "Student Success",
    "Growth",
    "Excellence",
    "Support",
    "Innovation",
    "Trust",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-8">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Collexga
            </span>
          </h2>

          {/* Marquee Animation */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl py-6 mb-12">
            <div className="marquee-container">
              <div className="marquee-content">
                {[...marqueeItems, ...marqueeItems].map((item, index) => (
                  <span
                    key={index}
                    className="inline-block px-6 py-2 mx-4 bg-white text-slate-700 font-medium rounded-full shadow-sm border border-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vision, Mission, Values */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Vision */}
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              To be the leading platform that transforms student lives through
              accessible, personalized counselling services.
            </p>
          </div>

          {/* Mission */}
          <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              Empowering students with expert guidance, mental health support,
              and career counselling to achieve their full potential.
            </p>
          </div>

          {/* Values */}
          <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Values</h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Empathy & Understanding</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                <span>Professional Excellence</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                <span>Student-Centric Approach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
