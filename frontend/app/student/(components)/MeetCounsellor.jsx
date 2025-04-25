import React, { useEffect, useState } from "react";
import { Star, MessageCircle, ChevronRight, Calendar } from "lucide-react";
import axios from "axios";
import Image from "next/image";

const MeetCounsellor = () => {
  // Counselor data
  const [counsellors, setCounselors] = useState([]);

  const fetchCounselors = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/counsellor/homecounsellor`
      );
      setCounselors(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching counselors:", error);
    }
  };

  useEffect(() => {
    // Fetch counselors data when the component mounts
    fetchCounselors();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-purple-600 font-semibold mb-2">
              EXPERT GUIDANCE
            </p>
            <h2 className="text-3xl font-bold text-gray-800">
              Meet Our Counselors
            </h2>
          </div>
          <a
            href="#"
            className="text-purple-600 font-medium hidden md:flex items-center hover:underline"
          >
            View all counselors <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {counsellors?.map((counselor) => (
            <div
              key={counselor.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden mr-4 border-2 border-purple-100">
                    <Image
                      src={
                        counselor?.profilePhoto ||
                        "https://via.placeholder.com/150"
                      }
                      alt={`${counselor?.name}'s profile`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {counselor.name}
                    </h3>
                    <p className="text-purple-600">{counselor.collegeName}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-gray-700 ml-1 font-medium">
                        {counselor.rating}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({counselor.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Session
                  </button>
                  <button className="px-3 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <a
            href="#"
            className="text-purple-600 font-medium inline-flex items-center hover:underline"
          >
            View all counselors <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default MeetCounsellor;
