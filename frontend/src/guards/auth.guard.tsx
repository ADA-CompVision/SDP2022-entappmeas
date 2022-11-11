import { LoadingOverlay } from "@mantine/core";
import { PropsWithChildren, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/auth.context";

const AuthGuard = ({ children }: PropsWithChildren<{}>) => {
  const { isInitialized, user } = useAuthContext();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null,
  );

  if (!isInitialized) {
    return <LoadingOverlay visible />;
  }

  if (!user) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    return <Navigate to="/login" replace />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);

    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
