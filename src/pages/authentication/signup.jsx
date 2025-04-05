import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Navigate, useNavigate } from "react-router-dom";

function Signup() {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      await doCreateUserWithEmailAndPassword(email, password);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-xl shadow-lg w-96">
            <h1 className="text-4xl font-bold text-center mb-6">
              Welcome Back!
            </h1>
            <form onSubmit={onSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  required
                  disabled={isRegistering}
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
              {/* Password */}
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    required
                    disabled={isRegistering}
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
              {/* Confirm Pasword */}
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="password">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    required
                    disabled={isRegistering}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <button
                disabled={isRegistering}
                type="submit"
                className="generic-button-active w-full"
              >
                {isRegistering ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <div className="text-center mt-4 mb-4">
              <button
                onClick={() => navigate("/login")}
                className="generic-button-inactive w-full"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default Signup;
