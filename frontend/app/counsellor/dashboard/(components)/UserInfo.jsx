import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  Building,
  CreditCard,
  Edit3,
  Save,
  X,
} from "lucide-react";

const UserInfo = () => {
  const [counsellorData, setCounsellorData] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isEditingUPI, setIsEditingUPI] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [tempUpiId, setTempUpiId] = useState("");

  const fetchCounsellorDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/counsellor/info`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status !== 200 || !res.data?.data) {
        throw new Error("Counsellor not found");
      }

      setCounsellorData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching counsellor details:", error);
      toast.error("Counsellor not found. Please try again or contact support.");
      setLoading(false);
    }
  };

  const handleEditUPI = () => {
    setTempUpiId(upiId);
    setIsEditingUPI(true);
  };

  const handleSaveUPI = async () => {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/counsellor/update`,
      {
        UPI: tempUpiId,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setUpiId(tempUpiId);
    setIsEditingUPI(false);
  };

  const handleCancelUPI = () => {
    setTempUpiId(upiId);
    setIsEditingUPI(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchCounsellorDetails();
  }, []);

  console.log("Counsellor Details:", counsellorData);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={counsellorData?.document?.profilePhotoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {counsellorData?.name}
              </h1>
              <p className="text-gray-600 mb-1">
                Counsellor ID: #{counsellorData?.id}
              </p>
              <p className="text-sm text-gray-500">
                Member since {formatDate(counsellorData?.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <p className="text-sm text-indigo-600 font-medium">
                  Session Fee
                </p>
                <p className="text-2xl font-bold text-indigo-800">
                  ₹{counsellorData?.document?.college?.sessionFee}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">
                    {counsellorData?.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800 break-all">
                    {counsellorData?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-600" />
              Academic Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Institution</p>
                  <p className="font-medium text-gray-800">
                    {counsellorData?.document?.college?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium text-gray-800">
                    {counsellorData?.document?.branchName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
              Payment Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">UPI ID</p>
                {isEditingUPI ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={tempUpiId}
                      onChange={(e) => setTempUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g., name@paytm)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveUPI}
                        className="flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelUPI}
                        className="flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">
                      {upiId || "Not configured"}
                    </p>
                    <button
                      onClick={handleEditUPI}
                      className="flex items-center px-3 py-1.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      {upiId ? "Edit" : "Add"}
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  💡 Students will use this UPI ID to pay for counselling
                  sessions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Verification Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">ID Card</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                <img
                  src={counsellorData?.document?.idCardUrl}
                  alt="ID Card"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Marksheet</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                <img
                  src={counsellorData?.document?.marksheetUrl}
                  alt="Marksheet"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
