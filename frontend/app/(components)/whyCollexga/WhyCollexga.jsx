import React from "react";
import {
  CheckCircle2,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";

export default function WhyChooseCollexga() {
  const features = [
    {
      icon: Users,
      title: "1000+ Verified Counselors",

      description:
        "Connect with college seniors from top institutions who've been through admission processes and can provide real insights.",
    },
    {
      icon: Zap,
      title: "Real-Time Communication",
      description:
        "Chat messaging and video calling features enable instant guidance. Connect with counselors whenever you need support.",
    },
    {
      icon: TrendingUp,
      title: "500+ Success Stories",
      description:
        "Our platform has facilitated over 500 student-counselor interactions resulting in successful admissions.",
    },
    {
      icon: Award,
      title: "95% User Satisfaction",
      description:
        "Students and counselors rate our platform highly for ease of use, reliability, and quality of guidance provided.",
    },
    {
      icon: CheckCircle2,
      title: "Expert Mentorship",
      description:
        "Get personalized admission strategies from experienced seniors who understand the current admission landscape.",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Collexga
            </span>{" "}
            ?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your trusted platform connecting aspiring students with verified
            college seniors for authentic, personalized admission guidance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 hover:border-blue-200"
              >
                <div className="mb-4">
                  <div className="w-12 h-12  rounded-lg flex items-center justify-center bg-blue-500">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-16 pt-12 border-t border-slate-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">1000+</div>
            <p className="text-slate-600">Verified Counselors</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">2000+</div>
            <p className="text-slate-600">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">500+</div>
            <p className="text-slate-600">Success Stories</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-500 mb-2">95%</div>
            <p className="text-slate-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
