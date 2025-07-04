"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  School,
  BookOpen,
  CreditCard,
  Calendar,
  X,
  Star,
  Users,
  Award,
} from "lucide-react";
import Header from "../../(components)/Header";

const CounsellorProfilePage = () => {
  const params = useParams();
  const counsellorId = params.id;
  const [counsellorDetails, setCounsellorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdCard, setShowIdCard] = useState(false);

  const fetchCounsellorDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/counsellorInfo/${counsellorId}`,
        {
          params: { counsellorId },
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200 || !res.data?.data) {
        throw new Error("Counsellor not found");
      }

      setCounsellorDetails(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching counsellor details:", error);
      toast.error("Counsellor not found. Please try again or contact support.");
      setLoading(false);
    }
  };

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = window.document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      window.document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    const response = await loadRazorpay();

    if (!response) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment`,
      {
        amount: counsellorDetails?.document?.college.sessionFee,
        counsellorId: counsellorId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.data.success) {
      toast.error("Failed to initiate payment. Please try again.");
      return;
    }

    const order = res?.data.order;

    console.log(order);

    const options = {
      key: "rzp_test_0j6T2dORLBXPyP", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Collegxa",
      description: "Test Transaction",
      image:
        "https://www.google.com/imgres?q=logo&imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-vector%2Fbird-colorful-logo-gradient-vector_343694-1365.jpg%3Fsemt%3Dais_items_boosted%26w%3D740&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Flogo-concept&docid=Y47QCKmix33cWM&tbnid=x6VzhJUSIQkBOM&vet=12ahUKEwiu497BwJmOAxVrsFYBHUjNKb8QM3oECBsQAA..i&w=740&h=740&hcb=2&ved=2ahUKEwiu497BwJmOAxVrsFYBHUjNKb8QM3oECBsQAA",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify`,

      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#121212",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  useEffect(() => {
    fetchCounsellorDetails();
  }, [counsellorId]);

  // Dummy data for ratings and sessions
  const dummyRating = 4.8;
  const dummySessions = 124;
  const dummyExperience = "3+ years";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading counsellor information...
          </p>
        </div>
      </div>
    );
  }

  if (!counsellorDetails) {
    return null; // We'll show the toast error instead
  }

  const { name, document } = counsellorDetails;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F2F7FD] py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-center" />

        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Header with background */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-44 flex items-center justify-center relative">
              <div className="absolute -bottom-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                <img
                  src={document.profilePhotoUrl || "/placeholder-profile.jpg"}
                  alt={`${name}'s profile`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-profile.jpg";
                  }}
                />
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 pb-8 px-6 md:px-10">
              <h1 className="text-3xl font-bold text-center text-gray-800">
                {name}
              </h1>
              <p className="text-lg text-teal-600 text-center mt-1">
                Academic Counsellor
              </p>

              {/* College Name - Highlighted */}
              <div className="text-center mt-4">
                <h2 className="text-2xl font-semibold text-teal-600 border-b-2 border-teal-800 inline-block px-4 pb-1">
                  {document.college.name}
                </h2>
              </div>

              {/* Rating and Stats - Row */}
              <div className="mt-8 flex flex-wrap justify-center gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-xl font-bold">
                      {dummyRating}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-teal-600" />
                    <span className="ml-1 text-xl font-bold">
                      {dummySessions}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Sessions Conducted</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-teal-600" />
                    <span className="ml-1 text-xl font-bold">
                      {dummyExperience}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Experience</p>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold text-teal-600 mb-6 pb-2 border-b border-gray-100">
                      Education Background
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <School className="mr-4 h-6 w-6 text-teal-600 mt-1" />
                        <div>
                          <h3 className="font-medium text-lg">College</h3>
                          <p className="text-gray-700 font-semibold text-lg">
                            {document.college.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <BookOpen className="mr-4 h-6 w-6 text-teal-600 mt-1" />
                        <div>
                          <h3 className="font-medium text-lg">Branch</h3>
                          <p className="text-gray-700">{document.branchName}</p>
                        </div>
                      </div>
                      {document.specialization && (
                        <div className="flex items-start">
                          <BookOpen className="mr-4 h-6 w-6 text-teal-600 mt-1" />
                          <div>
                            <h3 className="font-medium text-lg">
                              Specialization
                            </h3>
                            <p className="text-gray-700">
                              {document.specialization}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {document.bio && (
                    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                      <h2 className="text-xl font-semibold text-teal-600 mb-6 pb-2 border-b border-gray-100">
                        About
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {document.bio}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold text-teal-600 mb-6 pb-2 border-b border-gray-100">
                      Session Information
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <CreditCard className="mr-4 h-6 w-6 text-teal-600 mt-1" />
                        <div>
                          <h3 className="font-medium text-lg">Session Fee</h3>
                          <p className="text-gray-700 font-semibold">
                            ₹{document.college.sessionFee}
                          </p>
                        </div>
                      </div>
                      {document.sessionDuration && (
                        <div className="flex items-start">
                          <Calendar className="mr-4 h-6 w-6 text-teal-600 mt-1" />
                          <div>
                            <h3 className="font-medium text-lg">
                              Session Duration
                            </h3>
                            <p className="text-gray-700">
                              {document.sessionDuration} minutes
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold text-teal-600 mb-6 pb-2 border-b border-gray-100">
                      Verification
                    </h2>
                    <button
                      onClick={() => setShowIdCard(true)}
                      className="inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 w-full transition-all duration-200"
                    >
                      View ID Card
                    </button>

                    {document.verified && (
                      <div className="mt-6 flex items-center bg-green-50 p-3 rounded-lg">
                        <svg
                          className="h-6 w-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 font-medium text-green-800">
                          Verified Counsellor
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Session Button */}
              <div className="mt-12 flex justify-center">
                <button
                  className="px-10 py-4 bg-teal-600 text-white font-semibold text-lg rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
                  onClick={handlePayment}
                >
                  Book a Session
                </button>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-12 bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                Student Testimonials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Testimonial 1 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "The counselling session was extremely helpful. I gained
                    clarity about my career path and the steps I need to take."
                  </p>
                  <p className="mt-2 font-medium">- Rahul S.</p>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    "Excellent guidance and personalized advice. The counsellor
                    was very knowledgeable and addressed all my concerns."
                  </p>
                  <p className="mt-2 font-medium">- Priya M.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ID Card Modal */}
        {showIdCard && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-screen overflow-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  ID Card Verification
                </h3>
                <button
                  onClick={() => setShowIdCard(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={document.idCardUrl}
                  alt="ID Card"
                  className="w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-id.jpg";
                  }}
                />
              </div>
              <div className="p-4 border-t">
                <button
                  onClick={() => setShowIdCard(false)}
                  className="w-full py-2 bg-[#9810FA] text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CounsellorProfilePage;
