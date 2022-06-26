import { createContext } from "react";

const AuthContext = createContext([
  {
    walletId: null,
  },
  (obj) => obj,
]);

export default AuthContext;
