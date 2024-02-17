"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DownloadIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { generateUploadUrl } from "@/convex/files";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import Link from "next/link";
import useDownloader from "react-use-downloader";

const DetailTable = ({ id }: { id: string }) => {
  const folder = useQuery(api.file.get, { id: id as Id<"folders"> });

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);
  const { mutate, pending } = useApiMutation(api.files.deleteFile);
  const { mutate: downUrl } = useApiMutation(api.files.getFileUrl);

  const { download } = useDownloader();

  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    await saveStorageId({
      id: id as Id<"folders">,
      storageIds: uploaded.map(({ response }, index) => ({
        name: uploaded[index].name || "unknown",
        url: (response as any).storageId,
      })),
    });
  };

  const handleDelete = (fileId: Id<"_storage">) => {
    mutate({
      folderId: id,
      id: fileId,
    })
      .then(() => {
        toast.success("Deleted the file...");
      })
      .catch(() => toast.error("Failed to delete file"));
  };

  const handleDownload = (id: Id<"_storage">, name: string) => {
    downUrl({
      id,
    })
      .then((response) => {
        download(response, name);
      })
      .catch(() => toast.error("Failed to delete file"));
  };

  if (!folder) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Sr.no</TableHead>
          <TableHead>File Name</TableHead>
          <TableHead className="text-right">
            <div className="flex gap-2 justify-end items-center p-3">
              <UploadButton
                uploadUrl={generateUploadUrl}
                multiple
                onUploadComplete={saveAfterUpload}
                onUploadError={(error: unknown) => {
                  alert(`ERROR! ${error}`);
                }}
              />
              <Button variant="outline">Download</Button>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {folder &&
          folder.files.map((file, index) => (
            <TableRow key={file.name}>
              <TableCell className="font-medium">{index + 1}.</TableCell>
              <TableCell>{file.name}</TableCell>
              <TableCell className="text-right">
                <div className="w-full flex justify-end items-center gap-4">
                  <DownloadIcon
                    className=" hover:text-green-700"
                    onClick={() =>
                      handleDownload(file.url as Id<"_storage">, file.name)
                    }
                  />
                  <Trash2Icon
                    className=" hover:text-rose-700 cursor-pointer"
                    onClick={() => handleDelete(file.url as Id<"_storage">)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default DetailTable;
