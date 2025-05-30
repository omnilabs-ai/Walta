"use client"

import * as React from "react"
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
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
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
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export const schema = z.object({
  transaction_list: z.array(z.any()), // or a more specific schema if needed
  agent_id: z.string(),
  agent_name: z.string(),
  apiKey: z.string(),
  active: z.boolean(),
  created_at: z.any(),
})

async function updateAgent({
  userId,
  agentId,
  updatedFields,
}: {
  userId: string
  agentId: string
  updatedFields: Partial<z.infer<typeof schema>>
}) {
  try {
    const res = await fetch("/api/agents/updateAgent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        agentId,
        updatedFields,
      }),
    });

    const json = await res.json()

    if (!res.ok) {
      toast.error("Update failed: " + json.error)
      return false
    }

    toast.success("Agent updated successfully!")
    return true
  } catch (err) {
    console.error("Error updating agent:", err)
    toast.error("Unexpected error updating agent")
    return false
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


function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
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


interface AgentDataTableProps {
  data: z.infer<typeof schema>[]; // only the data prop now
}

export function AgentDataTable({ data }: AgentDataTableProps) {
  const [localData, setLocalData] = React.useState<z.infer<typeof schema>[]>(data);

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
    { id: "created_at", desc: true },
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

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
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
      accessorKey: "agent_name",
      header: "Agent Name",
      cell: ({ row }) => {
        return (
          <AgentEditorDrawer
            item={row.original}
            triggerFromName={true}
          />
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "api_key",
      header: "API Key",
      cell: ({ row }) => {
        const apiKey: string = row.original.apiKey;
        const visiblePart = apiKey.startsWith("walta-")
          ? "walta-" + "••••••••"
          : "••••••••";

        const handleCopy = () => {
          navigator.clipboard.writeText(apiKey).then(() => {
            toast.success("API key copied to clipboard");
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
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          className={`px-2 ${row.original.active
            ? "bg-green-200 text-green-800 hover:bg-green-200"
            : "bg-red-200 text-red-800 hover:bg-red-200"
            }`}
        >
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "transaction_list",
      header: "Transactions",
      cell: ({ row }) => (
        <div>{row.original.transaction_list.length}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionCell row={row} />,
    }
  ]

  const table = useReactTable({
    data: localData,
    columns,
    state: { sorting, pagination, rowSelection, columnFilters, columnVisibility },
    getRowId: (row) => row.agent_id,
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

    console.log("Drag end:", { active, over });

    if (active && over && active.id !== over.id) {
      setLocalData((prevData) => {
        const oldIndex = prevData.findIndex(item => item.agent_id === active.id);
        const newIndex = prevData.findIndex(item => item.agent_id === over.id);

        console.log("Indices:", { oldIndex, newIndex });

        if (oldIndex === -1 || newIndex === -1) {
          console.error("Could not find indices for drag items");
          return prevData;
        }

        const newData = arrayMove(prevData, oldIndex, newIndex);
        console.log("Data after move:", newData.map(d => d.agent_name));
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
          <CreateAgentDialog />
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

function AgentEditorDrawer({
  item,
  triggerFromName,
  triggerRef,
}: {
  item: z.infer<typeof schema>;
  triggerFromName?: boolean;
  triggerRef?: React.RefObject<() => void>;
}) {
  const isMobile = useIsMobile()
  const currentUser = useAtomValue(currentUserAtom)
  const [open, setOpen] = React.useState(false)
  const [agentName, setAgentName] = React.useState(item.agent_name)
  const [status, setStatus] = React.useState(item.active ? "active" : "inactive")

  const handleSubmit = async () => {
    if (!currentUser) return

    const updatedFields = {
      agent_name: agentName,
      active: status === "active",
    }

    const success = await updateAgent({
      userId: currentUser.uid,
      agentId: item.agent_id,
      updatedFields,
    })

    if (success) {
      toast.success("Agent updated.");
      setOpen(false);
    }
  }

  // Expose drawer control via ref for dropdown trigger
  React.useEffect(() => {
    if (triggerRef) {
      triggerRef.current = () => setOpen(true)
    }
  }, [triggerRef])

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      {triggerFromName && (
        <DrawerTrigger asChild>
          <Button variant="link" className="text-foreground w-fit px-0 text-left">
            {item.agent_name}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.agent_name}</DrawerTitle>
          <DrawerDescription>Agent configuration and API info</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <div className="flex flex-col gap-3">
              <Label htmlFor="agent_name">Agent Name</Label>
              <Input
                id="agent_name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="api_key">API Key</Label>
              <Input id="api_key" value={item.apiKey} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="active">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="active" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Transaction List</Label>
              <Textarea
                readOnly
                value={
                  item.transaction_list.length > 0
                    ? JSON.stringify(item.transaction_list, null, 2)
                    : "No transactions"
                }
                className="h-32"
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
  )
}

function DeleteAgentDialog({
  item,
  children,
}: {
  item: z.infer<typeof schema>;
  children: React.ReactNode;
}) {
  const currentUser = useAtomValue(currentUserAtom)
  const [open, setOpen] = React.useState(false)
  const [confirmInput, setConfirmInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const handleDelete = async () => {
    if (!currentUser) return
    setLoading(true)

    try {
      const res = await fetch("/api/agents/deleteAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          agentId: item.agent_id,
        }),
      });

      const json = await res.json()
      if (!res.ok) {
        toast.error("Failed to delete agent: " + json.error)
        return
      }

      if (res.ok) {
        toast.success("Agent deleted successfully");
        setOpen(false);
      }
    } catch (err) {
      console.error("Delete agent error:", err)
      toast.error("Unexpected error deleting agent")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer px-2 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-sm"
      >
        Delete
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              This will permanently remove <strong>{item.agent_name}</strong>.
              <br />
              Type the agent name below to confirm:
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Enter agent name"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="destructive"
              disabled={confirmInput !== item.agent_name || loading}
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
      {children}
    </>
  )
}

function CreateAgentDialog() {
  const currentUser = useAtomValue(currentUserAtom);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleCreate = async () => {
    if (!currentUser || !name.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/agents/createAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.uid,
          agent_name: name.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error("Failed to create agent: " + json.error);
        return;
      }

      toast.success("Agent created!");
      setOpen(false);
      setName("");
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error creating agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlus />
          <span className="hidden lg:inline">Create Agent API Key</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Enter a name for your new agent. The API key will be generated automatically.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Agent name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
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

function ActionCell({ row }: { row: Row<z.infer<typeof schema>> }) {
  const ref = React.useRef<() => void>(() => { })
  const item = row.original

  return (
    <>
      <AgentEditorDrawer
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
          <DropdownMenuItem onClick={() => ref.current?.()}>Edit</DropdownMenuItem>
          <DeleteAgentDialog
            item={item}
          >
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DeleteAgentDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
