"use client";

import React, { useState, useEffect } from "react";
import { validKeys } from "../verificationKey";
import axios from "axios";

export default function VerificationForm() {
  // Form fields
  const [verificationKey, setVerificationKey] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Status and validation states
  const [status, setStatus] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Timer for OTP button
  const [timer, setTimer] = useState(0);

  // Check form validity whenever inputs change
  useEffect(() => {
    const isKeyValid = validKeys?.includes(verificationKey);
    setKeyError(verificationKey !== "" && !isKeyValid);

    // Form is valid when key is valid and OTP is verified
    setIsFormValid(isKeyValid && isOtpVerified);
  }, [verificationKey, isOtpVerified]);

  // Handle timer countdown
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Send OTP function
  const handleOtpRequest = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus("Please enter your email address");
      return;
    }

    try {
      // Start the timer regardless of API response (for testing)
      setTimer(10);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/send-otp`,
        {
          email,
        }
      );

      if (response.statusText === "OK") {
        setStatus("OTP sent to your email address");
      } else {
        setStatus(response.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setStatus("An error occurred while sending OTP");
    }
  };

  // Verify OTP function
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      setStatus("Please enter the OTP");
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-otp`,
        {
          email,
          otp,
        }
      );

      setIsOtpVerified(true);
      setStatus("OTP verified successfully");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setStatus("Invalid OTP. Please try again");
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid) {
      console.log("Form submitted:", { verificationKey, email, otp });
      setStatus("Form submitted successfully! Redirecting...");
    } else {
      setStatus("Please complete all verification steps before continuing");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {status && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium w-full max-w-md ${
            status.includes("successfully")
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status}
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Account Verification
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Verification Key */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Verification Key
            </label>
            <input
              type="text"
              value={verificationKey}
              onChange={(e) => setVerificationKey(e.target.value)}
              className={`w-full px-4 py-2 border ${
                keyError ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none`}
              placeholder="Enter verification key"
            />
            {keyError && (
              <p className="text-red-500 text-xs mt-1">
                Verification key is incorrect
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isOtpVerified}
              className={`w-full px-4 py-2 border ${
                isOtpVerified
                  ? "bg-gray-100 border-green-400"
                  : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none`}
              placeholder="Enter your email"
            />
          </div>

          {/* OTP Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                One-Time Password
              </label>

              {/* Send OTP Button */}
              <button
                type="button"
                onClick={handleOtpRequest}
                disabled={!email || timer > 0 || isOtpVerified}
                className={`text-sm px-3 py-1 rounded ${
                  !email || timer > 0 || isOtpVerified
                    ? "bg-gray-300 text-gray-500"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Send OTP"}
              </button>
            </div>

            {/* OTP Input and Verify Button */}
            <div className="flex gap-3">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isOtpVerified}
                className={`flex-1 px-4 py-2 border ${
                  isOtpVerified
                    ? "bg-gray-100 border-green-400"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none`}
                placeholder="Enter OTP code"
                maxLength={6}
              />

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={!otp || isOtpVerified}
                className={`px-4 py-2 rounded-lg ${
                  isOtpVerified
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : !otp
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {isOtpVerified ? "Verified" : "Verify OTP"}
              </button>
            </div>

            {/* OTP Status */}
            {isOtpVerified && (
              <p className="text-green-500 text-xs flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                OTP verified successfully
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 mt-6 rounded-lg text-white font-medium ${
              isFormValid
                ? "bg-purple-600 hover:bg-purple-800 shadow-md"
                : "bg-purple-300 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
