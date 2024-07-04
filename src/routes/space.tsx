import { LoaderFunctionArgs, Outlet, redirect, useLoaderData } from "react-router-dom";

import CardList from "@/components/card-list";

import { getUser } from "@/lib/auth";
import { getSpace, getSpacePosts } from "@/lib/db";
import { Link, type Space as SpaceType } from "@/lib/db.types";

const Space = () => {
  // TODO: read from atoms
  const { space, posts } = useLoaderData() as { space: SpaceType | null; posts: Link[] | null };

  if (space === null) {
    return <div className="container mt-4">Space not found</div>;
  }

  return (
    <div className="container mt-4">
      {space && (
        <>
          <header className="w-full h-32 flex items-center justify-center">
            <h1 className="text-3xl">{space.name}</h1>
          </header>
          <main>{posts && <CardList posts={posts} />}</main>
        </>
      )}
      <Outlet />
    </div>
  );
};

const loader = async ({ params }: LoaderFunctionArgs) => {
  const user = await getUser();
  if (!user) return redirect("/auth");

  const spaceId = params.spaceId as string;
  if (!spaceId) redirect("/");

  const space: SpaceType | null = await getSpace(user.uid, spaceId);
  const posts: Link[] | null = await getSpacePosts(user.uid, spaceId);

  return { space, posts };
};

Space.loader = loader;

export default Space;
