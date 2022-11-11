import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";
import router from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <QueryClientProvider client={queryClient}>
        <NotificationsProvider position="top-right">
          <ModalsProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ModalsProvider>
        </NotificationsProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
