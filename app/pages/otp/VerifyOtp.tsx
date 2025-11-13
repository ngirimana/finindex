import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyEmailMutation } from "~/services/finApi";
import { useBrandedModal } from "~/components/BrandedModal";

export default function VerifyOTP() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [verifyEmail, { isLoading, isSuccess, error, isError }] =
    useVerifyEmailMutation();
  const navigate = useNavigate();

  const { Modal, openAlert } = useBrandedModal();

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input automatically
      if (value !== "" && index < 5) {
        const next = document.getElementById(`otp-${index + 1}`);
        if (next) next.focus();
      }
    }
  };

  const handleVerify = async () => {
    const email = localStorage.getItem("pendingUserEmail");
    const code = otp.join("");

    if (!email) {
      openAlert(
        "Missing email",
        "We couldn't find your email. Please go back to registration and try again.",
        "danger"
      );
      return;
    }

    if (code.length !== 6) {
      openAlert(
        "Incomplete code",
        "Please enter all 6 digits of the verification code.",
        "danger"
      );
      return;
    }

    try {
      await verifyEmail({ email, otp: code }).unwrap();
    } catch {
      // error will be handled by isError effect below
    }
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }

    if (isError) {
      // Try to extract a backend message if available
      const apiError = error as any;
      const message =
        apiError?.data?.message ||
        apiError?.error ||
        "The verification code is invalid or has expired. Please try again.";

      openAlert("Verification failed", message, "danger");
    }
  }, [isSuccess, isError, error, navigate, openAlert]);

  return (
    <>
      {/* Modal must be rendered somewhere in the tree */}
      {Modal}

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#A75A37] backdrop-blur-md shadow-lg rounded-xl p-8 w-full max-w-sm text-center">
          <h1 className="text-white text-2xl font-semibold mb-2">
            Verify Your Account
          </h1>

          <p className="text-[#F5DCCB] mb-6">
            Enter the 6-digit code sent to your email.
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
            disabled={isLoading}
            className={`
              w-full py-3 rounded-lg 
              bg-[#8B4A2E] text-white font-medium text-lg
              hover:bg-[#793d21] transition
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      </div>
    </>
  );
}
