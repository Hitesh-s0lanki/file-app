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
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { toast } from "sonner";
import useDownloader from "react-use-downloader";
import Loading from "./loading";
import ImageView from "./view-image";

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
  const { mutate: downUrl } = useApiMutation(api.files.getFileUrl);

  const { download } = useDownloader();

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

  const handleDownload = (link: string, name: string) => {
    setPending(true);

    download(link, name)
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setPending(false));
  };

  const getFiles = useCallback(() => {
    const data =
      folder?.files?.map((file) => {
        const obj: downloadData = {
          ...file,
          link: "",
        };

        downUrl({
          id: file.url as Id<"_storage">,
        }).then((response) => {
          obj.link = response;
        });

        return obj;
      }) || [];

    setData(data);
  }, [folder?.files]);

  useEffect(() => {
    getFiles();
  }, [getFiles]);

  if (!folder || pending) {
    return <Loading />;
  }

  return (
    <div className="h-full w-full flex flex-col gap-5">
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
            data &&
            data.map((file, index) => (
              <TableRow key={file.name}>
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell>{file.name}</TableCell>
                <TableCell className="text-right">
                  <div className="w-full flex justify-end items-center gap-4">
                    <DownloadIcon
                      className=" hover:text-green-700"
                      onClick={() => handleDownload(file.link, file.name)}
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
      {folder && data.length !== 0 && (
        <ImageView imageFiles={data.filter((file) => regex.test(file.name))} />
      )}
    </div>
  );
};

export default DetailTable;
