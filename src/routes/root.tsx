import { Outlet, useNavigation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Loading from "./loading";

function Root() {
  const navigation = useNavigation();
  return (
    <>
      {navigation.state === "loading" &&
      navigation.location.state !== "no-root-loading-indicator" ? (
        <Loading />
      ) : (
        <>
          <Outlet />
          <Toaster />
        </>
      )}
    </>
  );
}

export default Root;
