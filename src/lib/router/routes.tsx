import React from 'react';
import type { PathRouteProps } from 'react-router-dom';

const Home = React.lazy(() => import('lib/pages/home'));
const ExploreDapps = React.lazy(() => import('lib/pages/dapps'));
const ExploreBlockchains = React.lazy(() => import('lib/pages/blockchains'));
const ExploreAssets = React.lazy(() => import('lib/pages/assets'));
const ExploreNodes = React.lazy(() => import('lib/pages/nodes'));
const BecomePioneer = React.lazy(() => import('lib/pages/pioneers'));
const Explore = React.lazy(() => import('lib/pages/explore'));
const Chart = React.lazy(() => import('lib/pages/chart'));

export const routes: Array<PathRouteProps> = [
  {
    path: '/',
    element: <Explore />,
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
    element: <Home />,
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
