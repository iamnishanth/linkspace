import { redirect, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { getUser, signInWithGoogle } from "@/lib/auth";

const Auth = () => {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    await signInWithGoogle();
    navigate("/");
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-lg">link_space</h1>
        <p className="text-sm">minimalistic link organizer</p>
      </div>
      <Button onClick={handleSignIn}>
        <GoogleIcon />
        Login with Google
      </Button>
    </main>
  );
};

const loader = async () => {
  const user = await getUser();
  if (user) return redirect("/");

  return true;
};

Auth.loader = loader;

export default Auth;

const GoogleIcon = () => {
  return (
    <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  );
};
