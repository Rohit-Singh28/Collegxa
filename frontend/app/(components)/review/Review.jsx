export default function Reviews() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "B.Tech Student, Delhi",
      feedback:
        "Collexga helped me overcome my anxiety and find the right career path. The counsellors are incredibly supportive and understanding.",
      initials: "PS",
    },
    {
      name: "Rahul Kumar",
      role: "MBA Student, Mumbai",
      feedback:
        "The career guidance I received was spot-on. I'm now confident about my future and have a clear roadmap to success.",
      initials: "RK",
    },
    {
      name: "Ananya Patel",
      role: "Medical Student, Bangalore",
      feedback:
        "Dealing with academic pressure was overwhelming until I found Collexga. Their mental health support changed my life.",
      initials: "AP",
    },
    {
      name: "Vikram Singh",
      role: "Engineering Student, Pune",
      feedback:
        "Professional, empathetic, and results-driven. Collexga's counselling services are exactly what students need today.",
      initials: "VS",
    },
    {
      name: "Sneha Reddy",
      role: "Commerce Student, Hyderabad",
      feedback:
        "From academic planning to personal growth, Collexga provided comprehensive support throughout my journey.",
      initials: "SR",
    },
    {
      name: "Arjun Mehta",
      role: "Arts Student, Chennai",
      feedback:
        "The personalized approach and genuine care from the counsellors made all the difference in my academic performance.",
      initials: "AM",
    },
  ];

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Students Say
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real stories from students who transformed their lives with our
            counselling services
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-slate-100"
            >
              {/* Avatar */}
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.initials}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-slate-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Feedback */}
              <blockquote className="text-slate-600 leading-relaxed">
                "{testimonial.feedback}"
              </blockquote>

              {/* Rating Stars */}
              <div className="flex mt-4 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-slate-600 mb-8">
            Ready to start your transformation journey?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Join Thousands of Happy Students
          </button>
        </div>
      </div>
    </section>
  );
}
