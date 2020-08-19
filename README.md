### 🙋‍♂️ Made by [@thekitze](https://twitter.com/thekitze)

### Other projects:
- 🏫 [React Academy](https://reactacademy.io) - Interactive React and GraphQL workshops
- 💌 [Twizzy](https://twizzy.app) - A standalone app for Twitter DM
- 💻 [Sizzy](https://sizzy.co) - A tool for testing responsive design on multiple devices at once
- 🤖 [JSUI](https://github.com/kitze/JSUI) - A powerful UI toolkit for managing JavaScript apps

---

# 〽️ MobX Router

### Example usage
* [Demo project](http://mobx-router-example.netlify.com/)
* [Demo project repo](https://github.com/kitze/mobx-router-example)
* [Demo project repo with typescript](https://github.com/thdk/mobx-router-typescript-example)

## Inspiration
[📖 How to decouple state and UI - a.k.a. you don’t need componentWillMount](https://medium.com/@mweststrate/how-to-decouple-state-and-ui-a-k-a-you-dont-need-componentwillmount-cc90b787aa37#.k9tvf5nga)

## Features
- Decoupled state from UI
- Central route configuration
- URL changes are triggering changes directly in the store, and vice-versa
- No need to use component lifecycle methods like `componentWillMount` to fetch data or trigger a side effect in the store
- Supported callbacks for the routes are: `beforeEnter`, `onEnter`, `beforeExit`, `onExit`. All of the callbacks receive `route`, `params`, `store`, and `queryParams` as parameters. If the `beforeExit` or `beforeEnter` methods return `false` the navigation action will be prevented.
- The current URL params and query params are accessible directly in the store `store.router.params` / `store.router.queryParams` so basically they're available everywhere without any additional wrapping or HOC.
- Navigating to another route happens by calling the `goTo` method on the router store, and the changes in the url are reflected automatically. So for example you can call `router.goTo(routes.book, {id:5, page:3})` and after the change is made in the store, the URL change will follow. You never directly manipulate the URL or the history object.
- `<Link>` component which also populates the href attribute and works with `middle click` or `cmd/ctrl + click`
- Typescript support (Converted to typescript by [thdk](https://github.com/thdk))
- Hash-based routing (using paths like `/#/foo/bar`) support

### Implementation
```js
import React, {createContext} from 'react';
import ReactDOM from 'react-dom';

import {MobxRouter, RouterStore, startRouter} from 'mobx-router';
import routes from 'config/routes';

//example mobx store
export class AppStore {
    title = 'MobX Router Example App',
    user = null
}

export class RootStore {
    public router: RouterStore<RootStore>;
    public app: AppStore;

    constructor() {
        this.router = new RouterStore<RootStore>(this);
        this.app = new AppStore();
    }
}

const store = new RootStore();

// Use React context to make your store available in your application
const StoreContext = createContext({});
const StoreProvider = StoreContext.Provider;

startRouter(routes, store);

ReactDOM.render(
  <StoreProvider value={store}>
  	<MobxRouter store={store}/>
  </StoreProvider>, document.getElementById('root')
)
```

### Example config

/config/routes.js

```js
import React from 'react';

//models
import {Route} from 'mobx-router';

//components
import Home from 'components/Home';
import Document from 'components/Document';
import Gallery from 'components/Gallery';
import Book from 'components/Book';
import UserProfile from 'components/UserProfile';

const routes = {
  home: new Route({
    path: '/',
    component: <Home/>
  }),
  userProfile: new Route({
    path: '/profile/:username/:tab',
    component: <UserProfile/>,
    onEnter: () => {
      console.log('entering user profile!');
    },
    beforeExit: () => {
      console.log('exiting user profile!');
    },
    onParamsChange: (route, params, store) => {
      console.log('params changed to', params);
    }
  }),
  gallery: new Route({
    path: '/gallery',
    component: <Gallery/>,
    onEnter: (route, params, store, queryParams) => {
    	store.gallery.fetchImages();
    	console.log('current query params are -> ', queryParams);
    },
    beforeExit: () => {
      const result = confirm('Are you sure you want to leave the gallery?');
      return result;
    }
  }),
  document: new Route({
    path: '/document/:id',
    component: <Document/>,
    beforeEnter: (route, params, store) => {
      const userIsLoggedIn = store.app.user;
      if (!userIsLoggedIn) {
        alert('Only logged in users can enter this route!');
        return false;
      }
    },
    onEnter: (route, params) => {
      console.log(`entering document with params`, params);
    }
  }),
  book: new Route({
    path: '/book/:id/page/:page',
    component: <Book/>,
    onEnter: (route, params, store) => {
      console.log(`entering book with params`, params);
      store.app.setTitle(route.title);
    }
  })
};
export default routes;
```

### Hash-based routing
Just add option for `startRouter` (no need to include `#` in route paths).
```js
startRouter(routes, store, {
  html5history: false
});
```
