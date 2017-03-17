import RouterStore from '../src/router-store';
import routes from './mocks/routes';
import mocks from './mocks/mocks';

test('Router Scenario', () => {

  const router = new RouterStore();
  router.currentView = routes.home;

  expect(router.currentPath).toBe('/');

  router.goTo(routes.profile, {username: 'kitze'});

  expect(mocks.exitingHome).toBeCalled();
  expect(router.currentPath).toBe('/profile/kitze');
  expect(mocks.changingParamsProfile).toHaveBeenCalledTimes(0);
  expect(mocks.enteringProfile).lastCalledWith({username: 'kitze'});

  router.goTo(routes.profile, {username: 'kristijan'});

  expect(router.currentPath).toBe('/profile/kristijan');
  expect(mocks.enteringProfile).toHaveBeenCalledTimes(1);
  expect(mocks.changingParamsProfile).lastCalledWith({username: 'kristijan'}, undefined);
  expect(mocks.changingParamsProfile).toHaveBeenCalledTimes(1);

  router.goTo(routes.profile, {username: 'kristijan', tab: 'about'});

  expect(router.currentPath).toBe('/profile/kristijan/about');
  expect(mocks.enteringProfile).toHaveBeenCalledTimes(1);
  expect(mocks.changingParamsProfile).lastCalledWith({tab: 'about', username: 'kristijan'}, undefined);
  expect(mocks.changingParamsProfile).toHaveBeenCalledTimes(2);

  router.goTo(routes.home);

  expect(router.currentPath).toBe('/');
  expect(mocks.exitingProfile).toBeCalled();
  expect(mocks.exitingProfile).lastCalledWith({tab: 'about', username: 'kristijan'});
  expect(mocks.enteringHome).toBeCalled();
  expect(mocks.enteringHome).lastCalledWith();
  expect(mocks.changingParamsHome).not.toBeCalled();
  expect(mocks.changingParamsProfile).toHaveBeenCalledTimes(2);
});

test('Async router', async () => {
  const router = new RouterStore();
  router.currentView = routes.home;

  await router.goTo(routes.asyncRoute);
  expect(router.currentPath).toBe(routes.asyncRoute.path);
})

test('Async router reject', async () => {
  const router = new RouterStore();
  router.currentView = routes.home;

  try {
    await router.goTo(routes.asyncRouteFailed);
  } catch (e) {
    expect(router.currentPath).toBe(routes.home.path);
  }
})
