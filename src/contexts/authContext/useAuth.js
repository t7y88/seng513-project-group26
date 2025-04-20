import React, { useContext } from "react";
import { defaultAuthContext } from "../../types/types";

const AuthContext = React.createContext(defaultAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}
