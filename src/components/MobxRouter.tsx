import * as React from 'react';
import { observer, inject } from 'mobx-react';

const MobxRouter = ({ store: { router } }: any) => <div>{router.currentView && router.currentView.component}</div>;
export default inject('store')(observer(MobxRouter));
