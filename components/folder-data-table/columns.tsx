import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/store/use-rename-modal";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import ConfirmModel from "../confirm-model";

export const Columns: () => ColumnDef<Doc<"folders">>[] = () => {
    const router = useRouter();
    const { onOpen: openRename } = useRenameModal();

    const { mutate, pending } = useApiMutation(api.file.remove);

    const onDelete = (id: Id<"folders">) => {
        mutate({ id })
            .then(() => toast.success("Folder deleted!"))
            .catch(() => toast.error("Failed to delete"));
    };

    const columns: ColumnDef<Doc<"folders">>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Folder
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const folder = row.original;

                return (
                    <Button
                        variant="link"
                        className=" py-1 flex gap-2 items-center"
                        onClick={() => router.push(`/${folder._id}`)}
                    >
                        {folder.title}
                    </Button>
                );
            },
        },
        {
            id: "file",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Files
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className=" pl-10">{(row.original.files || []).length}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const folder = row.original;

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

                            <DropdownMenuItem
                                onClick={() => onDelete(folder._id)}
                            >
                                <Trash className=" size-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => openRename(folder._id, folder.title)}
                            >
                                <Edit className=" size-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
    return columns;
};