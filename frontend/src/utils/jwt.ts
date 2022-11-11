import jwtDecode from "jwt-decode";
import { SignedUser } from "../../../src/types/user.type";

export const isValidToken = (token?: string) => {
  if (!token) {
    return false;
  }

  const decoded = jwtDecode(token) as SignedUser;
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};
