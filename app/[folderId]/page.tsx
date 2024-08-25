import DetailTable from "@/components/details-table";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

const FolderPage = ({ params }: FolderPageProps) => {
  return (
    <DetailTable id={params.folderId} />
  );
};

export default FolderPage;
