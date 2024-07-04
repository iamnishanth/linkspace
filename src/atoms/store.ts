import type { Link, Space } from "@/lib/db.types";
import { atom, createStore } from "jotai";

export const allPostsAtom = atom<Link[] | null>(null);

export const searchTextAtom = atom<string>("");
export const searchResultAtom = atom<Link[]>([]);
export const searchFetchingAtom = atom(false);

export const spacesAtom = atom<Space[] | null>(null);

export const store = createStore();
