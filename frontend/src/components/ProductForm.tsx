import { Box, Button, Select, Table, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { closeModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { object, string } from "yup";
import { AttributeWithCategories } from "../../../src/types/attribute.type";
import { CategoryWithAttributes } from "../../../src/types/category.type";
import { ProductWithAttributes } from "../../../src/types/product.type";
import axios from "../utils/axios";

type ProductFormProps = {
  product?: ProductWithAttributes;
};

const schema = object().shape({
  name: string().required("Name is required"),
});

const ProductForm = ({ product }: ProductFormProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(
    null,
  );
  const [attributeValue, setAttributeValue] = useState<string>("");

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

  const { data: attributes } = useQuery({
    queryKey: ["attribute"],
    queryFn: () =>
      axios.get<AttributeWithCategories[]>("attribute").then((response) =>
        response.data.map(({ id, name, categories }) => ({
          label: name,
          value: id,
          categories,
        })),
      ),
    initialData: [],
  });

  const form = useForm({
    validate: yupResolver(schema),
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      categoryId: product?.category.id || "",
      attributes:
        product?.productAttributes.map(({ attribute, value }) => ({
          attributeId: attribute.id,
          value,
        })) || [],
    },
  });

  const productMutation = useMutation({
    mutationFn: (data: typeof form.values) => {
      return product
        ? axios
            .patch<ProductWithAttributes>(`product/${product?.id}`, data)
            .then((response) => response.data)
        : axios
            .post<ProductWithAttributes>("product", data)
            .then((response) => response.data);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: `Product ${product ? "updated" : "created"} successfully`,
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ["product"] });
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
      closeModal("productModal");
    },
  });

  const addProductAttribute = () => {
    if (selectedAttribute && attributeValue.trim().length > 0) {
      form.setFieldValue("attributes", [
        ...form.values.attributes,
        {
          attributeId: selectedAttribute,
          value: attributeValue,
        },
      ]);

      setSelectedAttribute(null);
      setAttributeValue("");
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    productMutation.mutate({ ...values });
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

      <TextInput
        placeholder="Description"
        label="Description"
        required
        mb="md"
        {...form.getInputProps("description")}
      />

      <Select
        data={categories}
        placeholder="Category"
        label="Category"
        clearable
        mb="md"
        {...form.getInputProps("categoryId")}
      />

      <Box component="fieldset" mb="md">
        <legend>Add attributes</legend>

        <Select
          data={attributes.filter(({ categories }) =>
            categories.some(({ id }) => id === form.values.categoryId),
          )}
          value={selectedAttribute}
          onChange={setSelectedAttribute}
          placeholder="Select attribute"
          clearable
          mb="md"
          sx={{ flex: 1 }}
        />

        <TextInput
          value={attributeValue}
          onChange={(event) => setAttributeValue(event.currentTarget.value)}
          placeholder="Value"
          mb="md"
        />

        <Button
          variant="default"
          fullWidth
          onClick={addProductAttribute}
          disabled={!selectedAttribute || attributeValue.trim().length === 0}
        >
          Add
        </Button>
      </Box>

      <Table striped highlightOnHover mb="md">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>

        <tbody>
          {form.values.attributes.map(({ attributeId, value }, index) => (
            <tr key={index}>
              <td>
                {attributes.find(({ value }) => value === attributeId)?.label}
              </td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button type="submit" fullWidth mb="xs" loading={loading}>
        {product ? "Save" : "Create"}
      </Button>
    </Box>
  );
};

export default ProductForm;
