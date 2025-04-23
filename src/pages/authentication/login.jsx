import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { doSignInWithEmailAndPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Navigate, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase.js"; 
import { GoogleLogin } from "@react-oauth/google"; 
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth"; 
import { db } from "../../firebase/firebase"; 
import { getDoc, doc } from "firebase/firestore"; 
import "../../index.css";

function Login() {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setError("");
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (err) {
        let errorMessage = "Failed to sign in. Please try again.";
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          errorMessage = "Invalid email or password";
        } else if (err.code === "auth/invalid-email") {
          errorMessage = "Invalid email address";
        } else if (err.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        }
        setError(errorMessage);
        setIsSigningIn(false);
      }
    }
  };

  // Function to handle password reset
  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);  // Show confirmation message
      setError("");  // Clear any previous errors
    } catch (err) {
      setError("Error resetting password. Please try again.");
    }
  };

  // Google login handler
  const handleGoogleLogin = async (response) => {
    try {
      const googleCredential = GoogleAuthProvider.credential(response.credential);
      const userCredential = await signInWithCredential(auth, googleCredential);

      if (userCredential.user) {
        const user = userCredential.user;

        // Check if user exists in Firestore
        const userDoc = doc(db, "users", user.uid); // Assuming "users" collection
        const userSnap = await getDoc(userDoc);

        if (!userSnap.exists()) {
          // New user - handle account creation
          console.log("New user. Prompt for additional info.");
          // Redirect or show modal to create a profile
        } else {
          // Existing user - navigate to home page
          console.log("Existing user.");
          navigate("/home"); // Go to home page or dashboard
        }
      }
    } catch (error) {
      console.error("Error during Google login:", error.message);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col justify-center bg-white p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-4xl font-bold text-center mb-6">Welcome Back!</h1>
          
          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.error("Login Failed")}
            useOneTap={true} // Optional for one-tap login
            theme="filled_black" // Optional for dark theme
          />

          <form onSubmit={onSubmit} className="mt-4">
            {error && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
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
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing in..." : "Log In"}
            </button>
          </form>

          <div className="text-center mt-4 mb-4">
            {resetEmailSent ? (
              <p className="text-green-500">Password reset email sent. Please check your inbox.</p>
            ) : (
              <a
                href="#"
                className="text-gray-600 hover:underline"
                onClick={handleForgotPassword} // Trigger password reset
              >
                Forgot password?
              </a>
            )}
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
  );
}

export default Login;
