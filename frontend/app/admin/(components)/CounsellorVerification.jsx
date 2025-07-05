import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Check,
  Trash2,
  X,
  User,
  Phone,
  Mail,
  GraduationCap,
  Building,
} from "lucide-react";

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/admin/verifyCounsellor`,
        {
          withCredentials: true,
        }
      );
      if (response.status != 200) {
        throw new Error("Failed to fetch data");
      }
      setUsers(response.data.counsellorInfo || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState(new Set());

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleVerify = (userId) => {
    setVerifiedUsers((prev) => new Set([...prev, userId]));
    // Add your verification logic here
    console.log("Verified user:", userId);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setVerifiedUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      console.log("Deleted user:", userId);
    }
  };

  const openFullscreen = (imageUrl) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const DocumentImage = ({ url, alt, className = "" }) => {
    const handleImageClick = () => {
      if (url && !url.includes(".pdf")) {
        openFullscreen(url);
      }
    };

    const handleImageError = (e) => {
      e.target.style.display = "none";
      e.target.nextSibling.style.display = "flex";
    };

    return (
      <div className="relative">
        <img
          src={url}
          alt={alt}
          className={`${className} ${
            !url?.includes(".pdf")
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : ""
          }`}
          onClick={handleImageClick}
          onError={handleImageError}
        />
        <div className="hidden items-center justify-center bg-gray-200 text-gray-500 text-sm">
          {url?.includes(".pdf") ? "PDF Document" : "Image not available"}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management Dashboard
          </h1>
          <p className="text-gray-600">
            Manage user registrations and document verification
          </p>
        </div>

        <div className="grid gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {user.document?.profilePhotoUrl ? (
                      <DocumentImage
                        url={user.document.profilePhotoUrl}
                        alt={`${user.name}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {verifiedUsers.has(user.id) && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Check className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  )}
                  <button
                    onClick={() => handleVerify(user.id)}
                    disabled={verifiedUsers.has(user.id)}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors ${
                      verifiedUsers.has(user.id)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {verifiedUsers.has(user.id) ? "Verified" : "Verify"}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    User Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-12">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-mono text-gray-900">{user.id}</span>
                    </div>
                    <div className="flex items-center space-x-12">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                    {user.document && (
                      <>
                        <div className="flex items-center space-x-12">
                          <span className="text-gray-600">Branch:</span>
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-900">
                              {user.document.branchName}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-12">
                          <span className="text-gray-600">College:</span>
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-900">
                              {user.document.college.name}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                  {user.document ? (
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <DocumentImage
                          url={user.document.idCardUrl}
                          alt="ID Card"
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <p className="text-xs text-gray-600 mt-1">ID Card</p>
                      </div>
                      <div className="text-center">
                        <DocumentImage
                          url={user.document.marksheetUrl}
                          alt="Marksheet"
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <p className="text-xs text-gray-600 mt-1">Marksheet</p>
                      </div>
                      <div className="text-center">
                        <DocumentImage
                          url={user.document.profilePhotoUrl}
                          alt="Profile Photo"
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Profile Photo
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No documents uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeFullscreen}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={fullscreenImage}
              alt="Fullscreen view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementDashboard;
