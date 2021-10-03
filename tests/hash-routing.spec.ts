import { routes } from './mocks/routes';
import { RootStore } from './mocks/store';
import { startRouter } from '../src';

const rootStore = new RootStore();

test('Hash routing Scenario', () => {
    startRouter(routes, rootStore, {
        html5history: false,
    });
    const { router } = rootStore;

    router.goTo(routes.home);

    expect(router.currentPath).toBe('/');
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#/');

    router.goTo(routes.profile, { username: 'kitze' }, { id: '123' });
    expect(router.currentPath).toBe('/profile/kitze?id=123');
    expect(window.location.pathname).toBe('/');
    expect(window.location.hash).toBe('#/profile/kitze?id=123');
});
