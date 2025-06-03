"use client"

import * as React from "react"
import { useState } from "react"
import { memo, useMemo, useCallback } from 'react';
import { useAtomValue } from "jotai"
import { currentUserAtom } from "@/app/atoms/settings"
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
    MeasuringStrategy,  // Add this import
    type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    SortableContext,
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
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns,
    IconPlus,
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
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { productSchema } from "@/app/atoms/settings"

export async function updateProduct({
    productId,
    updatedFields,
    currentUser,
}: {
    userId: string;
    productId: string;
    updatedFields: Partial<z.infer<typeof productSchema>>;
    currentUser: { api_key: string };
}) {
    try {
        const res = await fetch("/api/products/updateProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser.api_key}`
            },
            body: JSON.stringify({
                product_id: productId,
                update_data: updatedFields,
            }),
        });

        const json = await res.json();

        if (!res.ok) {
            toast.error("Update failed: " + json.error);
            return false;
        }

        toast.success("Product updated successfully!");
        return true;
    } catch (err) {
        console.error("Error updating product:", err);
        toast.error("Unexpected error updating product");
        return false;
    }
}

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


const DraggableRow = memo(function DraggableRow({ row }: { row: Row<z.infer<typeof productSchema>> }) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: row.original.product_id });

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
})


interface ProductDataTableProps {
    data: z.infer<typeof productSchema>[]; // only the data prop now
}

