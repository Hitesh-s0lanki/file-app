"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import FolderDataTable from "./folder-data-table/data-table";

const MenuTable = () => {
  const folders = useQuery(api.file.listFolders);

  if (!folders)
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <FolderDataTable
      data={folders}
    />
  );
};

export default MenuTable;
