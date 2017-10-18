import * as React from 'react';
import {observer} from 'mobx-react';
import { Route } from '../../index';

export type Props = {
  view: Route,
  className: string;
  params: any;
  queryParams: any;
  store: any;
  refresh: boolean;
  style: any;
  children: any;
  title: any;
  router: any;
}

const Link = ({view, className, params = {}, queryParams = {}, store = {}, refresh = false, style = {}, children, title = children, router = store.router}: Props) => {
  if (!router) {
    return console.error('The router prop must be defined for a Link component to work!')
  }
  return (<a
      style={style}
      className={className}
      onClick={(e: any) => {
        const middleClick = e.which == 2;
        const cmdOrCtrl = (e.metaKey || e.ctrlKey);
        const openinNewTab = middleClick || cmdOrCtrl;
        const shouldNavigateManually = refresh || openinNewTab || cmdOrCtrl;

        if (!shouldNavigateManually) {
          e.preventDefault();
          router.goTo(view, params, store, queryParams);
        }
      }}
      href={view.replaceUrlParams(params, queryParams)}>
      {title}
    </a>
  )
}

export default observer(Link as any);