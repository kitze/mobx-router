# Changelog for mobx-router

## 0.2.7 (unreleased)

Breaking changes:
  - RouterStore requires mobx store to be passed into its constructor. -> 4aab7a92146e3798f74c23848bd2085dc19d1ce5

```
class RootStore {
    public router: RouterStore<RootStore>;

    constructor() {
        this.router = new RouterStore<RootStore>(this);
    }
}

const store = new RootStore();
```
  - MobxRouter component now requires a mobx store as a prop -> 7e4cb8b7bd1b281b69a7063e7240e8385fa304e8

```
<MobxRouter store={store} />
```

  - Link component: renamed `view` prop to `route`

  - Renamed public property `currentView` of RouterStore to `currentRoute`. -> f5ce4942992f74231ac82cd38310525b935857c6

  - Removed goTo method from Route object. Use `store.router.goTo(Route, ...)` instead.

  - `goTo` signature changed from 4 to 3 arguments. Passing through the entire `store` is no longer required here.

Features:

  - Typescript support -> 42d48a398a8f9c17be19d7e9c8832e6187c60f03



## 0.20.0 (2019)

  - initial version