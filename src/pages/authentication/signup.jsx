import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { createUserInFirestore, isUsernameAvailable } from "../../firebase/";
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
  const [error, setError] = useState("");
  
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  
  const [usernameTimer, setUsernameTimer] = useState(null);

  const checkUsernameAvailability = async (usernameToCheck) => {
    setIsUsernameValid(null);
    setUsernameError("");
    
    if (!usernameToCheck || usernameToCheck.trim() === "") {
      setIsUsernameValid(false);
      setUsernameError("Username cannot be empty");
      return;
    }
    
    if (usernameTimer) {
      clearTimeout(usernameTimer);
    }
    
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
    }, 500);
    
    setUsernameTimer(timer);
  };

  useEffect(() => {
    return () => {
      if (usernameTimer) clearTimeout(usernameTimer);
    };
  }, [usernameTimer]);

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    checkUsernameAvailability(newUsername);
  };

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
      setError("");
      try {
        const { user } = await doCreateUserWithEmailAndPassword(email, password);

        await createUserInFirestore(user.uid, {
          email: user.email,
          username: username.trim(),
          name: username.trim(),
          age: 0,
          location: "Unknown",
          friends: [],
          memberSince: new Date().toISOString(),
          about: "",          
          description: "",    
          profileImage: "",   
          admin: false        
        });

        navigate("/profile-setup");
      } catch (err) {
        setError("Failed to create an account. Please try again.");
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col justify-center bg-white p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-4xl font-bold text-center mb-6">Sign Up</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Choose a username"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  {isCheckingUsername && (
                    <span className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></span>
                  )}
                  {isUsernameValid === true && <Check className="text-green-500" size={20} />}
                  {isUsernameValid === false && <AlertCircle className="text-red-500" size={20} />}
                </div>
              </div>
              {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border rounded-lg"
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

            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border rounded-lg"
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
            </div>

            <button
              type="submit"
              className="generic-button-active w-full"
              disabled={isRegistering || !isFormValid()}
            >
              {isRegistering ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <button
            onClick={() => navigate("/login")}
            className="generic-button-inactive"
          >
            Already have an account? Log In
          </button>
        </div>
      </div>
    </>
  );
}

export default Signup;
