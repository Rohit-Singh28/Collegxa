import React, { useEffect, useState } from "react";
import {
  Star,
  MessageCircle,
  ChevronRight,
  Calendar,
  UserRound,
  Award,
  Users,
} from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MeetCounsellor = () => {
  // Counselor data
  const [counsellors, setCounselors] = useState([]);
  const route = useRouter();

  const navigateToCounselorDetails = (counselorId) => {
    route.push(`/student/counsellorDetails/${counselorId}`);
  };

  const fetchCounselors = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/counsellor/homecounsellor`
      );
      setCounselors(res.data);
      // console.log(res.data);
    } catch (error) {
      console.error("Error fetching counselors:", error);
    }
  };

  console.log(counsellors);

  useEffect(() => {
    fetchCounselors();
  }, []);

  return (
    <section className="py-10 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full text-sm font-semibold mb-4">
            <Award className="h-4 w-4 mr-2" />
            EXPERT GUIDANCE
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Counselors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with experienced professionals who are dedicated to guiding
            you towards your academic and career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {counsellors?.map((counselor) => (
            <div
              key={counselor.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="p-8">
                <div className="flex items-start mb-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden mr-6 border-4 border-gradient-to-r from-teal-500 to-teal-600 shadow-lg">
                      <Image
                        src={counselor.profilePhoto}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {counselor.name}
                    </h3>
                    <p className="text-teal-600 font-semibold mb-3">
                      {counselor.collegeName}
                    </p>
                    <div className="flex items-center">
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-gray-800 ml-1 font-semibold">
                          {counselor.rating}
                        </span>
                      </div>
                      <div className="flex items-center ml-3 text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {counselor.reviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 mb-6"></div>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigateToCounselorDetails(counselor.id)}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Session
                  </button>
                  <button
                    className="px-6 py-4 border-2 border-teal-500 text-teal-600 rounded-xl hover:bg-teal-50 transition-all duration-300 cursor-pointer group-hover:border-teal-600 hover:shadow-lg"
                    onClick={() => navigateToCounselorDetails(counselor.id)}
                  >
                    <UserRound className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center px-8 py-4 bg-white text-teal-600 border-2 border-teal-500 rounded-xl font-semibold hover:bg-teal-50 hover:border-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View all counselors
            <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MeetCounsellor;
