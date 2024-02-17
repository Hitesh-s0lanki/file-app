import DetailTable from "@/components/details-table";

interface FolderPageProps {
  params: {
    folderId: string;
  };
}

const FolderPage = ({ params }: FolderPageProps) => {
  return (
    <div className="h-full w-full flex justify-center p-10">
      <DetailTable id={params.folderId} />
    </div>
  );
};

export default FolderPage;
