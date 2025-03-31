"use client";

import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { createColumns } from "@/components/data-table/columns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TablePagination } from "@/components/data-table/table-pagination";
import { ActionRenderers, RowSelectionState, TablePaginationProps } from "@next-server-actions/types";
import { useToast } from "@/lib/custom-hooks";
import { Selection } from "@next-server-actions/types";
import { Order } from "@/schemas/orderSchema";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect, useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams and useRouter

export default function ExampleTablePage() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Initialize useSearchParams
    const [data, setData] = useState<Order[]>([]);
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
    const [stringFilterDebauced, setStringFilterDebauced] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("all");
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const [cancelReason, setCancelReason] = useState<string>("");
    // Define tab IDs, labels, and corresponding status values
    const tabStatusMap = {
        all: { label: "Tất cả", status: [] },
        pending: { label: "Chờ thanh toán", status: ["pending"] },
        processing: { label: "Đang xử lý", status: ["processing"] },
        delivering: { label: "Đang giao hàng", status: ["delivering"] },
        completed: { label: "Đã hoàn thành", status: ["completed"] },
        cancelled: { label: "Đã hủy", status: ["cancelled"] },
        refunded: { label: "Hoàn tiền", status: ["refunded"] },
    };
    const statusMap = {
        pending: { label: "Chờ thanh toán", color: "bg-yellow-500" },
        processing: { label: "Đang xử lý", color: "bg-blue-500" },
        delivering: { label: "Đang giao hàng", color: "bg-purple-500" },
        completed: { label: "Đã hoàn thành", color: "bg-green-500" },
        cancelled: { label: "Đã hủy", color: "bg-red-500" },
        refunded: { label: "Đã hoàn tiền", color: "bg-gray-500" },
    };
    // Get the current tab from the URL
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && tabStatusMap[tab as keyof typeof tabStatusMap]) {
            setActiveTab(tab);
        } else {
            setActiveTab("all"); // Default to "all" if the tab is invalid
        }
    }, [searchParams]);

    // Update the URL when the active tab changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", activeTab);
        router.push(`/staff/order-management?${params.toString()}`);
    }, [activeTab, router, searchParams]);


    const fetchData = async (
        filters: any = {},
        page: number = 1,
        limit: number = 5,
        sortBy: string = "createdAt",
        sortOrder: string = "desc"
    ) => {
        try {
            const filterQueryParts: string[] = [];
            for (const key in filters) {
                if (filters.hasOwnProperty(key)) {
                    const value = filters[key];
                    if (typeof value === 'object' && value !== null && value.hasOwnProperty('$in')) {
                        // Handle $in operator
                        filterQueryParts.push(`${key}=${value.$in.join(',')}`);
                    } else {
                        // Handle other filters
                        filterQueryParts.push(`${key}=${value}`);
                    }
                }
            }
            const filterQuery = filterQueryParts.join('&');

            const response = await fetch(`/api/order?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}${filterQuery ? "&" + filterQuery : ""}`);
            const rawData = await response.json();
            const orderData = {
                ...rawData,
                sortBy,
                sortOrder,
                data: rawData.data.map((item: any) => ({
                    ...item,
                    order_date: new Date(item.order_date),
                    createdAt: new Date(item.createdAt),
                    updatedAt: new Date(item.updatedAt),
                })),
            };
            const { data, ...pagination } = orderData;
            setPaginationData(pagination);
            setData(orderData.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        const { sortBy, sortOrder } = sortData || { sortBy: "createdAt", sortOrder: "desc" };
        setPaginationData((prev) => ({ ...prev, page: 1 }));
        const statusFilter = tabStatusMap[activeTab as keyof typeof tabStatusMap].status.length > 0 ? { status: { $in: tabStatusMap[activeTab as keyof typeof tabStatusMap].status } } : {};
        fetchData({ name: stringFilterDebauced, ...statusFilter }, 1, paginationData.limit, sortBy, sortOrder);
    }, [sortData, paginationData.limit, stringFilterDebauced, activeTab]);

    useEffect(() => {
        const { sortBy, sortOrder } = sortData || { sortBy: "createdAt", sortOrder: "desc" };
        const statusFilter = tabStatusMap[activeTab as keyof typeof tabStatusMap].status.length > 0 ? { status: { $in: tabStatusMap[activeTab as keyof typeof tabStatusMap].status } } : {};
        fetchData({ name: stringFilterDebauced, ...statusFilter }, paginationData.page, paginationData.limit, sortBy, sortOrder);
    }, [paginationData.page]);

    useEffect(() => {
        if (data.length > 0) {
            data.map((item: Order, index) => {
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

    // useEffect(() => {fetchCategoryData()},[category,data])



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

    const handleDeleteProduct = async (orderId: string) => {
    };
    const handleToggleStatus = async (orderId: string, newStatus?: string, reason?: string) => {
        try {
            const response = await fetch(`/api/order?_id=${orderId}`, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus, canceled_reason: reason }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh data after successful update
            const statusFilter = tabStatusMap[activeTab as keyof typeof tabStatusMap].status.length > 0 ? { status: { $in: tabStatusMap[activeTab as keyof typeof tabStatusMap].status } } : {};
            await fetchData({ name: stringFilterDebauced, ...statusFilter }, paginationData.page, paginationData.limit, sortData?.sortBy, sortData?.sortOrder);
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleToggleMultipleStatus = async (orderIds: string[]) => {
    };

    const handleDeleteMultipleProduct = async (orderIds: string[]) => {
    };

    const handleCancelOrder = async () => {
        if (currentOrderId && cancelReason) {
            await handleToggleStatus(currentOrderId, "cancelled", cancelReason);
            setOpenCancelDialog(false);
            setCancelReason("");
            setCurrentOrderId(null);
        }
    };
    const actionCell = useCallback((row: Order): ActionRenderers<Order>[] => {
        const { status, _id } = row;
        const actions: ActionRenderers<Order>[] = [];
        if (status === "processing" || status === "delivering" || status === "pending") {
            actions.push({
                accessorKey: "toggleStatusToCanceled",
                title: "Hủy đơn hàng",
                action: (item) => {
                    setCurrentOrderId(item._id.toString());
                    setOpenCancelDialog(true);
                },
            });

        }
        if (status === "processing") {
            actions.push({
                accessorKey: "toggleStatusToDelivering",
                title: "Chuyển sang Đang giao hàng",
                action: (item) => {
                    handleToggleStatus(item._id.toString(), "delivering");
                },
            });
        } else if (status === "delivering") {
            actions.push({
                accessorKey: "toggleStatusToCompleted",
                title: "Chuyển sang Đã hoàn thành",
                action: (item) => {
                    handleToggleStatus(item._id.toString(), "completed");
                },
            });
        } else if (status === "pending") {
            actions.push({
                accessorKey: "toggleStatusToProcessing",
                title: "Chuyển sang Đang xử lý",
                action: (item) => {
                    handleToggleStatus(item._id.toString(), "processing");
                },
            });
        }

        actions.push({
            accessorKey: "viewInvoice",
            title: "Xem hóa đơn",
            action: (item) => {
                router.push(`/staff/order-management/${item._id.toString()}/invoice`);
            },
        });

        return actions;
    }, [handleToggleStatus, handleDeleteProduct, router]);
    const columns = createColumns<Order>(
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
                accessorKey: "customer_id",
                header: "Mã khách hàng",
                enableSorting: true,
            },
            {
                accessorKey: "order_date",
                header: "Ngày đặt hàng",
                cell: (info: { getValue: () => Date }) => info.getValue().toLocaleDateString(),
                enableSorting: true,
            },
            {
                accessorKey: "total_amount",
                header: "Tổng tiền",
                enableSorting: true,
                cell: ({ row }) => row.original.total_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            },
            {
                accessorKey: "discounted_amount",
                header: "Tiền giảm giá",
                enableSorting: true,
                cell: ({ row }) => row.original.discounted_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            },
            {
                accessorKey: "delivery_amount",
                header: "Tiền giảm giá",
                enableSorting: true,
                cell: ({ row }) => row.original.delivery_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            },
            {
                accessorKey: "promotion_id",
                header: "Mã khuyến mãi",
                enableSorting: true,
                cell: ({ row }) => row.original.promotion_id ? <Badge variant="default">{row.original.promotion_id.toString()}</Badge> : <Badge variant="destructive">none</Badge>
            },
            {
                accessorKey: "final_amount",
                header: "Tổng tiền sau giảm",
                enableSorting: true,
                cell: ({ row }) => row.original.final_amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
            },
            {
                accessorKey: "shippingAddress",
                header: "Địa chỉ giao hàng",
                enableSorting: true,
                cell: ({ row }) => row.original.shippingAddress.detail
            },
            {
                accessorKey: "status",
                header: "Trạng thái",
                enableSorting: true,
                cell: ({ row }) => <Badge className={statusMap[row.original.status as keyof typeof statusMap].color}> {statusMap[row.original.status as keyof typeof statusMap].label} </Badge>
            },
            {
                accessorKey: "payment_method",
                header: "Phương thức thanh toán",
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
                    action: (items: Order[]) => {
                        const itemsId = items.map((item) => item._id.toString());
                        handleToggleMultipleStatus(itemsId);
                    },
                },
                {
                    accessorKey: "onDelete",
                    title: "Delete items",
                    resetSelectedRows: true,
                    action: (items: Order[]) => {
                        const itemsId = items.map((item) => item._id.toString());
                        handleDeleteMultipleProduct(itemsId);
                    },
                },
            ],
            cellRenderers: actionCell,
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
    ];

    return (
        <div className="bg-white border-2 border-dashed rounded-xl mx-auto mt-10 p-5">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">Order table</h1>
            </div>
            <div className="border-2 border-dashed my-2" />
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-7 w-full">
                    {Object.entries(tabStatusMap).map(([tabId, tabData]) => (
                        <TabsTrigger key={tabId} value={tabId}>
                            {tabData.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={activeTab}>
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
                </TabsContent>
            </Tabs>
            <Dialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Hủy đơn hàng</DialogTitle>
                        <DialogDescription>
                            Vui lòng nhập lý do hủy đơn hàng.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        type="text"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Nhập lý do hủy đơn hàng"
                    />
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setOpenCancelDialog(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" onClick={handleCancelOrder}>
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
