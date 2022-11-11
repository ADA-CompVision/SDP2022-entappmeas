import { LoadingOverlay } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/auth.context";

const GuestGuard = ({ children }: PropsWithChildren<{}>) => {
  const { isInitialized, user } = useAuthContext();

  if (!isInitialized) {
    return <LoadingOverlay visible />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default GuestGuard;
