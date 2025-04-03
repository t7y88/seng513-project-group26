import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { doSignOut } from "../firebase/auth";

function Home() {
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();

  return (
    <div className="flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-end bg-gray-200">
      <>
        <button
          onClick={() => {
            doSignOut().then(() => {
              navigate("/login");
            });
          }}
          className="text-sm text-blue-600 underline"
        >
          Logout
        </button>
      </>
    </div>
  );
}

export default Home;
