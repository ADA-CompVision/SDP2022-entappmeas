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

type CategoryFormProps = {
  category?: CategoryWithAttributes;
};

const schema = object().shape({
  name: string().required("Name is required"),
});

const CategoryForm = ({ category }: CategoryFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: attributes } = useQuery({
    queryKey: ["attribute"],
    queryFn: () =>
      axios
        .get<AttributeWithCategories[]>("attribute")
        .then((response) =>
          response.data.map(({ id, name }) => ({ label: name, value: id })),
        ),
    initialData: [],
  });

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      name: category?.name || "",
      attributes: category?.attributes.map(({ id }) => id) || [],
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (data: typeof form.values) => {
      return category
        ? axios
            .patch<CategoryWithAttributes>(`category/${category?.id}`, data)
            .then((response) => response.data)
        : axios
            .post<CategoryWithAttributes>("category", data)
            .then((response) => response.data);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: `Category ${category ? "updated" : "created"} successfully`,
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ["category"] });
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
      closeModal("categoryModal");
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    categoryMutation.mutate({ ...values });
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
        data={attributes}
        placeholder="Attributes"
        label="Attributes"
        clearable
        mb="md"
        {...form.getInputProps("attributes")}
      />

      <Button type="submit" fullWidth mb="xs" loading={loading}>
        {category ? "Save" : "Create"}
      </Button>
    </Box>
  );
};

export default CategoryForm;
