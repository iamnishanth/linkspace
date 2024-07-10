import { redirect, useNavigate } from "react-router-dom";

import { spacesAtom, store } from "@/atoms/store";
import { auth } from "@/firebase";
import { useAtomValue } from "jotai";

import CreateSpace from "@/components/create-space";
import { EditSpace } from "@/components/edit-space";

import { getUser } from "@/lib/auth";
import { getSpaces } from "@/lib/db";

const Spaces = () => {
  const spaces = useAtomValue(spacesAtom);
  const navigate = useNavigate();

  if (spaces && spaces.length === 0)
    return (
      <div className="mt-4">
        <div className="flex items-center justify-between gap-4 h-20 mb-4">
          <h1 className="text-xl md:text-3xl">{auth.currentUser?.displayName + "'s Spaces"}</h1>
          <CreateSpace />
        </div>
        <div className="flex items-center justify-center h-[50vh]">
          <h1 className="text-xl md:text-3xl">No space found</h1>
        </div>
      </div>
    );

  const handleNavigate = (id: string) => {
    navigate(`/spaces/${id}`, { state: "no-root-loading-indicator" });
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-4 h-20 mb-4">
        <h1 className="text-xl md:text-3xl">{auth.currentUser?.displayName + "'s Spaces"}</h1>
        <CreateSpace />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {spaces &&
          spaces.map((space) => (
            <div key={`${space.id}`} onClick={() => handleNavigate(space.id)}>
              <div className="h-36 sm:h-56 border rounded-lg flex items-center justify-center cursor-pointer select-none hover:ring-2 hover:ring-ring ring-offset-background ring-offset-2 relative group">
                <h1 className="text-xl max-w-full p-4 overflow-hidden text-ellipsis whitespace-nowrap">
                  {space.name}
                </h1>
                <div
                  className="absolute bottom-2 right-2 hidden group-hover:block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditSpace space={space} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const loader = async () => {
  const user = await getUser();
  if (!user) return redirect("/auth");

  if (store.get(spacesAtom)?.length === 0) {
    await getSpaces(user.uid);
  } else {
    getSpaces(user.uid);
  }

  return true;
};

Spaces.loader = loader;
export default Spaces;
