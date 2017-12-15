// eslint-disable-next-line
import React from 'react';
import { observer, inject } from 'mobx-react';

const MobxRouter = ({ store: { router } }) => (
    <div>{router.currentView && router.currentView.component}</div>
);
export default inject('store')(observer(MobxRouter));
