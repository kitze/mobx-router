// eslint-disable-next-line
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Route, RouteParams, QueryParams } from '../route';
import { Store, RouterStore } from '../router-store';

const LinkBase = <S extends Store, P extends RouteParams, Q extends QueryParams>({
    route,
    className,
    params,
    queryParams,
    refresh = false,
    style = {},
    children,
    title,
    router,
}: React.PropsWithChildren<{
    route: Route<S, P, Q>,
    className?: string,
    params?: P,
    queryParams?: Q,
    refresh?: boolean,
    style?: React.StyleHTMLAttributes<HTMLAnchorElement>,
    title?: string,
    router: RouterStore<S>,
}>) => {
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
                    router.goTo(route, params, queryParams);
                }
            }}
            href={route.replaceUrlParams(params, queryParams)}
        >
            {title || children}
        </a>
    );
};

export const Link = observer(LinkBase);
