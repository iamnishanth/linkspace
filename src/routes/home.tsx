import { Outlet, redirect } from "react-router-dom";

import {
  allPostsAtom,
  searchFetchingAtom,
  searchResultAtom,
  searchTextAtom,
  store,
} from "@/atoms/store";
import { useAtomValue } from "jotai";

import CardList from "@/components/card-list";

import { getUser } from "@/lib/auth";
import { getPosts } from "@/lib/db";
import { Link } from "@/lib/db.types";

const Home = () => {
  const posts = useAtomValue(allPostsAtom);
  const searchTerm = useAtomValue(searchTextAtom);
  const searchResults = useAtomValue(searchResultAtom);
  const searchFetching = useAtomValue(searchFetchingAtom);

  let postsToDisplay = posts as Link[];
  if (searchTerm) {
    postsToDisplay = searchResults;
  }

  // loading indicator when searching
  if (searchTerm && searchResults.length === 0 && searchFetching) {
    return (
      <div className="container mt-2">
        <div className="flex flex-col gap-4 items-center justify-center h-[70vh]">
          <h1 className="text-3xl">Searching...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-2">
      {postsToDisplay?.length === 0 && (
        <div className="flex flex-col gap-4 items-center justify-center h-[70vh]">
          <h1 className="text-2xl text-center">
            {searchTerm ? "No results found" : "It looks empty here. 🤔"}
          </h1>
          <p className="text-center">
            {searchTerm ? "Try searching for something else" : `Add some links to get started!`}
          </p>
        </div>
      )}
      {postsToDisplay && <CardList posts={postsToDisplay} />}
      <Outlet />
    </div>
  );
};

const loader = async () => {
  const user = await getUser();
  if (!user) return redirect("/auth");

  // load in background if we already have posts, use existing posts in atom meanwhile
  if (store.get(allPostsAtom)?.length === 0) {
    await getPosts(user.uid);
  } else {
    getPosts(user.uid);
  }

  return true;
};

Home.loader = loader;
export default Home;
