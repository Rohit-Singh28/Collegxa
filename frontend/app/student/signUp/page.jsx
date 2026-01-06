"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { studentContext } from "@/app/_context/studentContext";
import { useRouter } from "next/navigation";
import Header from "@/app/(components)/header/Header";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    reenteredPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();
  const { setStudent, student } = useContext(studentContext);

  useEffect(() => {
    if (student?.email) {
      setFormData((prev) => ({ ...prev, email: student.email }));
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (formData.phone !== formData.reenteredPhone) {
      newErrors.reenteredPhone = "Phone numbers do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "reenteredPhone") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/\D/g, "").slice(0, 10),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }
      );

      console.log(res.data);
      if (res.data && res.data.student) {
        setStudent(res.data.student);
      }
      router.push("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      setServerError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Header />
      <div className="w-full max-w-md mt-[10vh]">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Join Collexga
            </h1>
            <p className="text-slate-600 text-sm">
              Connect with verified college seniors for admission guidance
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 flex items-start gap-2 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name */}
            <div className="space-y-1">
              <label
                htmlFor="name"
                className="text-xs font-medium text-slate-700"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm ${
                  errors.name
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-white"
                }`}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle size={12} />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-xs font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm ${
                  errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200 bg-white"
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle size={12} />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-xs font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (minimum 5 characters)"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm ${
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle size={12} />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-slate-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm ${
                    errors.confirmPassword
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center gap-1 text-red-600 text-xs">
                  <AlertCircle size={12} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Phone Numbers in Two Columns */}
            <div className="grid grid-cols-2 gap-3">
              {/* Phone */}
              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className="text-xs font-medium text-slate-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 digits"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm ${
                    errors.phone
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                />
                {errors.phone && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertCircle size={12} />
                    {errors.phone}
                  </div>
                )}
              </div>

              {/* Confirm Phone */}
              <div className="space-y-1">
                <label
                  htmlFor="reenteredPhone"
                  className="text-xs font-medium text-slate-700"
                >
                  Confirm Phone
                </label>
                <input
                  id="reenteredPhone"
                  name="reenteredPhone"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.reenteredPhone}
                  onChange={handleChange}
                  placeholder="Confirm"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm ${
                    errors.reenteredPhone
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-white"
                  }`}
                />
                {errors.reenteredPhone && (
                  <div className="flex items-center gap-1 text-red-600 text-xs">
                    <AlertCircle size={12} />
                    {errors.reenteredPhone}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold mt-6 transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Register & Continue
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-slate-500 text-center mt-4">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
