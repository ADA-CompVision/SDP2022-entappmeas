import { AppShell, Tabs } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthGuard } from "../guards";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Tabs
      value={pathname.split("/").pop()}
      onTabChange={(value) => navigate(`/dashboard/${value}`)}
    >
      <Tabs.List position="center" mb="md" sx={{ height: 50 }}>
        <Tabs.Tab value="category">Category</Tabs.Tab>
        <Tabs.Tab value="attribute">Attribute</Tabs.Tab>
        <Tabs.Tab value="product">Product</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};

const Dashboard = () => {
  return (
    <AuthGuard>
      <AppShell header={<Header />}>
        <Outlet />
      </AppShell>
    </AuthGuard>
  );
};

export default Dashboard;
