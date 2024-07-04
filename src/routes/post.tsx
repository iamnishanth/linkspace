import { useNavigate, useParams } from "react-router-dom";
import { type User } from "firebase/auth";
import { type Link } from "@/lib/db.types";

import { auth } from "@/firebase";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePost } from "@/hooks/use-post";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import PostContent from "@/components/post-content";
import { spacesAtom } from "@/atoms/store";
import { useAtomValue } from "jotai";

const Post = () => {
  const navigate = useNavigate();
  const params = useParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const postId = params.postId as string;
  const currentUser = auth.currentUser as User;

  const { post, isLoading } = usePost(currentUser.uid, postId) as {
    post: Link | null;
    isLoading: boolean;
  };

  const spaces = useAtomValue(spacesAtom);

  const closeDetails = () => {
    navigate(-1);
  };

  if (isDesktop) {
    return (
      <div>
        <Dialog defaultOpen onOpenChange={closeDetails}>
          <DialogContent className="h-[90vh] max-w-[90vw] z-50">
            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                <Skeleton className="bg-muted h-full w-full rounded-lg" />
                <Skeleton className="bg-muted h-full w-full rounded-lg" />
              </div>
            )}
            {!isLoading && !post && (
              <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                <h1 className="text-3xl font-bold">Oops! We couldn't find that post 🫤</h1>
                <p>Make sure you have the correct link.</p>
              </div>
            )}
            {!isLoading && post && (
              <PostContent post={post} spaces={spaces} closeDetails={closeDetails} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  } else {
    return (
      <div>
        <Drawer open onOpenChange={closeDetails}>
          <DrawerContent className="h-[90dvh]">
            {isLoading && (
              <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-[2fr_1fr] gap-4">
                <Skeleton className="bg-muted h-full w-full rounded-lg" />
                <Skeleton className="bg-muted h-full w-full rounded-lg" />
              </div>
            )}
            {!isLoading && !post && (
              <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                <h1 className="text-3xl font-bold">Oops! We couldn't find that post 🫤</h1>
                <p>Make sure you have the correct link.</p>
              </div>
            )}
            {!isLoading && post && (
              <PostContent post={post} spaces={spaces} closeDetails={closeDetails} />
            )}
          </DrawerContent>
        </Drawer>
      </div>
    );
  }
};

export default Post;
