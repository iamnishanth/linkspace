import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";

import { searchFetchingAtom, searchResultAtom, searchTextAtom } from "@/atoms/store";
import { auth } from "@/firebase";
import { useAtom, useSetAtom } from "jotai";
import { Plus, Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createPost, getSearchResult } from "@/lib/db";
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
    <NavLink className="hidden md:flex items-center" to="/profile">
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
          placeholder="Search your links & images"
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
    <div className="flex justify-end items-center gap-4 lg:gap-6 text-sm">
      <NavLink
        to="/"
        className="text-foreground/60 hover:text-foreground/80 [&.active]:text-foreground/80 [&.active]:underline [&.active]:underline-offset-8 hidden md:block"
        state="no-root-loading-indicator"
      >
        All
      </NavLink>
      <NavLink
        to="/spaces"
        className="text-foreground/60 hover:text-foreground/80 [&.active]:text-foreground/80 [&.active]:underline [&.active]:underline-offset-8 hidden md:block"
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
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="ml-2 md:ml-0 gap-2"
      >
        <Plus size={14} />
        <span className="hidden md:inline">Create</span>
      </Button>
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
              autoComplete="off"
            />
          </div>
        </form>
        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={onAddLink}>
            Add Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
