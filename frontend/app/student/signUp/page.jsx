"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { studentContext } from "@/app/_context/studentContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [reenteredPhone, setReenteredPhone] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isPhonesMatch, setIsPhonesMatch] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { setStudent, student } = useContext(studentContext);

  // Initialize email from context if available
  useEffect(() => {
    if (student?.email) {
      setEmailValue(student.email);
    }
  }, [student]);

  useEffect(() => {
    const passwordValid = password.length >= 5;
    const passwordsMatch = password === confirmPassword;
    const phoneValid = /^\d{10}$/.test(phone);
    const phonesMatch = phone === reenteredPhone;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    setIsPasswordValid(passwordValid || password.length === 0);
    setPasswordsMatch(passwordsMatch || confirmPassword.length === 0);
    setIsPhoneValid(phoneValid || phone.length === 0);
    setIsPhonesMatch(phonesMatch || reenteredPhone.length === 0);
    setIsEmailValid(emailValid || emailValue.length === 0);

    setIsFormValid(
      name &&
        passwordValid &&
        passwordsMatch &&
        phoneValid &&
        phonesMatch &&
        emailValid
    );
  }, [name, password, confirmPassword, phone, reenteredPhone, emailValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsSubmitting(true);
      setError("");

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/student/signup`,
          { name, phone, password, email: emailValue }
        );

        console.log(res.data);
        // Save user data to context if needed
        if (res.data && res.data.student) {
          setStudent(res.data.student);
        }
        // Redirect to login or dashboard
        router.push("/login");
      } catch (error) {
        console.error("Error during registration:", error);
        setError(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Create Account
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7E22CE] focus:border-transparent outline-none"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7E22CE] outline-none ${
                  !isEmailValid && emailValue
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your email address"
                required
              />
              {!isEmailValid && emailValue && (
                <p className="text-red-500 text-xs mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7E22CE] outline-none ${
                    !isPasswordValid ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7E22CE] outline-none ${
                    !passwordsMatch && confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
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

            {/* Phone Number */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7E22CE] outline-none ${
                  !isPhoneValid && phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter 10-digit phone number"
                required
              />
              {!isPhoneValid && phone && (
                <p className="text-red-500 text-xs mt-1">
                  Phone number must be exactly 10 digits
                </p>
              )}
            </div>

            {/* Re-enter Phone Number */}
            <div className="space-y-2">
              <label
                htmlFor="reenteredPhone"
                className="text-sm font-medium text-gray-700"
              >
                Re-enter Phone Number
              </label>
              <input
                id="reenteredPhone"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={reenteredPhone}
                onChange={(e) =>
                  setReenteredPhone(e.target.value.replace(/\D/, ""))
                }
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7E22CE] outline-none ${
                  !isPhonesMatch && reenteredPhone
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Re-enter your phone number"
                required
              />
              {!isPhonesMatch && reenteredPhone && (
                <p className="text-red-500 text-xs mt-1">
                  Phone numbers do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium mt-6 transition-all duration-300 ${
                isFormValid && !isSubmitting
                  ? "bg-[#7E22CE] hover:bg-purple-800 shadow-md"
                  : "bg-[#7E22CE] opacity-70 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Registering..." : "Register & Continue"}
            </button>
          </form>

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
