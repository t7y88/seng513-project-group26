import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext/index.jsx";
/*
 * Allows shared user state across multiple pages or components, avoids redundant calls.
 * To access the user data anywhere else:
 *    - import { useUserData } from "../contexts/userDataContext";
 *    Then declare:
 *          - const { userData, completedHikes, loading } = useUserData();
*/
import { UserDataProvider } from "./contexts/userDataContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <UserDataProvider>
        <App />
      </UserDataProvider>
    </AuthProvider>
  </StrictMode>
);
