"use client";

import { useEffect, useState } from "react";
import CreateFolderModal from "./create-folder-modal";
import RenameModal from "./rename-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateFolderModal />
      <RenameModal />
    </>
  );
};

export default ModalProvider;
