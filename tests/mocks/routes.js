import Route from '../../src/route';
import mocks from './mocks';
import React from 'react';

function delay(time = 0) {
  return new Promise((resolve, reject) => setTimeout(resolve, time));
}

const routes = {
  home: new Route({
    path: '/',
    component: <div/>,
    onEnter: () => {
      mocks.enteringHome();
    },
    onExit: () => {
      mocks.exitingHome();
    },
    onParamsChange: () => {
      mocks.changingParamsHome();
    }
  }),
  profile: new Route({
    path: '/profile/:username/:tab',
    component: <div/>,
    onEnter: (route, params) => {
      mocks.enteringProfile(params);
    },
    onExit: (route, params) => {
      mocks.exitingProfile(params);
    },
    onParamsChange: (route, params, store, queryParams) => {
      mocks.changingParamsProfile(params, queryParams);
    }
  }),
  asyncProfile: new Route({
    path: '/async-profile',
    component: <div/>,
    async beforeEnter() {
      mocks.enteringAsyncProfile();
      await delay(1000);
      mocks.enteringAsyncProfileResolved();
    },
    async beforeExit() {
      mocks.exitingAsyncProfile();
      await delay(1000)
      mocks.exitingAsyncProfileResolved();
    }
  })
};

export default routes;