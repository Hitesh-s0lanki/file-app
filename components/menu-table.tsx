"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { FaPlus } from "react-icons/fa";
import { FolderOpen, Pencil, RefreshCcwIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import ConfirmModel from "./confirm-model";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useCreateModal } from "@/store/use-create-modal";
import { useRenameModal } from "@/store/use-rename-modal";

const MenuTable = () => {
  const { onOpen } = useCreateModal();
  const { onOpen: openRename } = useRenameModal();
  const { mutate, pending } = useApiMutation(api.file.remove);
  const folders = useQuery(api.file.listFolders);
  const router = useRouter();

  if (!folders)
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );

  const onDelete = (id: Id<"folders">) => {
    mutate({ id })
      .then(() => toast.success("Board deleetd!"))
      .catch(() => toast.error("Failed to delete"));
  };

  return (
    <Table className="border-2">
      <TableCaption>A list of your recent Repository.</TableCaption>
      <TableHeader className=" bg-slate-100 text-primary-foreground rounded-lg text-lg p-3">
        <TableRow>
          <TableHead className="w-[100px] "></TableHead>
          <TableHead>Folder title</TableHead>
          <TableHead>files</TableHead>
          <TableHead></TableHead>
          <TableHead className="w-1/6">
            <div className="w-full flex justify-end items-end p-1 gap-2 text-primary-foreground">
              <Button
                className=" bg-green-500 text-white flex gap-1"
                size="sm"
                onClick={() => onOpen("untitled")}
              >
                Create
                <FaPlus />
              </Button>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {folders &&
          folders.map((folder) => (
            <TableRow key={folder._id} className=" hover:cursor-pointer w-full">
              <TableCell className="font-medium flex gap-1">
                <FolderOpen />
              </TableCell>
              <TableCell
                onClick={() => router.push(`/${folder._id}`)}
                className="w-full"
              >
                <Button variant="ghost" className="w-full flex justify-start">
                  {folder.title}
                </Button>
              </TableCell>
              <TableCell>{folder.files.length}</TableCell>
              <TableCell className="flex justify-end items-center w-full ">
                <ConfirmModel
                  header="Delete board?"
                  description="This will delete the board and all of its contents"
                  disabled={pending}
                  onConfirm={() => onDelete(folder._id)}
                >
                  <Button
                    variant="ghost"
                    className="pr-5 cursor-pointer text-sm w-full justify-center font-normal"
                  >
                    <Trash2 className="h-6 w-6 hover:text-rose-700" />
                  </Button>
                </ConfirmModel>
              </TableCell>
              <TableCell className="">
                <Button
                  variant="ghost"
                  className="text-sm w-full font-normal flex justify-end"
                  onClick={() => openRename(folder._id, folder.title)}
                >
                  <Pencil className="h-6 w-6 hover:text-gray-400" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        <TableRow className="h-12 ">
          <TableCell></TableCell>
        </TableRow>
        <TableRow className="h-12">
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default MenuTable;
