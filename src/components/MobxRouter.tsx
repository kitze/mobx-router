// eslint-disable-next-line
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Store } from '../router-store';

type Props = { store: Store };

export const MobxRouter = observer(({ store: { router } }: Props) => {
    return (
        <>
            {
                router.currentView && router.currentView.component
                    ? (
                        router.currentView.component
                    )
                    : (
                        <div />
                    )
            }
        </>
    );
});
