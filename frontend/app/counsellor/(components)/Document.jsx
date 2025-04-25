"use client";

import React, { use, useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios
import {
  FileText,
  Camera,
  Upload,
  CheckCircle,
  Book,
  Building2,
  AlertCircle,
  Save,
  Loader,
} from "lucide-react";
import { counsellorContext } from "@/app/_context/counsellorContext";

export default function DocumentSubmissionForm() {
  // Form state
  const [idCard, setIdCard] = useState();
  const [scorecard, setScorecard] = useState();
  const [profilePhoto, setProfilePhoto] = useState();
  const [branch, setBranch] = useState("");
  const [collegeName, setCollegeName] = useState("");

  // Preview URLs for uploaded images
  const [idCardPreview, setIdCardPreview] = useState("");
  const [scorecardPreview, setScorecardPreview] = useState("");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");

  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { setCounsellor, counsellor } = useContext(counsellorContext);
  const email = counsellor?.email || ""; // Get the email from the context

  // Cloudinary upload URLs
  const [cloudinaryUrls, setCloudinaryUrls] = useState({
    idCard: "",
    scorecard: "",
    profilePhoto: "",
  });

  // Available branches
  const branches = [
    "Computer Science",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Electronics & Communication",
    "Information Technology",
    "Chemical Engineering",
  ];

  // Validate form on input change
  useEffect(() => {
    const areFieldsFilled =
      idCard &&
      scorecard &&
      profilePhoto &&
      branch !== "" &&
      collegeName !== "";

    setIsFormValid(areFieldsFilled);
  }, [idCard, scorecard, profilePhoto, branch, collegeName]);

  // Handle file uploads with preview
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files?.[0] || null;
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
    }
  };

  // Upload a single file to Cloudinary using Axios
  const uploadToCloudinary = async (file, fileType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("folder", "document-verification");
    formData.append("tags", `document-verification,${fileType}`);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentage);
          },
        }
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Upload failed");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      setUploadProgress(0);

      try {
        // Upload each file to Cloudinary
        const idCardUrl = await uploadToCloudinary(idCard, "id-card");
        setUploadProgress(33);

        const scorecardUrl = await uploadToCloudinary(scorecard, "scorecard");
        setUploadProgress(66);

        const profilePhotoUrl = await uploadToCloudinary(
          profilePhoto,
          "profile-photo"
        );
        setUploadProgress(100);

        // Store the Cloudinary URLs
        const urls = {
          idCard: idCardUrl,
          scorecard: scorecardUrl,
          profilePhoto: profilePhotoUrl,
        };

        setCloudinaryUrls(urls);

        const formData = {
          idCardUrl,
          scorecardUrl,
          profilePhotoUrl,
          branch,
          collegeName,
        };

        // Send the form data to your backend or API endpoint
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/counsellor/documentInfo`,
          {
            email: email,
            idCardUrl: idCardUrl,
            marksheetUrl: scorecardUrl,
            profilePhotoUrl: profilePhotoUrl,
            branchName: branch,
            collegeId: 4,
          }
        );

        console.log("Response from backend:", res.data);

        // If you need to send the URLs to your backend, you can do it here
        // Example: await axios.post('/api/save-document-urls', formData);

        // Show success message
        setSubmitted(true);
      } catch (error) {
        console.error("Error uploading files:", error);
        alert(
          "An error occurred while uploading your files. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        {submitted ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Submission Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your documents have been successfully uploaded and submitted. We
              will review them shortly.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Your Uploaded Documents:
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={cloudinaryUrls.idCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm truncate"
                >
                  ID Card
                </a>
                <a
                  href={cloudinaryUrls.scorecard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm truncate"
                >
                  Scorecard
                </a>
                <a
                  href={cloudinaryUrls.profilePhoto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm truncate"
                >
                  Profile Photo
                </a>
              </div>
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium">
              Continue
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-indigo-100 p-3 rounded-full mr-3">
                <FileText size={28} className="text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Document Verification
              </h1>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Please ensure all documents are clearly visible and in JPG
                    or PNG format. Files will be uploaded directly to our secure
                    storage service.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* ID Card Upload */}
                <div className="space-y-2">
                  <label
                    htmlFor="idCard"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <FileText size={16} className="mr-2 text-indigo-600" />
                    ID Card
                  </label>
                  <div className="relative">
                    <input
                      id="idCard"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e, setIdCard, setIdCardPreview)
                      }
                      className="sr-only"
                    />
                    <label
                      htmlFor="idCard"
                      className={`flex flex-col items-center justify-center w-full h-32 px-4 transition-colors duration-200 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
                        idCardPreview
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300"
                      }`}
                    >
                      {idCardPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={idCardPreview}
                            alt="ID Card Preview"
                            className="object-contain w-full h-full rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                            <span className="text-white text-sm font-medium flex items-center">
                              <Upload size={16} className="mr-1" /> Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FileText size={32} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Upload ID Card
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Click or drag & drop
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Scorecard Upload */}
                <div className="space-y-2">
                  <label
                    htmlFor="scorecard"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <Book size={16} className="mr-2 text-indigo-600" />
                    Scorecard
                  </label>
                  <div className="relative">
                    <input
                      id="scorecard"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e, setScorecard, setScorecardPreview)
                      }
                      className="sr-only"
                    />
                    <label
                      htmlFor="scorecard"
                      className={`flex flex-col items-center justify-center w-full h-32 px-4 transition-colors duration-200 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
                        scorecardPreview
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300"
                      }`}
                    >
                      {scorecardPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={scorecardPreview}
                            alt="Scorecard Preview"
                            className="object-contain w-full h-full rounded-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg">
                            <span className="text-white text-sm font-medium flex items-center">
                              <Upload size={16} className="mr-1" /> Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Book size={32} className="text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">
                            Upload Scorecard
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Click or drag & drop
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label
                  htmlFor="profilePhoto"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Camera size={16} className="mr-2 text-indigo-600" />
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          setProfilePhoto,
                          setProfilePhotoPreview
                        )
                      }
                      className="sr-only"
                    />
                    <label
                      htmlFor="profilePhoto"
                      className={`flex flex-col items-center justify-center w-32 h-32 transition-colors duration-200 border-2 border-dashed rounded-full cursor-pointer hover:bg-gray-50 overflow-hidden ${
                        profilePhotoPreview
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300"
                      }`}
                    >
                      {profilePhotoPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={profilePhotoPreview}
                            alt="Profile Photo Preview"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200">
                            <span className="text-white text-sm font-medium flex items-center">
                              <Upload size={16} className="mr-1" /> Change
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Camera size={32} className="text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500 text-center">
                            Upload Photo
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Requirements:</p>
                    <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
                      <li>Recent passport-sized photo</li>
                      <li>Clear, front-facing with neutral background</li>
                      <li>No filters or heavy editing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Branch Selection */}
                <div className="space-y-2">
                  <label
                    htmlFor="branch"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <Book size={16} className="mr-2 text-indigo-600" />
                    Branch
                  </label>
                  <div className="relative">
                    <select
                      id="branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 outline-none appearance-none bg-white pr-10"
                    >
                      <option value="" disabled>
                        Select your branch
                      </option>
                      {branches.map((branchOption) => (
                        <option key={branchOption} value={branchOption}>
                          {branchOption}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* College Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="collegeName"
                    className="flex items-center text-sm font-medium text-gray-700"
                  >
                    <Building2 size={16} className="mr-2 text-indigo-600" />
                    College Name
                  </label>
                  <input
                    id="collegeName"
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your college name"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {isLoading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">
                      Uploading documents...
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium mt-8 transition-all duration-300 flex items-center justify-center ${
                  isFormValid && !isLoading
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                    : "bg-indigo-400 opacity-60 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Submit Documents
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By submitting this form, you confirm that all provided
                information is accurate and documents are authentic.
              </p>
            </form>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 13a1 1 0 112 0 1 1 0 01-2 0zm0-5a1 1 0 112 0v3a1 1 0 11-2 0V8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Contact support
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
