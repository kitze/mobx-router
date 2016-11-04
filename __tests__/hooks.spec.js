import React from 'react';
import Route from '../src/route';
import RouterStore from '../src/router-store';

test('Router Scenario', () => {

  const mocks = {
    enteringHome: jest.fn(),
    exitingHome: jest.fn(),
    enteringProfile: jest.fn(),
    exitingProfile: jest.fn(),
    changingParamsProfile: jest.fn(),
    changingParamsHome: jest.fn()
  };

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
      onEnter: () => {
        mocks.enteringProfile();
      },
      onExit: () => {
        mocks.exitingProfile();
      },
      onParamsChange: () => {
        mocks.changingParamsProfile();
      }
    })
  };

  const router = new RouterStore();


  router.currentView = routes.home;

  expect(router.currentPath).toBe('/');

  router.goTo(routes.profile, {username: 'kitze'});

  expect(router.currentPath).toBe('/profile/kitze');
  expect(mocks.exitingHome).toBeCalled();

  router.goTo(routes.profile, {username: 'kristijan'});

  expect(router.currentPath).toBe('/profile/kristijan');
  expect(mocks.enteringProfile).toBeCalled();
  expect(mocks.changingParamsProfile).toHaveBeenCalledTimes(1);

  router.goTo(routes.profile, {username: 'kristijan', tab: 'about'});

  expect(router.currentPath).toBe('/profile/kristijan/about');
  expect(mocks.enteringProfile).toHaveBeenCalledTimes(1);
  expect(mocks.changingParamsProfile).toHaveBeenCalledTimes(2);

  router.goTo(routes.home);

  expect(router.currentPath).toBe('/');
  expect(mocks.exitingProfile).toBeCalled();
  expect(mocks.enteringHome).toBeCalled();
  expect(mocks.changingParamsHome).not.toBeCalled();
  expect(mocks.changingParamsProfile).toHaveBeenCalledTimes(2);

});