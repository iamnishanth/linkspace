import { useLocation, useNavigate } from "react-router-dom";

import { type ImageProperties } from "@/lib/db.types";

import { AspectRatio } from "../ui/aspect-ratio";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

type ImagePreviewCardProps = {
  id: string;
  title: string;
  image: ImageProperties;
  domain?: string;
  url?: string;
};

const ImagePreviewCard = ({ id, title, image, domain, url }: ImagePreviewCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const openPreview = () => {
    const path = location.pathname;
    const newPath = `${path + (path !== "/" ? "/" : "")}post/${id}`;
    navigate(newPath, {
      relative: "path",
      state: "no-root-loading-indicator",
    });
  };

  return (
    <div onClick={openPreview} data-id={id}>
      <AspectRatio ratio={image.width / image.height} className="cursor-pointer group">
        <Card className="overflow-hidden ring-offset-background hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2 relative">
          <img
            src={image.url}
            alt={title}
            width={image.width}
            height={image.height}
            draggable={false}
            loading="lazy"
          />
          {domain && domain.length > 0 && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 absolute bottom-2 left-2 max-w-[calc(100%-1rem)]"
              title={domain}
              onClick={(e) => e.stopPropagation()}
            >
              <Badge
                variant="secondary"
                className="max-w-full whitespace-nowrap text-ellipsis overflow-hidden"
              >
                {domain}
              </Badge>
            </a>
          )}
        </Card>
      </AspectRatio>
      {title.length > 0 && (
        <p
          className="w-full mt-2 text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap select-none cursor-pointer"
          title={title}
        >
          {title}
        </p>
      )}
    </div>
  );
};

export default ImagePreviewCard;
