"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FolderOpen, Loader2, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import Loading from "./loading";
import { ImageView } from "./view-image";
import Link from "next/link";

export type downloadData = {
  name: string;
  url: string;
  link: string;
};

const regex = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/);

const DetailTable = ({ id }: { id: string }) => {
  const folder = useQuery(api.file.get, { id: id as Id<"folders"> });

  const [pending, setPending] = useState(false);
  const [data, setData] = useState<downloadData[]>([]);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageId);
  const { mutate } = useApiMutation(api.files.deleteFile);
  const { mutate: downUrl } = useApiMutation(api.files.getFilesUrl);

  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    setPending(true);
    await saveStorageId({
      id: id as Id<"folders">,
      storageIds: uploaded.map(({ response }, index) => ({
        name: uploaded[index].name || "unknown",
        url: (response as any).storageId,
      })),
    });
    setPending(false);
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


  const getFiles = useCallback(() => {
    if (!folder || !folder.files) {
      console.log("here");
      setData([]);
      return;
    }

    downUrl({
      ids: folder.files.map((file) => file.url as Id<"_storage">),
    })
      .then((response: string[]) => {
        const ans = response.map((link, index) => ({
          ...folder.files[index],
          link,
        }));

        setData(ans);
      })
      .catch(() => toast.error("Something went wrong"));
  }, [folder, setData]);

  useEffect(() => {
    getFiles();
  }, [getFiles]);

  if (!folder || pending) {
    return <Loading />;
  }

  return (
    <div className="h-full w-full flex flex-col gap-5 p-8 overflow-auto">
      <div className=" flex gap-5 items-center w-full">
        <h1 className=" text-xl font-semibold flex gap-2 items-center">
          <FolderOpen className=" size-8" />
          {folder.title}
        </h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] py-1">Sr.no</TableHead>
            <TableHead className="py-1">File Name</TableHead>
            <TableHead className="text-right py-1">
              <div className="flex gap-2 justify-end items-center p-3">
                <UploadButton
                  uploadUrl={generateUploadUrl}
                  multiple
                  onUploadComplete={saveAfterUpload}
                  onUploadError={(error: unknown) => {
                    alert(`ERROR! ${error}`);
                  }}
                />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {folder &&
            data &&
            data.map((file, index) => (
              <TableRow key={file.name}>
                <TableCell className="font-medium py-2">{index + 1}.</TableCell>
                <TableCell className="py-2">{file.name}</TableCell>
                <TableCell className="text-right py-2">
                  <div className="w-full flex justify-end items-center gap-4">
                    <Link
                      href={file.link}
                      target="_blank"
                      download
                    >
                      <Download
                        className=" hover:text-green-700 size-4"
                      />
                    </Link>
                    <Trash
                      className=" hover:text-rose-700 cursor-pointer size-4"
                      onClick={() => handleDelete(file.url as Id<"_storage">)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {folder && data.length !== 0 && data[0].link !== "" && (
        <ImageView imageFiles={data.filter((file) => regex.test(file.name))} />
      )}
    </div>
  );
};

export default DetailTable;
