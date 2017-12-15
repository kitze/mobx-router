import React from 'react';
import {shallow} from 'enzyme';
import {observer} from 'mobx-react';
import Route from '../src/route';
import RouterStore from '../src/router-store';

const router = new RouterStore();
const store = {
    router: router
};

const UserProfile = observer(function UserProfile() {
    const {router:{params, goTo}} = store;

    return (
        <div>
            <button
                name="tab1-button"
                onClick={() => goTo(routes.profile, {username: 'john', tab: 'tab1'})}>
                Tab 1
            </button>
            <button
                name="tab2-button"
                onClick={() => goTo(routes.profile, {username: 'john', tab: 'tab2'})}>
                Tab 2
            </button>

            {params.tab === 'tab1' && <div id="tab">Tab 1 Content</div>}
            {params.tab === 'tab2' && <div id="tab">Tab 2 Content</div>}
        </div>
    );
});

const routes = {
    profile: new Route({
        path: '/profile/:username/:tab',
        component: <UserProfile />
    })
};

test('UserProfile changes tabs when a tab button is clicked', () => {
    // Set up router state to point to profile page and tab 1
    router.goTo(routes.profile, {username: 'john', tab: 'tab1'});

    // Render the UserProfile and make sure it is on tab 1
    const wrapper = shallow(<UserProfile />);
    expect(wrapper.find('#tab').text()).toEqual('Tab 1 Content');

    // Click on the tab 2 button and make sure the page switches to tab 2
    wrapper.find('[name="tab2-button"]').simulate('click');
    expect(wrapper.find('#tab').text()).toEqual('Tab 2 Content');
});
