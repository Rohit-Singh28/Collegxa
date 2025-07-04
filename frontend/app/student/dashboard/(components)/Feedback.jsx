"use client";
import React, { useState } from "react";
import {
  User,
  Search,
  Clock,
  Link,
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import axios from "axios";

const CounselorFeedbackForm = () => {
  const [step, setStep] = useState(1); // 1: ID verification, 2: Feedback form
  const [counselorId, setCounselorId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [counsellorId, setCounsellorId] = useState("");

  const [feedbackData, setFeedbackData] = useState({
    sessionDuration: "",
    sessionLink: "",
    counselorRating: 0,
    sessionQuality: 0,
    communicationRating: 0,
    helpfulnessRating: 0,
    recommendationRating: 0,
    sessionType: "",
    counselorFeedback: "",
    suggestions: "",
    improvements: "",
    mostHelpful: "",
    additionalComments: "",
  });

  const sessionTypes = [
    "Career Guidance",
    "Academic Planning",
    "College Admission",
    "Skill Development",
    "Personal Development",
    "Interview Preparation",
    "Other",
  ];

  const verifyCounselor = async () => {
    if (!counselorId.trim()) {
      setVerificationError("Please enter a counselor ID");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/course/${counselorId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setCounsellorId(response.data.data.counsellorId);

        setStep(2);
      } else {
        setVerificationError(
          "Access denied. You are not allowed to access this counselor's services."
        );
      }
    } catch (error) {
      setVerificationError("Invalid counselor ID or counselor not found.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFeedbackData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRatingChange = (field, rating) => {
    setFeedbackData((prev) => ({
      ...prev,
      [field]: rating,
    }));
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const feedbackPayload = {
        counsellorId: counselorId,
        ...feedbackData,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/feedback`,
        feedbackPayload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(
        "Feedback submission failed OR you have already submitted feedback for this counselor."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`transition-all duration-200 ${
              star <= rating
                ? "text-yellow-400 hover:text-yellow-500"
                : "text-gray-300 hover:text-yellow-300"
            }`}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating > 0 ? `${rating}/5` : "Not rated"}
        </span>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You for Your Feedback!
            </h2>
            <p className="text-gray-600 mb-6">
              Your feedback has been submitted successfully. It will help us
              improve our counseling services.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
            >
              Submit Another Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Counselor Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your feedback helps us improve our counseling services and ensures
            quality guidance for all students.
          </p>
        </div>

        {/* Step 1: Counselor ID Verification */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 mb-4">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verify Counselor
                </h2>
                <p className="text-gray-600">
                  Enter the counselor ID to begin your feedback
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Counselor ID
                  </label>
                  <input
                    type="text"
                    value={counselorId}
                    onChange={(e) => setCounselorId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter counselor ID"
                  />
                </div>

                {verificationError && (
                  <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-red-700">{verificationError}</p>
                  </div>
                )}

                <button
                  onClick={verifyCounselor}
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                >
                  {isVerifying ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  {isVerifying ? "Verifying..." : "Verify Counselor"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Feedback Form */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={submitFeedback} className="space-y-8">
              {/* Session Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Session Duration (minutes)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={feedbackData.sessionDuration}
                      onChange={(e) =>
                        handleInputChange("sessionDuration", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 45"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Session Type
                  </label>
                  <select
                    value={feedbackData.sessionType}
                    onChange={(e) =>
                      handleInputChange("sessionType", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select session type</option>
                    {sessionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Session Link (if applicable)
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    value={feedbackData.sessionLink}
                    onChange={(e) =>
                      handleInputChange("sessionLink", e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://zoom.us/..."
                  />
                </div>
              </div>

              {/* Ratings Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2" />
                  Rate Your Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StarRating
                    rating={feedbackData.counselorRating}
                    onRatingChange={(rating) =>
                      handleRatingChange("counselorRating", rating)
                    }
                    label="Overall Counselor Rating"
                  />
                  <StarRating
                    rating={feedbackData.sessionQuality}
                    onRatingChange={(rating) =>
                      handleRatingChange("sessionQuality", rating)
                    }
                    label="Session Quality"
                  />
                  <StarRating
                    rating={feedbackData.communicationRating}
                    onRatingChange={(rating) =>
                      handleRatingChange("communicationRating", rating)
                    }
                    label="Communication Skills"
                  />
                  <StarRating
                    rating={feedbackData.helpfulnessRating}
                    onRatingChange={(rating) =>
                      handleRatingChange("helpfulnessRating", rating)
                    }
                    label="Helpfulness"
                  />
                </div>
                <div className="mt-6">
                  <StarRating
                    rating={feedbackData.recommendationRating}
                    onRatingChange={(rating) =>
                      handleRatingChange("recommendationRating", rating)
                    }
                    label="Would you recommend this counselor?"
                  />
                </div>
              </div>

              {/* Feedback Text Areas */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What was most helpful about the session?
                  </label>
                  <textarea
                    value={feedbackData.mostHelpful}
                    onChange={(e) =>
                      handleInputChange("mostHelpful", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Share what you found most valuable..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Feedback about the Counselor
                  </label>
                  <textarea
                    value={feedbackData.counselorFeedback}
                    onChange={(e) =>
                      handleInputChange("counselorFeedback", e.target.value)
                    }
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Share your thoughts about the counselor's expertise, approach, and guidance..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Areas for Improvement
                  </label>
                  <textarea
                    value={feedbackData.improvements}
                    onChange={(e) =>
                      handleInputChange("improvements", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="What could be improved in future sessions?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Suggestions for Our Platform
                  </label>
                  <textarea
                    value={feedbackData.suggestions}
                    onChange={(e) =>
                      handleInputChange("suggestions", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="How can we improve our counseling platform?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    value={feedbackData.additionalComments}
                    onChange={(e) =>
                      handleInputChange("additionalComments", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                    placeholder="Any other comments or feedback..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounselorFeedbackForm;
