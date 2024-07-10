import { redirect, useLoaderData, useNavigate } from "react-router-dom";

import { type User } from "firebase/auth";
import { LogOut, MoveLeft } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

import { getUser, signOut } from "@/lib/auth";

const Profile = () => {
  const navigate = useNavigate();
  const user = useLoaderData() as User;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="container mt-4">
      <div className="h-10 flex items-center">
        <Button
          variant="ghost"
          className="flex gap-4 select-none cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <MoveLeft />
          go back
        </Button>
      </div>
      <div className="mt-40">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center">
          Hello, {user.displayName}
        </h1>
        <div className="flex flex-col gap-4 mt-4 items-center">
          <section className="flex gap-2 items-center">
            <h4>Your email:</h4>
            <p className="text-sm md:text-lg">{user.email}</p>
          </section>
          <section className="flex gap-2 items-center">
            <h4 className="text-sm md:text-md">Appearance:</h4>
            <ModeToggle />
          </section>
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="flex gap-2 items-center justify-center"
          >
            <LogOut size={14} /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

const loader = async () => {
  const user = await getUser();
  if (!user) redirect("/auth");

  return user;
};

Profile.loader = loader;
export default Profile;
