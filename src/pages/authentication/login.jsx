import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { doSignINWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Navigate, useNavigate } from "react-router-dom";
import "../../index.css";


function Login() {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignINWithEmailAndPassword(email, password);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="flex flex-col justify-center bg-white p-8 rounded-xl shadow-lg w-96">
            <h1 className="text-4xl font-bold text-center mb-6">
              Welcome Back!
            </h1>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="generic-button-active w-full"
              >
                Log In
              </button>
            </form>

            <div className="text-center mt-4 mb-4">
              <a href="#" className="text-gray-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              onClick={() => navigate("/signup")}
              className="generic-button-inactive"
            >
              Sign Up
            </button>
          </div>
        </div>
      </>
    </>
  );
}

export default Login;
