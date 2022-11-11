import { Box, Button, MultiSelect, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { closeModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { object, string } from "yup";
import { AttributeWithCategories } from "../../../src/types/attribute.type";
import { CategoryWithAttributes } from "../../../src/types/category.type";
import axios from "../utils/axios";

type AttributeFormProps = {
  attribute?: AttributeWithCategories;
};

const schema = object().shape({
  name: string().required("Name is required"),
});

const AttributeForm = ({ attribute }: AttributeFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: () =>
      axios
        .get<CategoryWithAttributes[]>("category")
        .then((response) =>
          response.data.map(({ id, name }) => ({ label: name, value: id })),
        ),
    initialData: [],
  });

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      name: attribute?.name || "",
      categories: attribute?.categories.map(({ id }) => id) || [],
    },
  });

  const attributeMutation = useMutation({
    mutationFn: (data: typeof form.values) => {
      return attribute
        ? axios
            .patch<AttributeWithCategories>(`attribute/${attribute?.id}`, data)
            .then((response) => response.data)
        : axios
            .post<AttributeWithCategories>("attribute", data)
            .then((response) => response.data);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: `Attribute ${attribute ? "updated" : "created"} successfully`,
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ["attribute"] });
    },
    onError: () => {
      showNotification({
        title: "Error",
        message: "An error occurred",
        color: "red",
      });
    },
    onSettled: () => {
      setLoading(false);
      closeModal("attributeModal");
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    attributeMutation.mutate({ ...values });
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        placeholder="Name"
        label="Name"
        required
        mb="md"
        {...form.getInputProps("name")}
      />

      <MultiSelect
        data={categories}
        placeholder="Categories"
        label="Categories"
        clearable
        mb="md"
        {...form.getInputProps("categories")}
      />

      <Button type="submit" fullWidth mb="xs" loading={loading}>
        {attribute ? "Save" : "Create"}
      </Button>
    </Box>
  );
};

export default AttributeForm;
