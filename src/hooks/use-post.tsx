import { useEffect, useState } from "react";

import { spacesAtom, store } from "@/atoms/store";
import { db } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";

import { getSpaces } from "@/lib/db";
import { type Link } from "@/lib/db.types";

export const usePost = (
  uid: string,
  postId: string,
): {
  post: Link | null;
  isLoading: boolean;
} => {
  const [post, setPost] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // add spaces to atoms store if it doesn't exist
  useEffect(() => {
    const spacesInStore = store.get(spacesAtom);
    if (!spacesInStore) {
      getSpaces(uid);
    }
  }, [uid]);

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(doc(db, "posts", postId), (doc) => {
        if (doc.exists()) {
          const docData = doc.data() as Link;
          docData.id = doc.id;
          setPost(docData);
          setIsLoading(false);
        } else {
          setPost(null);
          setIsLoading(false);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.log(e);
      setPost(null);
      setIsLoading(false);
    }
  }, [uid, postId]);

  return { post, isLoading };
};
