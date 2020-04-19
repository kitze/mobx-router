// eslint-disable-next-line
import React from 'react';
import { observer } from 'mobx-react';

export const MobxRouter = observer(({ store: { router } }) =>
    router.currentView && router.currentView.component ? (
        router.currentView.component
    ) : (
        <div />
    )
);
