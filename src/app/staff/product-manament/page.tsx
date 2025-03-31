"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/columns";
import { Badge } from "@/components/ui/badge";;
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "@/components/data-table/table-pagination";
import { RowSelectionState, TablePaginationProps } from "@next-server-actions/types";
import { useToast } from "@/lib/custom-hooks"
import { Product } from "@/schemas/productSchema"
import { deleteProduct, toggleActiveStatus } from "@/actions/productActions";
import { CreateProductForm } from "@/components/forms/staff/createProductForm";
export default function ExampleTablePage() {
    const [data, setData] = useState<Product[]>([]);
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
            const url = `/api/product?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${filterQuery ? "&" + filterQuery : ""}`;
            const res = await fetch(url);
            const rawData = await res.json();
            const productData = {
                ...rawData,
                sortBy,
                sortOrder,
                data: rawData.data.map((item: any) => ({
                    ...item,
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                })),
            };
            const { data, ...pagination } = productData;
            setPaginationData(pagination);
            setData(productData.data);
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
        if (data.length > 0) {
            data.map((item: Product, index) => {
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

    const handleDeleteProduct = async (productId: string) => {
        const result = await deleteProduct(productId);
        if (result.success) {
            setData(data.filter((i) => i._id !== productId));
            setSelectedRows((prev) => {
                prev.delete(productId);
                return new Set(prev);
            });
            useToast("Product deleted successfully!");
        } else {
            useToast("Failed to delete product.");
        }
    };
    const handleToggleStatus = async (productId: string) => {
        const result = await toggleActiveStatus(productId);
        if (result.success) {
            setData(
                data.map((product) =>
                    product._id === productId ? { ...product, is_active: !product.is_active } : product
                )
            );
            useToast("Product status updated successfully!");
        } else {
            useToast("Failed to update product status.");
        }
    };

    const handleToggleMultipleStatus = async (productIds: string[]) => {
        const togglePromises = productIds.map(async (productId) => {
            return await toggleActiveStatus(productId);
        });
        const results = await Promise.all(togglePromises);

        const successfulToggles = results.filter((result) => result.success);
        const failedToggles = results.filter((result) => !result.success);

        if (successfulToggles.length > 0) {
            setData(
                data.map((product) => {
                    if (productIds.includes(product._id.toString())) {
                        return { ...product, is_active: !product.is_active }; // Assuming all toggled are meant to be flipped
                    }
                    return product;
                })
            );
            useToast(
                successfulToggles.length > 1
                    ? `Successfully toggled status for ${successfulToggles.length} product members!`
                    : "Successfully toggled product status!"
            );
        }

        if (failedToggles.length > 0) {
            useToast(`Failed to toggle status for ${failedToggles.length} product members.`);
        }
    };

    const handleDeleteMultipleProduct = async (productIds: string[]) => {
        const deletePromises = productIds.map(async (productId) => {
            return await deleteProduct(productId);
        });
        const results = await Promise.all(deletePromises);

        const successfulDeletions = results.filter((result) => result.success);
        const failedDeletions = results.filter((result) => !result.success);

        if (successfulDeletions.length > 0) {
            setData(data.filter((item) => !productIds.includes(item._id.toString())));
            productIds.forEach((id) =>
                setSelectedRows((prev) => {
                    prev.delete(id);
                    return new Set(prev);
                })
            );
            useToast(
                successfulDeletions.length > 1
                    ? `Successfully deleted ${successfulDeletions.length} product members!`
                    : "Successfully deleted product member!"
            );
        }

        if (failedDeletions.length > 0) {
            useToast(`Failed to delete ${failedDeletions.length} product members.`);
        }
    };
    const columns = createColumns<Product>(
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
                accessorKey: "price",
                header: "price",
                enableSorting: true,
            },
            {
                accessorKey: "quantity",
                header: "quantity",
                enableSorting: true,
            },
            {
                accessorKey: "category_id",
                header: "Category",
                enableSorting: true,
            },
            {
                accessorKey: "image_url",
                header: "image_url",
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
                    action: (items: Product[]) => {
                        const itemsId = items.map((item) => item._id.toString());
                        handleToggleMultipleStatus(itemsId);
                    },
                },
                {
                    accessorKey: "onDelete",
                    title: "Delete items",
                    resetSelectedRows: true,
                    action: (items: Product[]) => {
                        const itemsId = items.map((item) => item._id.toString());
                        handleDeleteMultipleProduct(itemsId);
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
                        handleDeleteProduct(item._id);
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
                <h1 className="text-4xl font-bold">Product table</h1>
                <CreateProductForm />
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
