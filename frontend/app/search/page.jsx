// app/your-form-page/page.js or pages/your-form.js
"use client";
import { useState } from "react";
import CollegeAutocomplete from "./(components)/collegeAutocomplete";

export default function CollegeForm() {
  const [selectedCollege, setSelectedCollege] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCollege) {
      console.log("Selected college:", selectedCollege);
      // Process your form submission
    } else {
      alert("Please select a college");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">College Information</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="college"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            College
          </label>
          <CollegeAutocomplete onSelectCollege={setSelectedCollege} />
        </div>

        {selectedCollege && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="font-medium">{selectedCollege.name}</p>
            <p className="text-sm">
              Session Fee: ${selectedCollege.sessionFee}
            </p>
            <input type="hidden" name="collegeId" value={selectedCollege.id} />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
