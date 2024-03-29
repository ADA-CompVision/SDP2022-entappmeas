import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Image,
  InputBase,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { closeModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import type { Order } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isCreditCard } from "class-validator";
import { useMemo } from "react";
import InputMask from "react-input-mask";
import { Check, InfoCircle, Trash, X } from "tabler-icons-react";
import { z } from "zod";
import { axios } from "../../lib";
import { useCartStore } from "../../stores";
import { findPrice } from "../../utils";

const schema = z.object({
  location: z.string().trim().min(1, "Location is required"),
  note: z.string(),
  discountCode: z.string(),
  number: z
    .string()
    .refine(
      (arg) => isCreditCard(arg.replace(/\D/g, "")),
      "Invalid card number"
    ),
  exp: z.string().regex(/^(0[1-9]|1[0-2])\/{1}(2[3-9]|[3-9][0-9])$/, {
    message: "Invalid date",
  }),
  cvc: z.string().regex(/^[0-9]{3,4}$/, { message: "Invalid CVC" }),
});

const Cart = () => {
  const queryClient = useQueryClient();
  const { items } = useCartStore();

  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      location: "",
      note: "",
      discountCode: "",
      number: "",
      exp: "",
      cvc: "",
    },
  });

  const { data: findTotal, refetch: refetchFindTotal } = useQuery({
    queryKey: ["findTotal", items],
    queryFn: () =>
      axios
        .get<{ total: number; discountTotal: number }>("/cart/total", {
          params: { discountCode: form.values.discountCode },
        })
        .then((response) => response.data),
    enabled: items.length > 0,
  });

  const { mutate } = useMutation({
    mutationFn: (items: { productId: string; quantity: number }[]) => {
      return axios.post("/cart", {
        items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const { mutate: checkout, isLoading } = useMutation({
    mutationFn: (data: typeof form.values) => {
      const { exp, number, ...rest } = data;
      const [exp_month, exp_year] = data.exp.split("/").map(Number);

      return axios.post<Order>("/cart/checkout", {
        ...rest,
        number: number.replace(/\D/g, ""),
        exp_month,
        exp_year,
      });
    },
    onSuccess: ({ data: { id } }) => {
      showNotification({
        title: `Order ${id}`,
        message: "Your order was successful. Thank you for your purchase.",
        icon: <Check size={20} />,
        color: "green",
        autoClose: false,
      });

      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      showNotification({
        title: "Error",
        message: "An error occurred",
        icon: <X size={20} />,
        color: "red",
      });
    },
    onSettled: () => {
      closeModal("cart");
    },
  });

  const hasDiscount = useMemo(
    () => findTotal && findTotal.discountTotal < findTotal.total,
    [findTotal]
  );

  const handleSubmit = (data: typeof form.values) => checkout(data);

  return items.length > 0 ? (
    <Grid gutter="xl" py="xl">
      <Grid.Col md={8}>
        <Stack>
          {items.map((item) => (
            <Group key={item.productId} position="apart">
              <Group>
                <Image
                  src={item.product.images[0]?.url}
                  width={150}
                  height={150}
                  alt={item.product.name}
                  withPlaceholder
                />

                <Stack>
                  <Text weight={500}>{item.product.name}</Text>

                  <Badge size="xl" color="green" w="min-content">
                    {findPrice(item.product) * item.quantity + " AZN"}
                  </Badge>

                  <NumberInput
                    value={item.quantity}
                    onChange={(value) =>
                      mutate([
                        ...items
                          .filter(
                            ({ productId }) => productId !== item.productId
                          )
                          .map(({ productId, quantity }) => ({
                            productId,
                            quantity,
                          })),
                        {
                          productId: item.productId,
                          quantity: value as number,
                        },
                      ])
                    }
                    min={1}
                    styles={(theme) => ({
                      input: {
                        ":focus": {
                          borderColor: theme.colors.green[5],
                        },
                        ":focus-within": {
                          borderColor: theme.colors.green[5],
                        },
                      },
                    })}
                  />
                </Stack>
              </Group>

              <ActionIcon
                color="red"
                size="xl"
                onClick={() =>
                  mutate([
                    ...items
                      .filter(({ productId }) => productId !== item.productId)
                      .map(({ productId, quantity }) => ({
                        productId,
                        quantity,
                      })),
                  ])
                }
              >
                <Trash />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      </Grid.Col>
      <Grid.Col md={4} sx={{ display: "flex", flexDirection: "column" }}>
        <Group mx="auto" mb="lg" spacing="xs">
          <Text fz="xl" weight={500} align="center">
            Total:
          </Text>

          <Badge
            size="xl"
            color="green"
            styles={{
              inner: {
                textDecoration: hasDiscount ? "line-through" : "none",
              },
            }}
          >
            {findTotal ? findTotal.total + " AZN" : ""}
          </Badge>

          {hasDiscount && (
            <Badge size="xl" color="green">
              {findTotal ? findTotal.discountTotal + " AZN" : ""}
            </Badge>
          )}
        </Group>

        <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            placeholder="Location"
            size="lg"
            styles={(theme) => ({
              input: {
                ":focus": {
                  borderColor: theme.colors.green[5],
                },
                ":focus-within": {
                  borderColor: theme.colors.green[5],
                },
              },
            })}
            mb="md"
            {...form.getInputProps("location")}
          />

          <Textarea
            placeholder="Note"
            size="lg"
            styles={(theme) => ({
              input: {
                ":focus": {
                  borderColor: theme.colors.green[5],
                },
                ":focus-within": {
                  borderColor: theme.colors.green[5],
                },
              },
            })}
            mb="md"
            {...form.getInputProps("note")}
          />

          <Flex align="center" gap="xs" mb="lg">
            <TextInput
              placeholder="Discount code"
              size="lg"
              sx={{ flex: 1 }}
              styles={(theme) => ({
                input: {
                  ":focus": {
                    borderColor: theme.colors.green[5],
                  },
                  ":focus-within": {
                    borderColor: theme.colors.green[5],
                  },
                },
              })}
              {...form.getInputProps("discountCode")}
            />

            <Button
              size="lg"
              color="green"
              variant="subtle"
              px="xs"
              onClick={() => refetchFindTotal()}
              disabled={form.values.discountCode.trim().length === 0}
            >
              APPLY
            </Button>
          </Flex>

          <InputBase
            placeholder="Card number"
            size="lg"
            styles={(theme) => ({
              input: {
                ":focus": {
                  borderColor: theme.colors.green[5],
                },
                ":focus-within": {
                  borderColor: theme.colors.green[5],
                },
              },
            })}
            mb="md"
            component={InputMask}
            mask="9999 9999 9999 9999"
            {...form.getInputProps("number")}
          />

          <Flex align="center" gap="xs" mb="lg">
            <TextInput
              placeholder="MM/YY"
              size="lg"
              sx={{ flex: 1 }}
              styles={(theme) => ({
                input: {
                  ":focus": {
                    borderColor: theme.colors.green[5],
                  },
                  ":focus-within": {
                    borderColor: theme.colors.green[5],
                  },
                },
              })}
              {...form.getInputProps("exp")}
            />

            <TextInput
              placeholder="CVC"
              size="lg"
              sx={{ flex: 1 }}
              styles={(theme) => ({
                input: {
                  ":focus": {
                    borderColor: theme.colors.green[5],
                  },
                  ":focus-within": {
                    borderColor: theme.colors.green[5],
                  },
                },
              })}
              {...form.getInputProps("cvc")}
            />
          </Flex>

          <Button
            id="checkout"
            type="submit"
            size="xl"
            color="green"
            fullWidth
            loading={isLoading}
          >
            Checkout
          </Button>
        </Box>
      </Grid.Col>
    </Grid>
  ) : (
    <Alert
      title={
        <Text fz="xl" weight={500}>
          Empty
        </Text>
      }
      icon={<InfoCircle size={28} />}
      color="yellow"
      styles={{
        icon: {
          width: 28,
          height: 28,
        },
      }}
    >
      <Text fz="md">
        Your cart is empty. Start by adding items to your cart.
      </Text>
    </Alert>
  );
};

export default Cart;
