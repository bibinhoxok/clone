import { Customer, CustomerSchema } from "@/schemas/customerSchema";
import { StaffSchema } from "@/schemas/staffSchema";

// Update the DataTableProps type
interface FilterDataTableProps<TData, TValue> {
    table: Table<unknown>
    filterColumn: FilterableColumn[];
    stringFilterDebauced: string
    setStringFilterDebauced: (value) => void
}

// Define the FilterableColumn type
interface BaseFilterableColumn {
    id: string;
    title: string;
}

type FilterableColumn =
    | (BaseFilterableColumn & { isStringFilter: boolean; options?: never })
    | (BaseFilterableColumn & { options: { label: string; value: string }[]; isStringFilter?: never });

interface RowSelectionState {
    [key: string]: boolean;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterableColumns?: FilterableColumn[];
    rowSelection: RowSelectionState
    setRowSelection: (value) => void
    sortData,
    setSortData: (value) => void
    stringFilterDebauced,
    setStringFilterDebauced
}

interface ColumnConfig<T> {
    accessorKey: keyof T
    header: string | ((props: { table: any }) => JSX.Element)
    cell?: (info: accessorKey) => React.ReactNode
    enableSorting?: boolean
}

interface ActionColumnConfig<T> {
    header?: ActionHeader<T>[];
    cellRenderers?: (row: T) => ActionRenderer<T>[];
}
type ActionIdentifier = "onEdit" | "toggleStatus" | "toggleStatusToDelivering" | "toggleStatusToCompleted" | "toggleStatusToProcessing" | "toggleStatusToCanceled" | "onDelete" | "onDelivering"| "viewInvoice";
interface ActionRenderers<T> {
    accessorKey: ActionIdentifier
    title: string,
    action: (item: T) => void
}

interface TablePaginationProps {
    page: number
    limit: number
    totalDocs?: number
    totalPages?: number
}

interface FormState {
    message: string;
    success: boolean;
    formData?: FormData;
}


type Selection = {
    value: string | number;
    label: string;
};

type formField<T> = {
    name: keyof T;
    label: string;
    type: HTMLInputTypeAttribute;
    placeholder?: string;
    selections?: Selection[];
    CreateAction?: CreateAction
};
type ActionReturn = {
    message: string;
    success: boolean;
    formData?: FormData;
}

type CreateAction = (prevState: any, formData: FormData) => Promise<ActionReturn>

type SessionCustomer = z.infer<typeof CustomerSchema.pick<{ name: true; email: true }>>
type AdminSidebarProps = {
    title: string
    href: string
    icon?: any
  }
  
type SessionStaff = z.infer<typeof StaffSchema.pick<{ name: true; email: true, role:true }>>

type PaginationedData<T> = {
    data: T[]
    page: number
    limit: number
    totalPages: number
    totalDocs: number
}