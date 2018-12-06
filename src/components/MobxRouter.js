// eslint-disable-next-line
import React from 'react';
import { observer, inject } from 'mobx-react';

const MobxRouterBase = ({ store: { router } }) =>
    router.currentView && router.currentView.component ? (
        router.currentView.component
    ) : (
        <div />
    );

export const MobxRouter = inject('store')(observer(MobxRouterBase));
