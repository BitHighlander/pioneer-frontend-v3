import React from 'react';
import type { PathRouteProps } from 'react-router-dom';

const Home = React.lazy(() => import('web/pages/home'));
const ExploreDapps = React.lazy(() => import('web/pages/dapps'));
const ExploreBlockchains = React.lazy(() => import('web/pages/blockchains'));
const ExploreAssets = React.lazy(() => import('web/pages/assets'));
const ExploreNodes = React.lazy(() => import('web/pages/nodes'));
const BecomePioneer = React.lazy(() => import('web/pages/pioneers'));
const Explore = React.lazy(() => import('web/pages/explore'));
const Chart = React.lazy(() => import('web/pages/chart'));

export const routes: Array<PathRouteProps> = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dapps',
    element: <ExploreDapps />,
  },
  {
    path: '/blockchains',
    element: <ExploreBlockchains />,
  },
  {
    path: '/assets',
    element: <ExploreAssets />,
  },
  {
    path: '/explore',
    element: <Explore />,
  },
  {
    path: '/chart',
    element: <Chart />,
  },
  {
    path: '/nodes',
    element: <ExploreNodes />,
  },
  {
    path: '/pioneers',
    element: <BecomePioneer />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [];
