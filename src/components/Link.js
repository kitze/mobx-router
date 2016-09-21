import React, {Component} from 'react';
import {observer} from 'mobx-react';

const Link = ({view, params = {}, store = {}, removeStyle = false, refresh = false, style = {}, children, title = children, router = store.router}) => {
  if (!router) {
    return console.error('The router prop must be defined for a Link component to work!')
  }
  return (<a
      style={{...removeStyle && {textDecoration: 'none', color: 'black', ...style}}}
      onClick={e => {
        const middleClick = e.which == 2;
        const cmdOrCtrl = (e.metaKey || e.ctrlKey);
        const openinNewTab = middleClick || cmdOrCtrl;
        const shouldNavigateManually = refresh || openinNewTab || cmdOrCtrl;

        if (!shouldNavigateManually) {
          e.preventDefault();
          router.goTo(view, params, store);
        }
      }}
      href={view.replaceUrlParams(params)}>
      {title}
    </a>
  )
}

export default observer(Link);