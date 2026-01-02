import { useState } from "react";

import { LinkCreateForm } from "@/components/link-create-form";
import { LinkEditForm } from "@/components/link-edit-form";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    Copy,
    ExternalLink,
    MoreHorizontal,
    PlusIcon,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Sample data - will be replaced with real data from Supabase
const sampleData: LinkTable[] = [
    {
        id: "1",
        user_id: "user-1",
        alias: "abc123",
        original_url: "https://example.com/very-long-url-that-needs-shortening",
        visit_count: 156,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
    },
    {
        id: "2",
        user_id: "user-1",
        alias: "xyz789",
        original_url: "https://github.com/user/repository",
        visit_count: 42,
        created_at: "2026-01-02",
        updated_at: "2026-01-02",
    },
    {
        id: "3",
        user_id: "user-1",
        alias: "qwe456",
        original_url: "https://docs.google.com/document/d/example",
        visit_count: 0,
        created_at: "2026-01-02",
        updated_at: "2026-01-02",
    },
];

const columns: ColumnDef<LinkTable>[] = [
    {
        accessorKey: "alias",
        header: "Short Link",
        cell: ({ row }) => {
            const alias = row.getValue("alias") as string;
            const fullUrl = `${window.location.origin}/${alias}`;

            return (
                <div className="flex items-center gap-2">
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                        /{alias}
                    </code>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                            navigator.clipboard.writeText(fullUrl);
                            toast.success("Link copied to clipboard");
                        }}
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "original_url",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Original URL
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const url = row.getValue("original_url") as string;
            return (
                <div className="flex max-w-[300px] items-center gap-2">
                    <span className="truncate text-sm" title={url}>
                        {url}
                    </span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            );
        },
    },
    {
        accessorKey: "visit_count",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Visits
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => {
            const visitCount = row.getValue("visit_count") as number;
            return <div className="text-center font-medium">{visitCount}</div>;
        },
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => {
            const date = row.getValue("created_at") as string;
            return <div className="text-muted-foreground text-sm">{date}</div>;
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const link = row.original;
            const fullUrl = `${window.location.origin}/${link.alias}`;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(fullUrl);
                                toast.success("Link copied to clipboard");
                            }}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => window.open(fullUrl, "_blank")}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

// Helper to get columns with edit handler
function getColumns(onEdit: (link: LinkTable) => void): ColumnDef<LinkTable>[] {
    return columns.map((col) => {
        if (col.id === "actions") {
            return {
                ...col,
                cell: ({ row }) => {
                    const link = row.original;
                    const fullUrl = `${window.location.origin}/${link.alias}`;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        navigator.clipboard.writeText(fullUrl);
                                        toast.success(
                                            "Link copied to clipboard",
                                        );
                                    }}
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        window.open(fullUrl, "_blank")
                                    }
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onEdit(link)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            };
        }
        return col;
    });
}

function LinkIndexView() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [editingLink, setEditingLink] = useState<LinkTable | null>(null);

    const tableColumns = getColumns((link) => setEditingLink(link));

    const table = useReactTable({
        data: sampleData,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Links</h1>
                    <p className="text-muted-foreground">
                        Manage your shortened links
                    </p>
                </div>
                <LinkCreateForm
                    trigger={
                        <Button>
                            <PlusIcon />
                            Create Link
                        </Button>
                    }
                />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
                <Input
                    placeholder="Search by URL..."
                    value={
                        (table
                            .getColumn("original_url")
                            ?.getFilterValue() as string) ?? ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("original_url")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No links yet. Create your first short link!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredRowModel().rows.length} link(s) total
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Edit Form Modal */}
            {editingLink && (
                <LinkEditForm
                    link={editingLink}
                    open={!!editingLink}
                    onOpenChange={(open) => !open && setEditingLink(null)}
                />
            )}
        </div>
    );
}

export { LinkIndexView };
