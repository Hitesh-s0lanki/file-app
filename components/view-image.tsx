import Image from "next/image";
import { downloadData } from "./details-table";
import { memo } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

interface ImageViewProps {
  imageFiles: downloadData[];
}

export const ImageView = memo(({ imageFiles }: ImageViewProps) => {
  return (
    <div className="w-full grid grid-cols-5 gap-2">
      {imageFiles.map((image) => (
        <div
          key={image.url}
          className=" flex flex-col gap-2 justify-between items-center p-2 rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <Image
            src={image.link || "/default.png"}
            alt={image.name}
            height={150}
            width={150}
            className="rounded-md"
          />
          <div className=" flex flex-col gap-2 justify-start">
            <p className=" text-muted-foreground text-xs">File Name: {image.name}</p>
            <Button variant="link" asChild>
              <Link
                href={image.link}
                target="_blank"
              >
                click here for image.
              </Link>

            </Button>
          </div>
        </div>
      ))}
    </div>
  );
});

ImageView.displayName = "ImageView";
