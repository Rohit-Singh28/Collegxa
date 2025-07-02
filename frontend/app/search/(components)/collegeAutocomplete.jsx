// components/CollegeAutocomplete.jsx
"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";

export default function CollegeAutocomplete({ onSelectCollege }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inputValue.length >= 3) {
        fetchCollegeSuggestions();
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const fetchCollegeSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/college`,
        {
          params: {
            term: inputValue,
          },
          withCredentials: true,
        }
      );

      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching college suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectCollege = (college) => {
    setInputValue(college.name);
    setShowSuggestions(false);
    if (onSelectCollege) {
      onSelectCollege(college);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    // Implementation for arrow key navigation would go here
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter college name (at least 3 characters)"
        className="w-full p-2 border border-gray-300 rounded"
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-2 top-2">
          <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((college) => (
            <div
              key={college.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectCollege(college)}
            >
              <div className="font-medium">{college.name}</div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions &&
        suggestions.length === 0 &&
        !isLoading &&
        inputValue.length >= 3 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
            No colleges found
          </div>
        )}
    </div>
  );
}
