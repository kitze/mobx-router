/// <reference types="react" />
import { Route } from '../../index';
export declare type Props = {
    view: Route;
    className: string;
    params: any;
    queryParams: any;
    store: any;
    refresh: boolean;
    style: any;
    children: any;
    title: any;
    router: any;
};
export declare const Link: ({view, className, params, queryParams, store, refresh, style, children, title, router}: Props) => void | JSX.Element;
declare const _default: any;
export default _default;
