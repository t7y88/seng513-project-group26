import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { createUserInFirestore, isUsernameAvailable } from "../../firebase/firestore";
import { useAuth } from "../../contexts/authContext";
import { Navigate, useNavigate } from "react-router-dom";

function Signup() {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Username validation states
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  
  // Debounce timer
  const [usernameTimer, setUsernameTimer] = useState(null);

  // Check username availability with debounce
  const checkUsernameAvailability = async (usernameToCheck) => {
    // Clear validation state
    setIsUsernameValid(null);
    setUsernameError("");
    
    if (!usernameToCheck || usernameToCheck.trim() === "") {
      setIsUsernameValid(false);
      setUsernameError("Username cannot be empty");
      return;
    }
    
    // Clear any existing timer
    if (usernameTimer) {
      clearTimeout(usernameTimer);
    }
    
    // Set a new timer to delay the check
    setIsCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const isAvailable = await isUsernameAvailable(usernameToCheck);
        
        if (isAvailable) {
          setIsUsernameValid(true);
        } else {
          setIsUsernameValid(false);
          setUsernameError("This username is already taken");
        }
      } catch (error) {
        setIsUsernameValid(false);
        setUsernameError("Error checking username");
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500); // 500ms debounce
    
    setUsernameTimer(timer);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (usernameTimer) clearTimeout(usernameTimer);
    };
  }, [usernameTimer]);

  // Handle username change
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    checkUsernameAvailability(newUsername);
  };

  // Form validation
  const isFormValid = () => {
    return (
      email.trim() !== "" &&
      password.trim() !== "" &&
      password === confirmPassword &&
      isUsernameValid === true &&
      !isCheckingUsername
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering && isFormValid()) {
      setIsRegistering(true);
      try {
        const { user } = await doCreateUserWithEmailAndPassword(email, password);

        await createUserInFirestore(user.uid, {
          email: user.email,
          username: username.trim(),
          name: username.trim(),
          age: 0,
          location: "Unknown",
          friends: [],
          memberSince: new Date().toLocaleDateString(),
          about: "",
          description: "",
          profileImage: "",
        });

        navigate("/home");
      } catch {
        console.error("Signup failed");
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-4xl font-bold text-center mb-6">Welcome Back!</h1>
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Username - NEW FIELD */}
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input
                  required
                  disabled={isRegistering}
                  type="text"
                  id="username"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
                    ${isUsernameValid === true ? 'border-green-500 focus:ring-green-500' : ''} 
                    ${isUsernameValid === false ? 'border-red-500 focus:ring-red-500' : ''}
                    ${isCheckingUsername ? 'border-yellow-500 focus:ring-yellow-500' : ''}
                    focus:ring-gray-500`}
                  placeholder="Choose a username"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <span className="absolute inset-y-0 right-3 flex items-center">
                  {isCheckingUsername && (
                    <span className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></span>
                  )}
                  {isUsernameValid === true && <Check className="text-green-500" size={20} />}
                  {isUsernameValid === false && <AlertCircle className="text-red-500" size={20} />}
                </span>
              </div>
              {usernameError && (
                <p className="mt-1 text-sm text-red-600">{usernameError}</p>
              )}
              {isUsernameValid === true && (
                <p className="mt-1 text-sm text-green-600">Username is available!</p>
              )}
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

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-gray-700" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  required
                  disabled={isRegistering}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
                    ${confirmPassword && password === confirmPassword ? 'border-green-500' : ''}
                    ${confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}
                    focus:ring-gray-500`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <button 
              disabled={isRegistering || !isFormValid()} 
              type="submit" 
              className={`w-full py-2 px-4 rounded-lg ${isFormValid() ? 'generic-button-active' : 'generic-button-inactive'}`}
            >
              {isRegistering ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="text-center mt-4 mb-4">
            <button onClick={() => navigate("/login")} className="generic-button-inactive w-full">
              Log In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;