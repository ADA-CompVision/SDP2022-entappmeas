import {
  Anchor,
  Box,
  Button,
  Center,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Link } from "react-router-dom";
import { object, string } from "yup";
import { useAuthContext } from "../context/auth.context";
import { GuestGuard } from "../guards";

const schema = object().shape({
  username: string()
    .min(6, ({ min }) => `Username must have at least ${min} characters`)
    .max(256, ({ max }) => `Username must have at most ${max} characters`)
    .required("Username is required"),
  password: string()
    .min(8, ({ min }) => `Password must have at least ${min} characters`)
    .max(256, ({ max }) => `Password must have at most ${max} characters`)
    .required("Password is required"),
});

const Login = () => {
  const { login } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      await login(values.username, values.password);
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Invalid username or password",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestGuard>
      <Center sx={{ minHeight: "100vh" }}>
        <Box
          component="form"
          sx={{ width: 300, maxWidth: 300 }}
          onSubmit={form.onSubmit(handleSubmit)}
        >
          <TextInput
            placeholder="Username"
            label="Username"
            required
            mb="sm"
            {...form.getInputProps("username")}
          />

          <PasswordInput
            placeholder="Password"
            label="Password"
            required
            mb="md"
            {...form.getInputProps("password")}
          />

          <Button type="submit" fullWidth mb="xs" loading={loading}>
            Login
          </Button>

          <Text align="center">
            Don't have an account?{" "}
            <Anchor component={Link} to="/register">
              Register
            </Anchor>
          </Text>
        </Box>
      </Center>
    </GuestGuard>
  );
};

export default Login;
