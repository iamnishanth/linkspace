import { useLocation, useNavigate } from "react-router-dom";

import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

type NoPreviewCardProps = {
  id: string;
  title: string;
  domain: string;
  url: string;
};

const NoPreviewCard = ({ id, title, domain, url }: NoPreviewCardProps) => {
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
      <AspectRatio ratio={1 / 1} className="cursor-pointer group">
        <Card className="h-full w-full hover:cursor-pointer ring-offset-background hover:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2 relative">
          <CardHeader>
            <CardTitle
              className="overflow-hidden text-ellipsis leading-normal whitespace-nowrap"
              title={title}
            >
              {title}
            </CardTitle>
            <CardDescription title={url} className="break-words">
              {domain}
            </CardDescription>
          </CardHeader>
          {domain.length > 0 && (
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

export default NoPreviewCard;