export function ProductDataTable({ data }: ProductDataTableProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "created_at", desc: true },
    ])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const getRowId = useCallback((row: z.infer<typeof productSchema>) => row.product_id, []);

    const columns: ColumnDef<z.infer<typeof productSchema>>[] = useMemo(() => [
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
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => {
                const createdAtRaw = row.original.created_at;
                let date: Date | null = null;

                if (createdAtRaw?.seconds) {
                    date = new Date(createdAtRaw.seconds * 1000);
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
            accessorKey: "name",
            header: "Product Name",
            cell: ({ row }) => {
                return (
                    <ProductEditorDrawer
                        item={row.original}
                        triggerFromName={true}
                    />
                )
            },
            enableHiding: false,
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <div className="capitalize">{row.original.type}</div>
            ),
        },
        {
            accessorKey: "price",
            header: "Price ($)",
            cell: ({ row }) => (
                <div>${row.original.price.toFixed(2)}</div>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => (
                <div className="truncate max-w-[200px]">
                    {row.original.description || "No description"}
                </div>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => <ActionsCell row={row} />,
        }
    ], [])

    const mouseSensor = useSensor(MouseSensor, {});
    const touchSensor = useSensor(TouchSensor, {});
    const keyboardSensor = useSensor(KeyboardSensor, {});

    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    const table = useReactTable({
        data: data,
        columns,
        state: { sorting, pagination, rowSelection, columnFilters, columnVisibility },
        getRowId,
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

    const tableRows = table.getRowModel().rows;

    const rowIds = useMemo(() => {
        return tableRows.map((row) => row.id);
    }, [tableRows]);

    // function handleDragEnd(event: DragEndEvent) {
    //     const { active, over } = event;

    //     console.log("Drag end:", { active, over });

    //     if (active && over && active.id !== over.id) {
    //         setLocalData((prevData) => {
    //             const oldIndex = prevData.findIndex(item => item.product_id === active.id);
    //             const newIndex = prevData.findIndex(item => item.product_id === over.id);

    //             console.log("Indices:", { oldIndex, newIndex });

    //             if (oldIndex === -1 || newIndex === -1) {
    //                 console.error("Could not find indices for drag items");
    //                 return prevData;
    //             }

    //             const newData = arrayMove(prevData, oldIndex, newIndex);
    //             console.log("Data after move:", newData.map(d => d.name));
    //             return newData;
    //         });
    //     }
    // }

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
                    <CreateProductDialog />
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
                                        items={rowIds}
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

function ProductEditorDrawer({
    item,
    triggerFromName,
    triggerRef,
}: {
    item: z.infer<typeof productSchema>;
    triggerFromName?: boolean;
    triggerRef?: React.RefObject<() => void>;
}) {
    const isMobile = useIsMobile();
    const currentUser = useAtomValue(currentUserAtom);
    const [open, setOpen] = React.useState(false);

    const [name, setName] = React.useState(item.name);
    const [description, setDescription] = React.useState(item.description);
    const [type, setType] = React.useState(item.type);
    const [price, setPrice] = React.useState(item.price.toString());

    const handleSubmit = async () => {
        if (!currentUser) return;

        const updatedFields = {
            name,
            description,
            type,
            price: parseFloat(price) || 0, // ensure price is a number
        };

        const success = await updateProduct({
            userId: currentUser.uid,
            productId: item.product_id,
            updatedFields,
            currentUser,
        });

        if (success) {
            toast.success("Product updated.");
            setOpen(false);
        }
    };

    React.useEffect(() => {
        if (triggerRef) {
            triggerRef.current = () => setOpen(true);
        }
    }, [triggerRef]);

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            {triggerFromName && (
                <DrawerTrigger asChild>
                    <Button variant="link" className="text-foreground w-fit px-0 text-left">
                        {item.name}
                    </Button>
                </DrawerTrigger>
            )}
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.name}</DrawerTitle>
                    <DrawerDescription>Edit product details</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="type">Type</Label>
                            <Input
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                inputMode="decimal"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <DrawerFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export function DeleteProductDialog({
    item,
    children,
}: {
    item: z.infer<typeof productSchema>;
    children: React.ReactNode;
}) {
    const currentUser = useAtomValue(currentUserAtom);
    const [open, setOpen] = React.useState(false);
    const [confirmInput, setConfirmInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleDelete = async () => {
        if (!currentUser) return;
        setLoading(true);

        try {
            const res = await fetch("/api/products/deleteProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentUser.api_key}`,
                },
                body: JSON.stringify({
                    product_id: item.product_id,
                }),
            });

            const json = await res.json();
            if (!res.ok) {
                toast.error("Failed to delete product: " + json.error);
                return;
            }

            toast.success("Product deleted successfully");
            setOpen(false);
        } catch (err) {
            console.error("Delete product error:", err);
            toast.error("Unexpected error deleting product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                        This will permanently remove <strong>{item.name}</strong>.
                        <br />
                        Type the product name below to confirm:
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Enter product name"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                />

                <DialogFooter>
                    <Button
                        variant="destructive"
                        disabled={confirmInput !== item.name || loading}
                        onClick={handleDelete}
                    >
                        {loading ? "Deleting..." : "Confirm Delete"}
                    </Button>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}



function CreateProductDialog() {
    const currentUser = useAtomValue(currentUserAtom);
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!currentUser || !name.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/products/createProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${currentUser.api_key}`
                },
                body: JSON.stringify({
                    name: name.trim(),
                    price: parseFloat(price) || 0,
                    description: description.trim(),
                    type: type.trim(),
                    metadata: {}
                }),
            });

            const json = await res.json();
            if (!res.ok) {
                toast.error("Failed to create product: " + json.error);
                return;
            }

            toast.success("Product created!");
            setOpen(false);
            setName("");
            setDescription("");
            setPrice("");
            setType("");
        } catch (err) {
            console.error(err);
            toast.error("Unexpected error creating product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Create Product</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new product.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="type">Type</Label>
                        <Input
                            id="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="Enter product type"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            inputMode="decimal"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleCreate}
                        disabled={loading || !name.trim()}
                    >
                        {loading ? "Creating..." : "Create"}
                    </Button>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ActionsCell({ row }: { row: Row<z.infer<typeof productSchema>> }) {
    const ref = React.useRef<() => void>(() => { });
    const item = row.original;

    return (
        <>
            <ProductEditorDrawer
                item={item}
                triggerRef={ref}
                triggerFromName={false}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 text-muted-foreground">
                        <IconDotsVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => ref.current?.()}>
                        Edit
                    </DropdownMenuItem>
                    <DeleteProductDialog
                        item={item}
                    >
                        <div className="text-red-600 cursor-pointer px-2 py-1.5 text-sm hover:bg-red-100 rounded-sm">
                            Delete
                        </div>
                    </DeleteProductDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

