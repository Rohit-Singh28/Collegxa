"use client";
import { useState } from "react";

const RequestOTP = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4040/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("OTP sent to your email.");
      } else {
        setStatus(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setStatus("An error occurred while sending OTP.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4040/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <div>
      <h1>Request OTP</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
      {status && <p>{status}</p>}

      <form onSubmit={handleVerifyOTP} className="bg-red-300">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        <button type="submit">Verify OTP</button>
        <p>{status}</p>
      </form>
    </div>
  );
};

export default RequestOTP;
