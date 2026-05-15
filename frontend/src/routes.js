import lazy from './utils/lazy';

const Releases = lazy(
  () => import(/* webpackChunkName: 'Releases' */ './views/Releases'),
);
const NewRelease = lazy(
  () => import(/* webpackChunkName: 'NewRelease' */ './views/NewRelease'),
);
const NewXPIRelease = lazy(
  () => import(/* webpackChunkName: 'NewXPIRelease' */ './views/NewXPIRelease'),
);
const NewMergeAutomation = lazy(
  () =>
    import(
      /* webpackChunkName: 'NewMergeAutomation' */ './views/NewMergeAutomation'
    ),
);
const ListMergeAutomation = lazy(
  () =>
    import(
      /* webpackChunkName: 'ListMergeAutomation' */ './views/ListMergeAutomation'
    ),
);
const Nightlies = lazy(
  () => import(/* webpackChunkName: 'Nightlies' */ './views/Nightlies'),
);
const NewNightlyBuild = lazy(
  () =>
    import(
      /* webpackChunkName: 'NewNightlyBuild' */ './views/NewNightlyBuild'
    ),
);

export default [
  {
    component: Releases,
    path: '/',
    exact: true,
  },
  {
    component: Releases,
    path: '/recent',
    recent: true,
  },
  {
    component: Releases,
    path: '/recentxpi',
    recent: true,
    xpi: true,
  },
  {
    component: Releases,
    path: '/xpi',
    recent: false,
    xpi: true,
  },
  {
    component: NewRelease,
    path: '/new',
    requiresAuth: true,
  },
  {
    component: NewXPIRelease,
    path: '/newxpi',
    requiresAuth: true,
  },
  {
    component: ListMergeAutomation,
    path: '/merge-automation',
  },
  {
    component: NewMergeAutomation,
    path: '/merge-automation/new',
    requiresAuth: true,
  },
  {
    component: Nightlies,
    path: '/nightlies',
  },
  {
    component: NewNightlyBuild,
    path: '/nightlies/new',
    requiresAuth: true,
  },
];
