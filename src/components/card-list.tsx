import { useRef } from "react";
import { MasonryScroller, useContainerPosition, usePositioner, useResizeObserver } from "masonic";

import { type Link } from "@/lib/db.types";
import { useMediaQueryColumns } from "@/hooks/use-media-query-columns";
import { useWindowSize } from "@/hooks/use-window-size";

import NoPreviewCard from "@/components/cards/no-preview";
import LinkPreviewCard from "@/components/cards/link-preview";
import ImagePreviewCard from "@/components/cards/image-preview";

const CardList = ({ posts }: { posts: Link[] }) => {
  const containerRef = useRef(null);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const { offset, width } = useContainerPosition(containerRef, [windowWidth, windowHeight]);
  const { columns } = useMediaQueryColumns({
    defaultColumns: 3,
    breakpoints: [640, 768, 1024, 1280],
    columnCount: [2, 3, 4, 5],
  });

  const positioner = usePositioner({ width, columnGutter: 16, columnCount: columns }, [
    posts.length,
  ]);

  const resizeObserver = useResizeObserver(positioner);

  const renderCard = ({ data }: { data: Link }) => {
    if (data.type === "link" && data.image === null) {
      return (
        <NoPreviewCard
          key={data.id}
          id={data.id}
          title={data.title}
          domain={data.domain}
          url={data.url}
        />
      );
    }

    if (data.type === "link" && data.image !== null) {
      return (
        <LinkPreviewCard
          key={data.id}
          id={data.id}
          title={data.title}
          domain={data.url}
          url={data.url}
          image={data.image}
        />
      );
    }

    if (data.type === "image") {
      return (
        <ImagePreviewCard
          key={data.id}
          id={data.id}
          title={data.title}
          image={data.image}
          domain={data.domain ? data.domain : undefined}
          url={data.url ? data.url : undefined}
        />
      );
    }

    return <h1>Hello</h1>;
  };

  return (
    <div className="p-2 w-full m-0 box-border animate-in zoom-in fade-in duration-300">
      <MasonryScroller
        positioner={positioner}
        resizeObserver={resizeObserver}
        containerRef={containerRef}
        items={posts}
        height={windowHeight}
        offset={offset}
        overscanBy={2}
        render={renderCard}
        itemKey={(item) => item.id}
      />
    </div>
  );
};

export default CardList;
