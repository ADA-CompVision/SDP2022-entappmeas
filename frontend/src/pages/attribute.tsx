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
import { AttributeWithCategories } from "../../../src/types/attribute.type";
import { AttributeForm } from "../components";
import axios from "../utils/axios";

const columnHelper = createColumnHelper<AttributeWithCategories>();

const Attribute = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["attribute"],
    queryFn: () =>
      axios
        .get<AttributeWithCategories[]>("attribute")
        .then((response) => response.data),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (attribute: AttributeWithCategories) =>
      axios
        .delete<AttributeWithCategories>(`attribute/${attribute.id}`)
        .then((response) => response.data),
    onMutate: () => {
      showNotification({
        id: "deleteAttribute",
        message: `Attribute deleting`,
      });
    },
    onSuccess: () => {
      updateNotification({
        id: "deleteAttribute",
        title: "Success",
        message: `Attribute deleted successfully`,
        color: "green",
      });

      queryClient.invalidateQueries({ queryKey: ["attribute"] });
    },
    onError: () => {
      updateNotification({
        id: "deleteAttribute",
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
            onClick={() => handleAttributeModal(props.row.original)}
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

  const handleAttributeModal = (attribute?: AttributeWithCategories) => {
    openModal({
      modalId: "attributeModal",
      title: attribute ? "Update attribute" : "Create attribute",
      centered: true,
      children: <AttributeForm attribute={attribute} />,
    });
  };

  const handleDeleteModal = (attribute: AttributeWithCategories) => {
    openConfirmModal({
      title: "Delete attribute",
      centered: true,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      children: (
        <Text size="sm">
          Are you sure you want to delete this attribute and all the related
          data?
        </Text>
      ),
      onConfirm: () => deleteMutation.mutate(attribute),
    });
  };

  return (
    <Box>
      <Button mb="md" onClick={() => handleAttributeModal()}>
        New attribute
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

export default Attribute;
