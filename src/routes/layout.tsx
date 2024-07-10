import { NavLink, Outlet, redirect, useNavigation } from "react-router-dom";

import { CircleUserRound, Home, Squircle } from "lucide-react";

import Navbar from "@/components/navbar";

import { getUser } from "@/lib/auth";

import Loading from "./loading";

const Layout = () => {
  const navigation = useNavigation();

  return (
    <main className="relative min-h-[100dvh]">
      <Navbar />
      {navigation.state === "loading" ? <Loading className="h-[calc(100vh-5rem)]" /> : <Outlet />}
      <footer className="fixed bottom-0 md:hidden h-20 w-full border-t flex items-center justify-evenly">
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center gap-2 text-xs w-20 text-muted-foreground [&.active]:text-foreground"
        >
          <Home />
          All
        </NavLink>
        <NavLink
          to="/spaces"
          className="flex flex-col items-center justify-center gap-2 text-xs w-20 text-muted-foreground [&.active]:text-foreground"
        >
          <Squircle />
          Spaces
        </NavLink>
        <NavLink
          to="/profile"
          className="flex flex-col items-center justify-center gap-2 text-xs w-20 text-muted-foreground [&.active]:text-foreground"
        >
          <CircleUserRound />
          Profile
        </NavLink>
      </footer>
    </main>
  );
};

const loader = async () => {
  const user = await getUser();
  if (!user) return redirect("/auth");

  return true;
};

Layout.loader = loader;
export default Layout;
