import { ActionIcon, Box, Button, Group, Table, Text } from "@mantine/core";
import { openConfirmModal, openModal } from "@mantine/modals";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ProductWithAttributes } from "../../../src/types/product.type";
import { ProductForm } from "../components";
import axios from "../utils/axios";

const columnHelper = createColumnHelper<ProductWithAttributes>();

const Product = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["product"],
    queryFn: () =>
      axios
        .get<ProductWithAttributes[]>("product")
        .then((response) => response.data),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (product: ProductWithAttributes) =>
      axios
        .delete<ProductWithAttributes>(`product/${product.id}`)
        .then((response) => response.data),
    onMutate: () => {
      showNotification({
        id: "deleteProduct",
        message: `Product deleting`,
      });
    },
    onSuccess: () => {
      updateNotification({
        id: "deleteProduct",
        title: "Success",
        message: `Product deleted successfully`,
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: () => {
      updateNotification({
        id: "deleteProduct",
        title: "Error",
        message: `An error occurred`,
        color: "red",
      });
    },
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "#",
      cell: (props) => props.row.index + 1,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => props.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      cell: (props) => (
        <Group position="right">
          <ActionIcon
            size="lg"
            color="yellow"
            onClick={() => handleProductModal(props.row.original)}
          >
            <IconEdit />
          </ActionIcon>

          <ActionIcon
            size="lg"
            color="red"
            onClick={() => handleDeleteModal(props.row.original)}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleProductModal = (product?: ProductWithAttributes) => {
    openModal({
      modalId: "productModal",
      title: product ? "Update product" : "Create product",
      centered: true,
      children: <ProductForm product={product} />,
    });
  };

  const handleDeleteModal = (product: ProductWithAttributes) => {
    openConfirmModal({
      title: "Delete product",
      centered: true,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      children: (
        <Text size="sm">Are you sure you want to delete this product?</Text>
      ),
      onConfirm: () => deleteMutation.mutate(product),
    });
  };

  return (
    <Box>
      <Button mb="md" onClick={() => handleProductModal()}>
        New product
      </Button>

      <Table striped highlightOnHover>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default Product;
