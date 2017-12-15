import { observer } from 'mobx-react';

const Link = ({
    view,
    className,
    params = {},
    queryParams = {},
    store = {},
    refresh = false,
    style = {},
    children,
    title = children,
    router = store.router
}) => {
    if (!router) {
        console.error(
            'The router prop must be defined for a Link component to work!'
        );
        return null;
    }
    return (
        <a
            style={style}
            className={className}
            onClick={e => {
                const middleClick = e.button === 2;
                const cmdOrCtrl = e.metaKey || e.ctrlKey;
                const openinNewTab = middleClick || cmdOrCtrl;
                const shouldNavigateManually =
                    refresh || openinNewTab || cmdOrCtrl;

                if (!shouldNavigateManually) {
                    e.preventDefault();
                    router.goTo(view, params, store, queryParams);
                }
            }}
            href={view.replaceUrlParams(params, queryParams)}
        >
            {title}
        </a>
    );
};

export default observer(Link);
