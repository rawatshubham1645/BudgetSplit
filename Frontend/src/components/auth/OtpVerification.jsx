import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { USERS_REGISTER, USERS_REGISTER_REQUEST_OTP } from "@/imports/api";
import useMutation from "@/hooks/useMutation";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/features/user/userSlice";

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { mutate, loading } = useMutation();

  // Focus first input on component mount
  useEffect(() => {
    const firstInput = document.querySelector('[data-otp-input="0"]');
    if (firstInput) {
      firstInput.focus();
    }
    if (!email) {
      navigate("/auth/login");
    }
  }, []);

  // Handle input paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    const numbers = pasteData.split("").filter((char) => !isNaN(char));

    setOtp((prev) => {
      const newOtp = [...prev];
      numbers.forEach((num, idx) => {
        if (idx < 6) newOtp[idx] = num;
      });
      return newOtp;
    });

    // Focus the next empty input or the last input
    const inputs = Array.from(e.target.parentNode.children);
    const nextEmptyIndex = numbers.length < 6 ? numbers.length : 5;
    if (inputs[nextEmptyIndex]) {
      inputs[nextEmptyIndex].focus();
    }
  };

  // Handle all keyboard input
  const handleKeyDown = (e, index) => {
    const key = e.key;

    // Prevent default behavior for all keys we handle
    e.preventDefault();

    // Handle backspace
    if (key === "Backspace") {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = "";
        return newOtp;
      });

      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
      return;
    }

    // Handle number inputs (0-9)
    if (/^[0-9]$/.test(key)) {
      setOtp((prev) => {
        const newOtp = [...prev];
        newOtp[index] = key;
        return newOtp;
      });

      // Move to next input if available, or focus verify button if it's the last input
      if (index === 5) {
        // Find and focus the verify button
        const verifyButton = document.querySelector("[data-verify-button]");
        if (verifyButton) {
          verifyButton.focus();
        }
      } else if (e.target.nextSibling) {
        e.target.nextSibling.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    // Add your OTP verification logic here
    console.log("Verifying OTP:", otpValue);
    const response = await mutate({
      url: USERS_REGISTER + `?otp=${otpValue}`,
      method: "POST",
      data: { ...location.state },
      skipToken: true,
    });
    if (response.success) {
      // Save user data and token to Redux store
      dispatch(setUser({ ...response?.data?.data?.userDto }));
      dispatch(setToken({ token: response?.data?.data?.token }));
      navigate("/home");
    } else {
      setError(
        response.data?.message || "Failed to verify OTP. Please try again."
      );
    }
  };

  const handleResend = async () => {
    await mutate({
      url: USERS_REGISTER_REQUEST_OTP,
      method: "POST",
      data: { ...location.state },
      skipToken: true,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-teal-400 px-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg border shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            We've sent a verification code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Label htmlFor="otp-input">Enter verification code</Label>
            <div className="flex gap-2 justify-center">
              {otp.map((data, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="w-12 h-12 text-center text-lg"
                  value={data}
                  data-otp-input={index}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>

          <div className="flex flex-col space-y-4">
            <Button
              loading={loading}
              type="submit"
              className="w-full"
              onClick={handleSubmit}
              data-verify-button
            >
              Verify Email
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleResend}
                className="flex-1"
              >
                Resend Code
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/auth/register")}
                className="flex-1"
              >
                Change Email
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
