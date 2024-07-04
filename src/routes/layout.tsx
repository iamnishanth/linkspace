import { Outlet, redirect, useNavigation } from "react-router-dom";

import Navbar from "@/components/navbar";

import { getUser } from "@/lib/auth";

import Loading from "./loading";

const Layout = () => {
  const navigation = useNavigation();

  return (
    <main>
      <Navbar />
      {navigation.state === "loading" ? <Loading className="h-[calc(100vh-5rem)]" /> : <Outlet />}
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
