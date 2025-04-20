const otpStore = new Map();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log("Email:", email);

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // fallback for randomInt
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // ✅ Store it

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "thetruthofuniverse333@gmail.com",
      pass: "udtjhdtjotmvferz",
    },
  });

  const mailOptions = {
    from: "thetruthofuniverse333@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  console.log(email, otp, record);

  if (!record)
    return res.status(400).json({ message: "No OTP found for this email" });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp === otp) {
    otpStore.delete(email); // clear used OTP
    return res.status(200).json({ message: "OTP verified successfully" });
  }

  return res.status(400).json({ message: "Invalid OTP" });
};

module.exports = verifyOtp;

module.exports = { sendOtp, verifyOtp };
