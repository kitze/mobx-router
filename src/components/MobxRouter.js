// eslint-disable-next-line
import React from 'react';
import { observer, inject } from 'mobx-react';

const MobxRouterBase = ({ store: { router } }) => {
    router.currentView && router.currentView.component ? (
        outer.currentView.component
    ) : (
        <div />
    );
};

export const MobxRouter = inject('store')(observer(MobxRouterBase));
