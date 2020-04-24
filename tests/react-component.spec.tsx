// eslint-disable-next-line
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Route } from '../src/route';
import { RouterStore } from '../src/router-store';
import { render, fireEvent, waitFor } from '@testing-library/react';

const router = new RouterStore();
const store = {
    router
};

// eslint-disable-next-line
const UserProfile = observer(() => {
    const { router } = store;

    return (
        <div>
            <button
                name="tab1-button"
                onClick={() =>
                    router.goTo(routes.profile, { username: 'john', tab: 'tab1' })
                }
            >
                Tab 1
            </button>
            <button
                data-testid="tab2-button"
                name="tab2-button"
                onClick={() =>
                    router.goTo(routes.profile, { username: 'john', tab: 'tab2' })
                }
            >
                Tab 2
            </button>

            {router.params.tab === 'tab1' && <div id="tab">Tab 1 Content</div>}
            {router.params.tab === 'tab2' && <div id="tab">Tab 2 Content</div>}
        </div>
    );
});

const routes = {
    profile: new Route<typeof store, { username: string, tab: string }>({
        path: '/profile/:username/:tab',
        component: <UserProfile />
    })
};

test('UserProfile changes tabs when a tab button is clicked', async() => {
    // Set up router state to point to profile page and tab 1
    router.goTo(routes.profile, { username: 'john', tab: 'tab1' });

    const { getByTestId, getByText, findByText } = render(<UserProfile />);
    const buttonTab2El = await getByTestId("tab2-button");

    expect(getByText("Tab 1 Content")).not.toBeNull();

    fireEvent.click(buttonTab2El);

    await waitFor(() => findByText("Tab 2 Content"));
});
