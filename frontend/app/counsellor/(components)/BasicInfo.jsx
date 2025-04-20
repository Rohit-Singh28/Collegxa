"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  // Form state
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Validation and process states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate form on input change
  useEffect(() => {
    const areFieldsFilled =
      name !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      phone !== "" &&
      otp !== "";
    const doPasswordsMatch = password === confirmPassword;
    const isPasswordLongEnough = password.length >= 5;

    setPasswordsMatch(doPasswordsMatch);
    setIsPasswordValid(isPasswordLongEnough || password.length === 0);
    setIsFormValid(
      areFieldsFilled && doPasswordsMatch && isPasswordLongEnough && otpVerified
    );
  }, [name, password, confirmPassword, phone, otp, otpVerified]);

  // Handle OTP sending
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      // Simulate OTP sending
      console.log("Sending OTP to", phone);
      setOtpSent(true);
      // In a real app, you would call an API here
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      // Simulate OTP verification
      console.log("Verifying OTP", otp);
      setOtpVerified(true);
      // In a real app, you would verify the OTP with an API
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Process the registration
      console.log("Registration submitted:", { name, password, phone });
      // In a real app, you would submit to an API
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all duration-200 outline-none ${
                    !isPasswordValid ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!isPasswordValid && (
                <p className="text-red-500 text-xs mt-1">
                  Password must be at least 5 characters
                </p>
              )}
            </div>

            {/* Confirm Password Field with Show/Hide Toggle */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all duration-200 outline-none ${
                    !passwordsMatch && confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {!passwordsMatch && confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Phone Number Field with Send OTP Button */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter your phone number"
                />
                <button
                  onClick={handleSendOtp}
                  disabled={phone.length < 10 || otpSent}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
                    phone.length < 10 || otpSent
                      ? "bg-[#7E22CE] opacity-70 cursor-not-allowed"
                      : "bg-[#7E22CE] hover:bg-purple-800"
                  }`}
                >
                  {otpSent ? "Sent" : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP Field with Verify Button */}
            <div className="space-y-2">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <div className="flex gap-2">
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter OTP"
                  disabled={!otpSent}
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length < 4 || !otpSent || otpVerified}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
                    otp.length < 4 || !otpSent || otpVerified
                      ? "bg-[#7E22CE] opacity-70 cursor-not-allowed"
                      : "bg-[#7E22CE] hover:bg-purple-800"
                  }`}
                >
                  {otpVerified ? "Verified" : "Verify"}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium mt-6 transition-all duration-300 ${
                isFormValid
                  ? "bg-[#7E22CE] hover:bg-purple-800 shadow-md"
                  : "bg-[#7E22CE] opacity-70 cursor-not-allowed"
              }`}
            >
              Register & Continue
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-[#7E22CE] transition-colors duration-200"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
