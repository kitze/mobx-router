import Route from '../../src/route';
import mocks from './mocks';
import React from 'react';

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
    onParamsChange: (route, params) => {
      mocks.changingParamsProfile(params);
    }
  })
};

export default routes;