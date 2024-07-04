import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { Provider } from "jotai";

import { ThemeProvider } from "@/components/theme-provider";

import { store } from "./atoms/store.ts";
import "./index.css";
// routes
import Auth from "./routes/auth.tsx";
import Home from "./routes/home.tsx";
import Layout from "./routes/layout.tsx";
import Loading from "./routes/loading.tsx";
import Post from "./routes/post.tsx";
import Profile from "./routes/profile.tsx";
import Root from "./routes/root.tsx";
import SpaceLayout from "./routes/space-layout.tsx";
import Space from "./routes/space.tsx";
import Spaces from "./routes/spaces.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route element={<Layout />} loader={Layout.loader}>
        <Route path="/" element={<Home />} loader={Home.loader}>
          <Route path="post/:postId" element={<Post />} />
        </Route>
      </Route>
      <Route element={<SpaceLayout />}>
        <Route path="/spaces" element={<Spaces />} loader={Spaces.loader} />
        <Route path="/spaces/:spaceId" element={<Space />} loader={Space.loader}>
          <Route path="post/:postId" element={<Post />} />
        </Route>
      </Route>
      <Route path="/auth" element={<Auth />} loader={Auth.loader} />
      <Route path="/profile" element={<Profile />} loader={Profile.loader} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} fallbackElement={<Loading className="min-h-[100dvh]" />} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
