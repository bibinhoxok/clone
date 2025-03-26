"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/columns";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/schemas/staffSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateUserForm } from "@/components/forms/staff/createStaffForm";
import { TablePagination } from "@/components/data-table/table-pagination";
import { RowSelectionState, TablePaginationProps } from "@next-server-actions/types";
import { deleteStaff, toggleActiveStatus } from "@/actions/staffActions";
import { useToast } from "@/lib/custom-hooks"
export default function ExampleTablePage() {
  const [data, setData] = useState<Staff[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [paginationData, setPaginationData] = useState<TablePaginationProps>({
    page: 1,
    limit: 5,
  });
  const [sortData, setSortData] = useState<{ sortBy: string; sortOrder: string } | null>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [rowSelection, setRowSelection] = useState({});
  const [stringFilterDebauced, setStringFilterDebauced] = useState<string>("")

  const fetchData = async (
    filters: any = {},
    page: number = 1,
    limit: number = 5,
    sortBy: string = "createdAt",
    sortOrder: string = "desc"
  ) => {
    try {
      const filterQuery = Object.keys(filters)
        .map((key) => `${key}=${filters[key]}`)
        .join("&");
      const url = `/api/staff?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${filterQuery ? "&" + filterQuery : ""}`;
      const res = await fetch(url);
      const rawData = await res.json();
      const staffData = {
        ...rawData,
        sortBy,
        sortOrder,
        data: rawData.data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        })),
      };
      const { data, ...pagination } = staffData;
      setPaginationData(pagination);
      setData(staffData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const { sortBy, sortOrder } = sortData || { sortBy: "createdAt", sortOrder: "desc" };
    setPaginationData((prev) => ({ ...prev, page: 1 }));
    fetchData({name:stringFilterDebauced}, 1, paginationData.limit, sortBy, sortOrder);
  }, [sortData, paginationData.limit, stringFilterDebauced]);

  useEffect(() => {
    const { sortBy, sortOrder } = sortData || { sortBy: "createdAt", sortOrder: "desc" };
    fetchData({name:stringFilterDebauced}, paginationData.page, paginationData.limit, sortBy, sortOrder);
  }, [paginationData.page]);

  useEffect(() => {
    if (data.length > 0) {
      data.map((item: Staff, index) => {
        if (selectedRows.has(item._id.toString())) {
          setRowSelection((prev: RowSelectionState) => ({ ...prev, [index]: true }));
        } else {
          setRowSelection((prev: RowSelectionState) => {
            const newSelection = { ...prev };
            delete newSelection[index];
            return newSelection;
          });
        }
      });
    }
  }, [data, selectedRows]);

  const handleRowSelectionChange = (rowId: string, isSelected: boolean) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (isSelected) {
        newSelectedRows.add(rowId);
      } else {
        newSelectedRows.delete(rowId);
      }
      return newSelectedRows;
    });
  };

  const handleDeleteStaff = async (staffId: string) => {
    const result = await deleteStaff(staffId);
    if (result.success) {
      setData(data.filter((i) => i._id !== staffId));
      setSelectedRows((prev) => {
        prev.delete(staffId);
        return new Set(prev);
      });
      useToast("Staff deleted successfully!");
    } else {
      useToast("Failed to delete staff.");
    }
  };
  const handleToggleStatus = async (staffId: string) => {
    const result = await toggleActiveStatus(staffId);
    if (result.success) {
      setData(
        data.map((staff) =>
          staff._id === staffId ? { ...staff, is_active: !staff.is_active } : staff
        )
      );
      useToast("Staff status updated successfully!");
    } else {
      useToast("Failed to update staff status.");
    }
  };

  const handleToggleMultipleStatus = async (staffIds: string[]) => {
    const togglePromises = staffIds.map(async (staffId) => {
      return await toggleActiveStatus(staffId);
    });
    const results = await Promise.all(togglePromises);

    const successfulToggles = results.filter((result) => result.success);
    const failedToggles = results.filter((result) => !result.success);

    if (successfulToggles.length > 0) {
      setData(
        data.map((staff) => {
          if (staffIds.includes(staff._id.toString())) {
            return { ...staff, is_active: !staff.is_active }; // Assuming all toggled are meant to be flipped
          }
          return staff;
        })
      );
      useToast(
        successfulToggles.length > 1
          ? `Successfully toggled status for ${successfulToggles.length} staff members!`
          : "Successfully toggled staff status!"
      );
    }

    if (failedToggles.length > 0) {
      useToast(`Failed to toggle status for ${failedToggles.length} staff members.`);
    }
  };

  const handleDeleteMultipleStaff = async (staffIds: string[]) => {
    const deletePromises = staffIds.map(async (staffId) => {
      return await deleteStaff(staffId);
    });
    const results = await Promise.all(deletePromises);

    const successfulDeletions = results.filter((result) => result.success);
    const failedDeletions = results.filter((result) => !result.success);

    if (successfulDeletions.length > 0) {
      setData(data.filter((item) => !staffIds.includes(item._id.toString())));
      staffIds.forEach((id) =>
        setSelectedRows((prev) => {
          prev.delete(id);
          return new Set(prev);
        })
      );
      useToast(
        successfulDeletions.length > 1
          ? `Successfully deleted ${successfulDeletions.length} staff members!`
          : "Successfully deleted staff member!"
      );
    }

    if (failedDeletions.length > 0) {
      useToast(`Failed to delete ${failedDeletions.length} staff members.`);
    }
  };
  const columns = createColumns<Staff>(
    [
      {
        accessorKey: "_id",
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllRowsSelected(!!value);
              if (value) {
                table
                  .getRowModel()
                  .rows.forEach((row: any) =>
                    setSelectedRows((prev) => new Set([...prev, row.original._id]))
                  );
              } else {
                table.getRowModel().rows.forEach((row: any) =>
                  setSelectedRows((prev) => {
                    prev.delete(row.original._id);
                    return new Set(prev);
                  })
                );
              }
            }}
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            checked={selectedRows.has(row.original._id)}
            onCheckedChange={(value) => {
              handleRowSelectionChange(row.original._id, !!value);
            }}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Full Name",
        enableSorting: true,
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: (info: { getValue: () => boolean }) => (
          <Badge variant={info.getValue() ? "default" : "destructive"}>
            {info.getValue() ? "active" : "inactive"}
          </Badge>
        ),
        enableSorting: true,
      },

      {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        enableSorting: true,
      },
      {
        accessorKey: "role",
        header: "Role",
        enableSorting: true,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info: { getValue: () => Date }) => info.getValue().toLocaleDateString(),
        enableSorting: true,
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: (info: { getValue: () => Date }) => info.getValue().toLocaleDateString(),
        enableSorting: true,
      },
    ],
    {
      header: [
        {
          accessorKey: "toggleStatus",
          title: "Toggle Status",
          action: (items: Staff[]) => {
            const itemsId = items.map((item) => item._id.toString());
            handleToggleMultipleStatus(itemsId);
          },
        },
        {
          accessorKey: "onDelete",
          title: "Delete items",
          resetSelectedRows: true,
          action: (items: Staff[]) => {
            const itemsId = items.map((item) => item._id.toString());
            handleDeleteMultipleStaff(itemsId);
          },
        },
      ],
      cellRenderers: [
        {
          accessorKey: "onEdit",
          title: "Edit",
          action: (item) => {
            console.log("Edit item:", item);
            // Implement edit logic
          },
        },
        {
          accessorKey: "toggleStatus",
          title: "Toggle Status",
          action: (item) => {
            handleToggleStatus(item._id);
          },
        },
        {
          accessorKey: "onDelete",
          title: "Delete",
          action: (item) => {
            handleDeleteStaff(item._id);
          },
        },
      ],
    },
    setSortData,
    sortData
  );

  const filterableColumns = [
    {
      id: "name",
      title: "Full Name",
      isStringFilter: true,
    },
    {
      id: "is_active",
      title: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ];

  return (
    <div className="bg-white border-2 border-dashed rounded-xl mx-auto mt-10 p-5">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Staff table</h1>
        <CreateUserForm />
      </div>
      <div className="border-2 border-dashed my-2" />
      <DataTable
        columns={columns}
        data={data}
        filterableColumns={filterableColumns}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        sortData={sortData}
        setSortData={setSortData}
        stringFilterDebauced={stringFilterDebauced}
        setStringFilterDebauced={setStringFilterDebauced}
        
      />
      <TablePagination
        data={paginationData}
        getCallBack={setPaginationData}
        numberOfSelectedRows={selectedRows.size}
      />
    </div>
  );
}
