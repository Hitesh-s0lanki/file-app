import Image from "next/image";
import { downloadData } from "./details-table";
import { memo } from "react";

interface ImageViewProps {
  imageFiles: downloadData[];
}

export const ImageView = memo(({ imageFiles }: ImageViewProps) => {
  return (
    <div className="w-full grid grid-cols-4 gap-5">
      {imageFiles.map((image) => (
        <div
          key={image.url}
          className=" rounded-md shadow-md flex flex-col gap-2 justify-center items-center p-1"
        >
          <Image
            src={image.link || "/default.png"}
            alt={image.name}
            height={100}
            width={200}
            className=" h-52 w-full rounded-md"
          />
          <p className=" text-muted-foreground text-center p-2">{image.name}</p>
          <p className=" text-muted-foreground text-center p-2">{image.link}</p>
        </div>
      ))}
    </div>
  );
});

ImageView.displayName = "ImageView";
