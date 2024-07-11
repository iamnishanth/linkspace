import { useCallback, useState } from "react";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ExternalLink, Squircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  addPostToSpace,
  addTag,
  deletePost,
  removePostFromSpace,
  removeTag,
  updateNotes,
  updateTitle,
} from "@/lib/db";
import { type Link, Space } from "@/lib/db.types";
import { debounce, formatTimestamp, truncate } from "@/lib/utils";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const PostContent = ({
  post,
  spaces,
  closeDetails,
}: {
  post: Link;
  spaces: Space[] | null;
  closeDetails: () => void;
}) => {
  const [showAddTag, setShowAddTag] = useState<boolean>(false);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const tag = formData.get("tag") as string;
    if (tag.trim().length > 0) {
      addTag(post.id, tag);
    }

    // @ts-expect-error setting tag value to empty string
    e.currentTarget.tag.value = "";
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTitleWithDebounce = useCallback(debounce(updateTitle, 500), []);

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTitleWithDebounce(post.id, e.target.value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateNotesWithDebounce = useCallback(debounce(updateNotes, 500), []);

  const handleUpdateNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNotesWithDebounce(post.id, e.target.value);
  };

  const handleDelete = async () => {
    toast.promise(deletePost(post), {
      loading: "Deleting post...",
      success: () => {
        return "Post deleted";
      },
      error: "Error deleting post",
    });

    closeDetails();
  };

  const toggleSpaceSelect = (postId: string, spaceId: string) => {
    if (!post.space_ids.includes(spaceId)) {
      addPostToSpace(postId, spaceId);
    } else {
      removePostFromSpace(postId, spaceId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 h-full">
      <div className="bg-background h-full w-full relative rounded-lg flex items-center justify-center overflow-hidden">
        {"image" in post &&
          post.image && ( // typescript gymnastics 🙃
            <img
              src={post.image?.url}
              alt={post.image?.alt}
              className="object-contain h-full max-h-full absolute px-4"
              height={post.image.height}
              width={post.image.width}
            />
          )}
      </div>
      <div className="bg-background h-full w-full flex flex-col">
        <header className="w-full flex flex-col justify-center gap-2 p-4">
          <Input
            type="text"
            className="text-3xl border-none text-ellipsis p-0 focus-visible:ring-1"
            defaultValue={post.title}
            autoFocus={false}
            tabIndex={-1}
            placeholder="Add a title"
            onChange={handleUpdateTitle}
          />
          <div className="flex gap-4">
            <p className="text-sm max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {formatTimestamp(post.created_at.seconds, post.created_at.nanoseconds)}
            </p>
            {"url" in post && post.url && (
              <a
                className="text-sm hover:underline flex items-baseline gap-1"
                title={post.url}
                href={post.url}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="h-4 w-4 self-center" />
                {truncate(post.domain as string, 20)}
              </a>
            )}
          </div>
          {post.description.trim().length > 0 && <p className="text-xs">{post.description}</p>}
        </header>
        <main className="px-4 relative flex-1 flex flex-col">
          <section className="mb-4">
            {showAddTag && (
              <form
                className="mt-2 mb-4 w-full flex items-center gap-2 animate-in slide-in-from-top-1/4 fade-in-10 duration-300"
                onSubmit={handleAddTag}
              >
                <Input type="text" placeholder="Enter tag" name="tag" />
                <Button className="font-sans font-semibold" type="submit">
                  Add
                </Button>
              </form>
            )}
            <div className="mt-2 flex flex-wrap w-full gap-2 max-h-28">
              <Badge
                variant="default"
                className="cursor-pointer select-none"
                onClick={() => setShowAddTag((prev) => !prev)}
              >
                + Add tag
              </Badge>
              {post.tags.map((tag) => (
                <Badge
                  variant="secondary"
                  key={tag}
                  className="cursor-pointer select-none group/badge gap-1"
                >
                  {tag}
                  <button
                    className="hidden group-hover/badge:block rounded-full transition-opacity opacity-70 hover:opacity-100"
                    onClick={() => removeTag(post.id, tag)}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </section>
          <section className="flex-1 pb-20">
            <header className="text-sm tracking-wider font-semibold">Notes</header>
            <Textarea
              className="mt-2 resize-none h-[calc(100%-20px-0.5rem)] max-h-40"
              defaultValue={post.notes}
              placeholder="Add notes here"
              tabIndex={-1}
              onChange={handleUpdateNotes}
            />
          </section>
          <section className="flex gap-4 justify-center items-center absolute bottom-4 h-20 w-[calc(100%-2rem)]">
            <button className="rounded-full p-2 bg-muted/70 hover:bg-muted" onClick={handleDelete}>
              <Trash2 />
            </button>
            {spaces && spaces.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full p-2 bg-muted/70 hover:bg-muted"
                    title="Add to spaces"
                  >
                    <Squircle />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Add to spaces</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {spaces.map((space) => (
                    <DropdownMenuCheckboxItem
                      key={space.id}
                      checked={post.space_ids.includes(space.id)}
                      onCheckedChange={() => toggleSpaceSelect(post.id, space.id)}
                    >
                      {space.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default PostContent;
