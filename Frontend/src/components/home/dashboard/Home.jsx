import { selectUser } from "@/redux/features/user/userSlice";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);

  useEffect(() => {
    if (currentUser?.id) {
      navigate("/home/dashboard");
    } else {
      navigate("/auth/login");
    }
  }, [currentUser, navigate]); // dependencies ensure it only reacts to changes

  return null; // no UI needed here
}
