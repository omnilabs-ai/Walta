"use client"


import * as React from "react"
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
    MeasuringStrategy,
    type DragEndEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconGripVertical,
    IconLayoutColumns,
    IconClipboardCopy
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs"
import { transactionSchema } from "@/app/atoms/settings"


// Create a separate component for the drag handle
function DragHandle({ id }: { id: UniqueIdentifier }) {
    const { attributes, listeners } = useSortable({
        id,
    });


    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
            type="button"
        >
            <IconGripVertical className="text-muted-foreground size-3" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}


function DraggableRow({ row }: { row: Row<z.infer<typeof transactionSchema>> }) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: row.id });


    return (
        <TableRow
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
            }}
            {...attributes}
        >
            {row.getVisibleCells().map((cell, cellIndex) => (
                <TableCell
                    key={cell.id}
                    {...(cellIndex === 0 ? listeners : {})}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}


interface TransactionDataTableProps {
    data: z.infer<typeof transactionSchema>[]; // only the data prop now
}


export function TransactionDataTable({ data }: TransactionDataTableProps) {
    const [localData, setLocalData] = React.useState<z.infer<typeof transactionSchema>[]>(data);


    React.useEffect(() => {
        setLocalData(data);
    }, [data]);
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "timestamp", desc: true },
    ])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )

    const columns: ColumnDef<z.infer<typeof transactionSchema>>[] = [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.id} />,
        },
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "timestamp",
            header: "Created At",
            cell: ({ row }) => {
                console.log(row.original);
                const createdAtRaw = row.original.timestamp;
                let date: Date | null = null;

                if (createdAtRaw) {
                    date = new Date(createdAtRaw);
                }

                return (
                    <span>
                        {date && !isNaN(date.getTime())
                            ? date.toLocaleDateString()
                            : "No date"}
                    </span>
                );
            }
        },
        {
            accessorKey: "id",
            header: "Transaction ID",
            cell: ({ row }) => {
                const transactionId = row.original.id || "";
                const visiblePart = transactionId.length > 8
                    ? transactionId.substring(0, 8) + "•••"
                    : transactionId;

                const handleCopy = () => {
                    navigator.clipboard.writeText(transactionId).then(() => {
                        toast.success("Transaction ID copied to clipboard");
                    });
                };

                return (
                    <div className="flex items-center gap-1 w-32 truncate">
                        <Badge variant="outline" className="text-muted-foreground px-1.5">
                            {visiblePart}
                        </Badge>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-1"
                            onClick={handleCopy}
                        >
                            <IconClipboardCopy className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "agent_id",
            header: "Agent ID",
            cell: ({ row }) => {
                const agentID: string = row.original.agent_id;
                const visiblePart = agentID.length > 6
                    ? agentID.substring(0, 6) + "•••••••"
                    : agentID;

                const handleCopy = () => {
                    navigator.clipboard.writeText(agentID).then(() => {
                        toast.success("Agent ID copied to clipboard");
                    });
                };

                return (
                    <div className="flex items-center gap-1 w-32 truncate">
                        <Badge variant="outline" className="text-muted-foreground px-1.5">
                            {visiblePart}
                        </Badge>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-1"
                            onClick={handleCopy}
                        >
                            <IconClipboardCopy className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                );
            },
        },
        {
            accessorKey: "amount_cents",
            header: "Amount",
            cell: ({ row }) => {
                const amount = row.original.amount_cents;
                const formattedAmount = (amount / 100).toFixed(2);
                return (
                    <span className="font-medium">
                        ${formattedAmount}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    className={`px-2 ${row.original.status.toLowerCase() === "success"
                        ? "bg-green-200 text-green-800 hover:bg-green-200"
                        : row.original.status.toLowerCase() === "pending"
                            ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-200"
                            : "bg-red-200 text-red-800 hover:bg-red-200"
                        }`}
                >
                    {row.original.status}
                </Badge>
            ),
        },
        {
            accessorKey: "product_id",
            header: "Product ID",
            cell: ({ row }) => {
                const productId = row.original.product_id;
                const visiblePart = productId.length > 8
                    ? productId.substring(0, 8) + "••••"
                    : productId;

                return (
                    <Badge variant="secondary" className="text-muted-foreground px-1.5">
                        {visiblePart}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "metadata",
            header: "Metadata",
            cell: ({ row }) => (
                <div className="truncate max-w-[200px]">
                    {Object.keys(row.original.metadata || {}).length > 0
                        ? JSON.stringify(row.original.metadata)
                        : "No metadata"}
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data: localData,
        columns,
        state: { sorting, pagination, rowSelection, columnFilters, columnVisibility },
        getRowId: (row) => row.id || Math.random().toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setLocalData((prevData) => {
                const oldIndex = prevData.findIndex(item => (item.id || Math.random().toString()) === active.id);
                const newIndex = prevData.findIndex(item => (item.id || Math.random().toString()) === over.id);

                if (oldIndex === -1 || newIndex === -1) {
                    console.error("Could not find indices for drag items");
                    return prevData;
                }

                const newData = arrayMove(prevData, oldIndex, newIndex);
                return newData;
            });
        }
    }

    return (
        <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        measuring={{
                            droppable: {
                                strategy: MeasuringStrategy.Always
                            }
                        }}
                    >
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={table.getRowModel().rows.map(row => row.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent
                value="past-performance"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent
                value="focus-documents"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
}
