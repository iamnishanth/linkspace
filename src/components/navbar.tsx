import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { Search as SearchIcon } from "lucide-react";

import { auth } from "@/firebase";
import { createPost, getSearchResult } from "@/lib/db";
import { searchFetchingAtom, searchResultAtom, searchTextAtom } from "@/atoms/store";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { debounce } from "@/lib/utils";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full h-20 flex border-b border-border/40 bg-background/95 backdrop:blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex max-w-screen-2xl">
        <Search />
        <NavLinks />
      </div>
    </header>
  );
};

export default Navbar;

const Profile = () => {
  const user = auth.currentUser;
  const profilePhoto = user?.photoURL as string;
  const displayName = user?.displayName as string;

  return (
    <NavLink className="flex items-center" to="/profile">
      <Avatar className="cursor-pointer h-8 w-8">
        <AvatarImage src={profilePhoto} alt={displayName} />
        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
      </Avatar>
    </NavLink>
  );
};

const Search = () => {
  const [searchText, setSearchText] = useAtom(searchTextAtom);
  const setSearchFetching = useSetAtom(searchFetchingAtom);
  const setSearchResult = useSetAtom(searchResultAtom);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGetSearchResult = useCallback(debounce(getSearchResult, 500), []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFetching(true);
    if (e.target.value.trim().length === 0) setSearchResult([]);

    setSearchText(e.target.value);
    debouncedGetSearchResult(e.target.value);
  };

  return (
    <div className="flex items-center flex-1 md:mr-8">
      <div className="relative w-full">
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="search your links & images"
          className="pl-8 focus-visible:ring-1"
          value={searchText}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

const NavLinks = () => {
  return (
    <div className="items-center gap-4 text-sm lg:gap-6 hidden md:flex">
      <NavLink
        to="/"
        className="text-foreground/60 hover:text-foreground/80 [&.active]:text-foreground/80 [&.active]:underline [&.active]:underline-offset-8 lowercase"
        state="no-root-loading-indicator"
      >
        All
      </NavLink>
      <NavLink
        to="/spaces"
        className="text-foreground/60 hover:text-foreground/80 [&.active]:text-foreground/80 [&.active]:underline [&.active]:underline-offset-8 lowercase"
        state="no-root-loading-indicator"
      >
        Spaces
      </NavLink>
      <CreatePost />
      <Profile />
    </div>
  );
};

const CreatePost = () => {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");

  const onAddLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (link.trim().length === 0) {
      toast.error("Link cannot be empty");
      return;
    }

    try {
      new URL(link).hostname;
    } catch (e) {
      toast.error("Invalid link");
      return;
    }

    const post = createPost({
      url: link,
      type: "link",
      uid: auth.currentUser?.uid as string,
    });

    toast.promise(post, {
      loading: "Adding your link...",
      success: () => {
        return "Added your link successfully";
      },
      error: "Error adding your link",
    });

    setLink("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <p
        className="text-foreground/60 hover:text-foreground/80 [&.active]:text-foreground/80 [&.active]:underline [&.active]:underline-offset-8 cursor-pointer lowercase"
        onClick={() => setOpen(true)}
      >
        Create
      </p>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add link</DialogTitle>
        </DialogHeader>
        <form className="flex items-center space-x-2" onSubmit={onAddLink}>
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              placeholder="https://example.com/"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </form>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onAddLink}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
