// useUserData.js
import { useContext } from "react";
import { UserDataContext } from "./index";

/**
 * Hook to access the current user’s data context.
 * Throws an error if used outside of <UserDataProvider>.
 */
export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
