"use client"
import { useState, useEffect } from 'react';
import { deletePromotion, toggleActiveStatus } from '@/actions/promotionActions';
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/columns";
import { TablePagination } from "@/components/data-table/table-pagination";
import { ActionRenderers, RowSelectionState, TablePaginationProps } from "@next-server-actions/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CreatePromotionForm } from '@/components/forms/staff/create-promotion-form';
import { useToast } from "@/lib/custom-hooks";
import { Promotion } from '@/schemas/promotionSchema';



const PromotionManagementPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
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
      const url = `/api/promotion?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${filterQuery ? "&" + filterQuery : ""}`;
      const res = await fetch(url, { cache: 'no-store' });
      const rawData = await res.json();
      const promotionData = {
        ...rawData,
        sortBy,
        sortOrder,
        data: rawData.data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          start_date: new Date(item.start_date),
          end_date: new Date(item.end_date),
        })),
      };
      const { data, ...pagination } = promotionData;
      setPaginationData(pagination);
      setPromotions(promotionData.data);
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
    fetchData({ name: stringFilterDebauced }, 1, paginationData.limit, sortBy, sortOrder);
  }, [sortData, paginationData.limit, stringFilterDebauced]);

  useEffect(() => {
    const { sortBy, sortOrder } = sortData || { sortBy: "createdAt", sortOrder: "desc" };
    fetchData({ name: stringFilterDebauced }, paginationData.page, paginationData.limit, sortBy, sortOrder);
  }, [paginationData.page]);

  useEffect(() => {
    if (promotions.length > 0) {
      promotions.map((item: Promotion, index) => {
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
  }, [promotions, selectedRows]);

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

  const handleDeletePromotion = async (promotionId: string) => {
    const result = await deletePromotion(promotionId);
    if (result) {
      setPromotions(promotions.filter((i) => i._id !== promotionId));
      setSelectedRows((prev) => {
        prev.delete(promotionId);
        return new Set(prev);
      });
      useToast("Promotion deleted successfully!");
    } else {
      useToast("Failed to delete promotion.");
    }
  };
  const handleToggleStatus = async (promotionId: string) => {
    const result = await toggleActiveStatus(promotionId);
    if (result.success) {
      setPromotions(
        promotions.map((promotion) =>
          promotion._id === promotionId ? { ...promotion, is_active: !promotion.is_active } : promotion
        )
      );
      useToast("Promotion status updated successfully!");
    } else {
      useToast("Failed to update promotion status.");
    }
  };

  const handleToggleMultipleStatus = async (promotionIds: string[]) => {
    const togglePromises = promotionIds.map(async (promotionId) => {
      return await toggleActiveStatus(promotionId);
    });
    const results = await Promise.all(togglePromises);

    const successfulToggles = results.filter((result) => result.success);
    const failedToggles = results.filter((result) => !result.success);

    if (successfulToggles.length > 0) {
      setPromotions(
        promotions.map((promotion) => {
          if (promotionIds.includes(promotion._id.toString())) {
            return { ...promotion, is_active: !promotion.is_active }; // Assuming all toggled are meant to be flipped
          }
          return promotion;
        })
      );
      useToast(
        successfulToggles.length > 1
          ? `Successfully toggled status for ${successfulToggles.length} promotion members!`
          : "Successfully toggled promotion status!"
      );
    }

    if (failedToggles.length > 0) {
      useToast(`Failed to toggle status for ${failedToggles.length} promotion members.`);
    }
  };

  const handleDeleteMultiplePromotion = async (promotionIds: string[]) => {
    setPromotions(promotions.filter((item) => !promotionIds.includes(item._id.toString())));
    promotionIds.forEach((id) =>
      setSelectedRows((prev) => {
        prev.delete(id);
        return new Set(prev);
      })
    );
  };
  const columns = createColumns<Promotion>(
    [
      {
        accessorKey: "_id",
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            className="-translate-x-4"
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
            className="translate-x-4"
            checked={selectedRows.has(row.original._id)}
            onCheckedChange={(value) => {
              handleRowSelectionChange(row.original._id, !!value);
            }}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        enableSorting: true,
      },
      {
        accessorKey: "discount_value",
        header: "Discount Value",
        enableSorting: true,
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        cell: (info: { getValue: () => Date }) => info.getValue().toLocaleDateString(),
        enableSorting: true,
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        cell: (info: { getValue: () => Date }) => info.getValue().toLocaleDateString(),
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
          action: (items: Promotion[]) => {
            const itemsId = items.map((item) => item._id.toString());
            handleToggleMultipleStatus(itemsId);
          },
        },
        {
          accessorKey: "onDelete",
          title: "Delete items",
          resetSelectedRows: true,
          action: (items: Promotion[]) => {
            const itemsId = items.map((item) => item._id.toString());
            handleDeleteMultiplePromotion(itemsId);
          },
        },
      ],
      cellRenderers: (): ActionRenderers<Promotion>[]=>[
        {
          accessorKey: "toggleStatus",
          title: "Toggle Status",
          action: (item) => {
            handleToggleStatus(item._id.toString());
          },
        },
        {
          accessorKey: "onDelete",
          title: "Delete",
          action: (item) => handleDeletePromotion(item._id.toString()),
        },
      ],
    },
    setSortData,
    sortData
  );
  const filterableColumns = [
    {
      id: "name",
      title: "Name",
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
        <h1 className="text-4xl font-bold">Promotion table</h1>
        <CreatePromotionForm />
      </div>
      <div className="border-2 border-dashed my-2" />
      <DataTable
        columns={columns}
        data={promotions}
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
};

export default PromotionManagementPage;
