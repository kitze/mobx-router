import { RouterStore } from '../../src/router-store';

export class RootStore {
    public router: RouterStore<RootStore>;

    constructor() {
        this.router = new RouterStore<RootStore>(this);
    }
}
