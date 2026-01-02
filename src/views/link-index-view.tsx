import { useCallback, useEffect, useState } from "react";

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
    EditIcon,
    ExternalLink,
    Loader2,
    MoreHorizontal,
    PlusIcon,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { deleteLink, getLinks } from "@/lib/links";

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
            return (
                <div className="text-muted-foreground text-sm">
                    {new Date(date).toLocaleDateString()}
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: () => null, // Will be overridden by getColumns
    },
];

// Helper to get columns with handlers
function getColumns(
    onEdit: (link: LinkTable) => void,
    onDelete: (link: LinkTable) => void,
): ColumnDef<LinkTable>[] {
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
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => onDelete(link)}
                                >
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
    const [links, setLinks] = useState<LinkTable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [editingLink, setEditingLink] = useState<LinkTable | null>(null);
    const [deletingLink, setDeletingLink] = useState<LinkTable | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchLinks = useCallback(async () => {
        try {
            const data = await getLinks();
            setLinks(data);
        } catch (error) {
            console.error("Failed to fetch links:", error);
            toast.error("Failed to load links");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const handleDelete = async () => {
        if (!deletingLink) return;

        setIsDeleting(true);
        try {
            await deleteLink(deletingLink.id);
            toast.success("Link deleted successfully");
            setLinks((prev) => prev.filter((l) => l.id !== deletingLink.id));
        } catch (error) {
            console.error("Failed to delete link:", error);
            toast.error("Failed to delete link");
        } finally {
            setIsDeleting(false);
            setDeletingLink(null);
        }
    };

    const tableColumns = getColumns(
        (link) => setEditingLink(link),
        (link) => setDeletingLink(link),
    );

    const table = useReactTable({
        data: links,
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
                    onSuccess={(newLink) => {
                        setLinks((prev) => [newLink, ...prev]);
                    }}
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
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
                    onSuccess={(updatedLink) => {
                        setLinks((prev) =>
                            prev.map((l) =>
                                l.id === updatedLink.id ? updatedLink : l,
                            ),
                        );
                    }}
                />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingLink}
                onOpenChange={(open) => !open && setDeletingLink(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Link</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <code className="bg-muted rounded px-1">
                                /{deletingLink?.alias}
                            </code>
                            ? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export { LinkIndexView };
