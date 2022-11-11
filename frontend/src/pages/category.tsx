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
import { CategoryWithAttributes } from "../../../src/types/category.type";
import { CategoryForm } from "../components";
import axios from "../utils/axios";

const columnHelper = createColumnHelper<CategoryWithAttributes>();

const Category = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: () =>
      axios
        .get<CategoryWithAttributes[]>("category")
        .then((response) => response.data),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (category: CategoryWithAttributes) =>
      axios
        .delete<CategoryWithAttributes>(`category/${category.id}`)
        .then((response) => response.data),
    onMutate: () => {
      showNotification({
        id: "deleteCategory",
        message: `Category deleting`,
      });
    },
    onSuccess: () => {
      updateNotification({
        id: "deleteCategory",
        title: "Success",
        message: `Category deleted successfully`,
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: () => {
      updateNotification({
        id: "deleteCategory",
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
            onClick={() => handleCategoryModal(props.row.original)}
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

  const handleCategoryModal = (category?: CategoryWithAttributes) => {
    openModal({
      modalId: "categoryModal",
      title: category ? "Update category" : "Create category",
      centered: true,
      children: <CategoryForm category={category} />,
    });
  };

  const handleDeleteModal = (category: CategoryWithAttributes) => {
    openConfirmModal({
      title: "Delete category",
      centered: true,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      children: (
        <Text size="sm">
          Are you sure you want to delete this category and all the related
          data?
        </Text>
      ),
      onConfirm: () => deleteMutation.mutate(category),
    });
  };

  return (
    <Box>
      <Button mb="md" onClick={() => handleCategoryModal()}>
        New category
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

export default Category;
