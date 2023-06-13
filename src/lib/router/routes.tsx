import React from "react";
import type { PathRouteProps } from "react-router-dom";

const Home = React.lazy(() => import("lib/pages/home"));
const ExploreDapps = React.lazy(() => import("lib/pages/dapps"));
const ExploreBlockchains = React.lazy(() => import("lib/pages/blockchains"));
const ExploreAssets = React.lazy(() => import("lib/pages/assets"));
const ExploreNodes = React.lazy(() => import("lib/pages/nodes"));
const BecomePioneer = React.lazy(() => import("lib/pages/pioneer"));

export const routes: Array<PathRouteProps> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/explore-dapps",
    element: <ExploreDapps />,
  },
  {
    path: "/explore-blockchains",
    element: <ExploreBlockchains />,
  },
  {
    path: "/explore-assets",
    element: <ExploreAssets />,
  },
  {
    path: "/explore-nodes",
    element: <ExploreNodes />,
  },
  {
    path: "/become-pioneer",
    element: <BecomePioneer />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [];
