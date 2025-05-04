"use client";
import axios from "axios";
import { Calendar, Star, UserRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { collegeId } = useParams();
  const [counsellor, setCounsellor] = useState([]);
  const route = useRouter();
  const fetchCounsellorByCollegeId = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/college/${collegeId}`,
        {
          withCredentials: true, // This is critical for cookies to work
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status == 200) {
        setCounsellor(res.data);
      } // Handle the response as needed
    } catch (error) {
      console.error("Error fetching counsellor data:", error);
    }
  };

  const navigateToCounselorDetails = (counselorId) => {
    route.push(`/student/counsellorDetails/${counselorId}`);
  };

  console.log(counsellor);

  useEffect(() => {
    fetchCounsellorByCollegeId();
  }, []);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {counsellor?.map((counselor) => (
          <div
            key={counselor.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden mr-4 border-2 border-purple-100">
                  <img
                    src={
                      counselor?.document?.profilePhotoUrl ||
                      "https://via.placeholder.com/150"
                    }
                    alt={`${counselor?.name}'s profile`}
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
                <button
                  className="px-3 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                  onClick={() => navigateToCounselorDetails(counselor.id)}
                >
                  <UserRound className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
