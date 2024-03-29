import "@fontsource/jetbrains-mono";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { AccountWithoutPassword } from "local-types";
import { useEffect } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { AdminLayout, BusinessLayout, CustomerLayout } from "./layouts";
import { axios } from "./lib";
import { AdminHome, BusinessHome, Confirm, CustomerHome } from "./pages";
import { useAuthStore } from "./stores";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [{ element: <CustomerHome />, index: true }],
  },
  {
    path: "business",
    element: <BusinessLayout />,
    children: [{ element: <BusinessHome />, index: true }],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [{ element: <AdminHome />, index: true }],
  },
  { path: "confirm/:hash", element: <Confirm /> },
  { path: "*", element: <Navigate to="/" /> },
]);

const App = () => {
  const { accessToken, setUser } = useAuthStore();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  useQuery({
    queryKey: ["account"],
    queryFn: () =>
      axios
        .get<AccountWithoutPassword>("/auth/account")
        .then((response) => response.data),
    enabled: !!accessToken,
    onSuccess: (user) => {
      setUser(user);
    },
    onError: () => {
      setUser(null);
    },
  });

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
    }
  }, [accessToken]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, fontFamily: "JetBrains Mono" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications position="top-right" />

        <ModalsProvider>
          <RouterProvider router={router} />
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
