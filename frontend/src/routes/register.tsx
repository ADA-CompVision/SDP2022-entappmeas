import {
  Anchor,
  Box,
  Button,
  Center,
  InputBase,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import InputMask from "react-input-mask";
import { Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import { useAuthContext } from "../context/auth.context";
import { GuestGuard } from "../guards";

const schema = object().shape({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  address: string().required("Address name is required"),
  phone: string()
    .required()
    .matches(/^(\+994|0)(10|5[015]|7[07]|99)\d{7}$/, "Invalid phone number"),
  email: string().required().email("Invalid email"),
  username: string()
    .min(6, ({ min }) => `Username must have at least ${min} characters`)
    .max(256, ({ max }) => `Username must have at most ${max} characters`)
    .required("Username is required"),
  password: string()
    .min(8, ({ min }) => `Password must have at least ${min} characters`)
    .max(256, ({ max }) => `Password must have at most ${max} characters`)
    .required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      await register(values);
      navigate("/login");

      showNotification({
        title: "Success",
        message: "You have successfully registered. Login to continue",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Error",
        message: "An error occurred",
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
            placeholder="First name"
            label="First name"
            required
            mb="sm"
            {...form.getInputProps("firstName")}
          />

          <TextInput
            placeholder="Last name"
            label="Last name"
            required
            mb="sm"
            {...form.getInputProps("lastName")}
          />

          <TextInput
            placeholder="Address"
            label="Address"
            required
            mb="sm"
            {...form.getInputProps("address")}
          />

          <InputBase
            label="Phone"
            placeholder="Phone"
            component={InputMask}
            mask="+\9\94999999999"
            required
            mb="sm"
            {...form.getInputProps("phone")}
          />

          <TextInput
            type="email"
            placeholder="Email address"
            label="Email address"
            required
            mb="sm"
            {...form.getInputProps("email")}
          />

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
            Register
          </Button>

          <Text align="center">
            Already have an account?{" "}
            <Anchor component={Link} to="/login">
              Login
            </Anchor>
          </Text>
        </Box>
      </Center>
    </GuestGuard>
  );
};

export default Register;
