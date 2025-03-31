"use client"

import React from "react"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnConfig, ActionColumnConfig, ActionRenderers } from "@next-server-actions/types"



export function createColumns<T extends object>(
  config: ColumnConfig<T>[],
  actions?: ActionColumnConfig<T>,
  setSortData?: React.Dispatch<React.SetStateAction<{ sortBy: string, sortOrder: string } | null>>,
  SortData?: { sortBy: string; sortOrder: string } | null
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = config.map((col) => ({
    accessorKey: col.accessorKey,
    header: (info) => {
      const handleSort = () => {
        if (col.enableSorting !== false) {
          const isAsc = SortData?.sortOrder === "asc";
          const isDesc = SortData?.sortOrder === "desc";

          let newSortOrder: string;

          if (isAsc) {
            newSortOrder = "desc";
          } else if (isDesc) {
            newSortOrder = "default";
          }
          else{
            newSortOrder = "asc"
          }

          if (newSortOrder === 'default') {
            setSortData && setSortData(null);
          }
          else{
            const newSortBy = col.accessorKey as string;
          setSortData && setSortData({sortBy:newSortBy,sortOrder:newSortOrder});
          }
        }
      }
      return (
        <div
          className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground ${col.enableSorting == false ? 'translate-x-4' : ''}`}
          onClick={handleSort}
        >
          {typeof col.header === "function" ? col.header(info) : col.header}
          {col.enableSorting == false ? null : <ArrowUpDown className="ml-2 h-4 w-4" />}
        </div>
      )
    },
    cell: col.cell ? col.cell : ({ row }) => <div className="inline-flex items-center justify-center">{(row.getValue(col.accessorKey as string))}</div>,
  }))

  if (actions) {
    columns.push({
      id: "actions",
      header: ({ table }) => {
        const items = table.getSelectedRowModel().rows.map((row) => row.original)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={items.length == 0}>
              <Button variant="ghost" className="h-8 w-8 p-0 -translate-x-4">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {actions.header && actions.header.map(
                (cell, index) => (
                  <div key={index}>
                    <DropdownMenuItem onClick={() => {
                      cell.action(items)
                      cell.resetSelectedRows && table.toggleAllRowsSelected(false)
                    }}>
                      {cell.title}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      cell: ({ row }) => {
        const item = row.original
        // Ensure actions.cellRenderers is an array of functions
        const cellRenderers = actions.cellRenderers;
        if (typeof cellRenderers === 'function') {
          const actionRenderers: ActionRenderers<T>[] = cellRenderers(item);
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {actionRenderers.map((cell, index) => (
                  <div key={index}>
                    <DropdownMenuItem onClick={() => cell.action(item)}>{cell.title}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        return null;
      },
    })
  }

  return columns
}
