import React, {Component} from 'react';
import {observer} from 'mobx-react';

const MobxRouter = ({store:{router}}) => <div>{router.currentView && router.currentView.component}</div>;
export default observer(['store'], MobxRouter);