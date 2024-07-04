import {
  allPostsAtom,
  searchFetchingAtom,
  searchResultAtom,
  spacesAtom,
  store,
} from "@/atoms/store";
import { auth, db, storage } from "@/firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

import type { Link, Space } from "./db.types";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const getPosts = async (uid: string) => {
  const q = query(
    collection(db, "posts"),
    where("user_id", "==", uid),
    orderBy("created_at", "desc"),
  );

  try {
    const querySnapshot = await getDocs(q);
    const posts: Link[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data() as Link;
      docData.id = doc.id;
      posts.push(docData);
    });

    // update allPostsAtom
    store.set(allPostsAtom, posts);

    return posts;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deletePost = async (post: Link) => {
  const { id } = post;
  const docRef = doc(db, "posts", id);
  try {
    await deleteDoc(docRef);

    // delete image stored in firebase storage
    if ("image" in post && post.image) {
      const storageRef = ref(storage, `/${post.image.fileName}`);
      await deleteObject(storageRef);
    }

    // update allPostsAtom
    const postsFromAtom = store.get(allPostsAtom);
    if (postsFromAtom) {
      const updatedPosts = postsFromAtom.filter((postAtom) => postAtom.id !== id);
      store.set(allPostsAtom, updatedPosts);
    }

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSpaces = async (uid: string) => {
  const q = query(collection(db, "spaces"), where("user_id", "==", uid));
  try {
    const querySnapshot = await getDocs(q);
    const spaces: Space[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data() as Space;
      docData.id = doc.id;
      spaces.push(docData);
    });

    // update spacesAtom
    store.set(spacesAtom, spaces);

    return spaces;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSpace = async (uid: string, spaceId: string) => {
  const docRef = doc(db, "spaces", spaceId);
  try {
    const docSnap = await getDoc(docRef);
    // check if the doc exists and it belongs to the user
    if (docSnap.exists() && docSnap.data().user_id === uid) {
      const space = docSnap.data() as Space;
      space.id = docSnap.id;
      return space;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSpacePosts = async (uid: string, spaceId: string) => {
  const q = query(
    collection(db, "posts"),
    where("user_id", "==", uid),
    where("space_ids", "array-contains", spaceId),
    orderBy("created_at", "desc"),
  );
  try {
    const querySnapshot = await getDocs(q);
    const posts: Link[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data() as Link;
      docData.id = doc.id;
      posts.push(docData);
    });
    return posts;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const updateTitle = async (postId: string, title: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const postsRef = doc(db, "posts", postId);
    await updateDoc(postsRef, {
      title,
      title_lower: title.toLowerCase(),
      updated_at: serverTimestamp(),
    });

    // update in atoms
    const posts = store.get(allPostsAtom);
    if (posts) {
      const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, title } : post));
      store.set(allPostsAtom, updatedPosts);
    }

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const addTag = async (postId: string, tag: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const postsRef = doc(db, "posts", postId);
    const lowercaseTag = tag.toLowerCase(); // for searching based on tag
    await updateDoc(postsRef, {
      tags: arrayUnion(lowercaseTag),
      updated_at: serverTimestamp(),
    });

    // update in atoms
    const posts = store.get(allPostsAtom);
    if (posts) {
      // TODO: check duplicate tag
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, tags: [...post.tags, tag] } : post,
      );
      store.set(allPostsAtom, updatedPosts);
    }
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const removeTag = async (postId: string, tag: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const postsRef = doc(db, "posts", postId);
    await updateDoc(postsRef, {
      tags: arrayRemove(tag),
      updated_at: serverTimestamp(),
    });

    // update in atoms
    const posts = store.get(allPostsAtom);
    if (posts) {
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? { ...post, tags: post.tags.filter((tagFromAtom) => tagFromAtom !== tag) }
          : post,
      );
      store.set(allPostsAtom, updatedPosts);
    }

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const updateNotes = async (postId: string, notes: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const postsRef = doc(db, "posts", postId);
    await updateDoc(postsRef, {
      notes,
      updated_at: serverTimestamp(),
    });

    // update in atoms
    const posts = store.get(allPostsAtom);
    if (posts) {
      const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, notes } : post));
      store.set(allPostsAtom, updatedPosts);
    }
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const addPostToSpace = async (postId: string, spaceId: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const postsRef = doc(db, "posts", postId);
    await updateDoc(postsRef, {
      space_ids: arrayUnion(spaceId),
      updated_at: serverTimestamp(),
    });

    // update in atoms
    const posts = store.get(allPostsAtom);
    if (posts) {
      // TODO: check duplicate space id
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, space_ids: [...post.space_ids, spaceId] } : post,
      );

      store.set(allPostsAtom, updatedPosts);
    }
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const removePostFromSpace = async (postId: string, spaceId: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const postsRef = doc(db, "posts", postId);
    await updateDoc(postsRef, {
      space_ids: arrayRemove(spaceId),
      updated_at: serverTimestamp(),
    });

    // update in atoms
    const posts = store.get(allPostsAtom);
    if (posts) {
      const updatedPosts = posts.map((post) =>
        post.id === postId
          ? { ...post, space_ids: post.space_ids.filter((id) => id !== spaceId) }
          : post,
      );

      store.set(allPostsAtom, updatedPosts);
    }
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

// TODO: better type the config
export const createPost = async (config: {
  type: "link" | "text" | "image";
  url: string;
  uid: string;
}) => {
  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) throw Error("Failed to get id token");

    const requestPayload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: idToken,
      },
      body: JSON.stringify(config),
    };

    const response = await fetch(SERVER_URL + "/api/post/save-post", requestPayload);
    if (!response.ok) throw Error("Failed to create post");

    const post = (await response.json()) as Link;
    const postsFromAtom = store.get(allPostsAtom);
    if (postsFromAtom) store.set(allPostsAtom, [post, ...postsFromAtom]);

    return post;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const createSpace = async (name: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const spacesRef = collection(db, "spaces");
    const docRef = await addDoc(spacesRef, {
      name,
      user_id: uid,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    // TODO: update atoms
    return docRef.id;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const updateSpaceName = async (spaceId: string, name: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const spacesRef = doc(db, "spaces", spaceId);
    await updateDoc(spacesRef, {
      name,
      updated_at: serverTimestamp(),
    });

    // update space name in atoms store
    const spacesInStore = store.get(spacesAtom);
    if (spacesInStore) {
      const newSpaces = spacesInStore.map((space) => {
        if (space.id === spaceId) {
          return { ...space, name };
        }
        return space;
      });

      store.set(spacesAtom, newSpaces);
    }
    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const deleteSpace = async (spaceId: string) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  try {
    const spacesRef = doc(db, "spaces", spaceId);
    await deleteDoc(spacesRef);

    // delete space from atoms store
    const spacesInStore = store.get(spacesAtom);
    if (spacesInStore) {
      const newSpaces = spacesInStore.filter((space) => space.id !== spaceId);
      store.set(spacesAtom, newSpaces);
    }

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSearchResult = async (searchTerm: string) => {
  store.set(searchFetchingAtom, true);
  // if search term is empty, clear searchResultAtom
  if (searchTerm.trim().length === 0) {
    store.set(searchResultAtom, []);
    store.set(searchFetchingAtom, false);
    return null;
  }

  const uid = auth.currentUser?.uid;
  const lowercaseSearchTerm = searchTerm.toLowerCase();

  const q = query(
    collection(db, "posts"),
    where("user_id", "==", uid),
    where("title_lower", ">=", lowercaseSearchTerm),
    where("title_lower", "<=", lowercaseSearchTerm + "\uf8ff"),
    orderBy("created_at", "desc"),
  );

  try {
    const querySnapshot = await getDocs(q);
    const posts: Link[] = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data() as Link;
      docData.id = doc.id;
      posts.push(docData);
    });

    // update searchResultAtom
    store.set(searchResultAtom, posts);
    store.set(searchFetchingAtom, false);

    return posts;
  } catch (e) {
    console.log(e);
    store.set(searchFetchingAtom, false);
    return null;
  }
};
