import React, { useState } from "react";

export default function VerifyOTP() {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input automatically
      if (value !== "" && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    alert("Verifying: " + code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-[#A75A37] backdrop-blur-md shadow-lg rounded-xl p-8 w-full max-w-sm text-center">
        <h1 className="text-white text-2xl font-semibold mb-2">
          Verify Your Account
        </h1>

        <p className="text-[#F5DCCB] mb-6">
          Enter the 6-digit code sent to your email .
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="
                w-12 h-12 text-center text-xl font-semibold
                bg-white/20 text-white
                border border-white rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#C9A28C]
              "
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          className="
            w-full py-3 rounded-lg 
            bg-[#8B4A2E] text-white font-medium text-lg
            hover:bg-[#793d21] transition
          "
        >
          Verify Code
        </button>

        {/* Resend */}
        <div className="mt-4">
          <p className="text-[#F5DCCB]">
            Didn’t receive the code?{" "}
            <button className="underline text-white hover:text-[#F5DCCB]">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
