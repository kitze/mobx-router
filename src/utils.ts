export const isObject = (obj: any) => obj && typeof obj === 'object' && !(Array.isArray(obj));
export const getObjectKeys = (obj: any) => isObject(obj) ? Object.keys(obj) : [];

export const viewsForDirector = (views: any, store: any) => getObjectKeys(views).reduce((obj, viewKey) => {
  const view = views[viewKey];
  obj[view.path] = (...paramsArr: any[]) => view.goTo(store, paramsArr);
  return obj;
}, {});

export const getRegexMatches = (string: string, regexExpression: RegExp, callback: Function) => {
  let match;
  while (( match = regexExpression.exec(string) ) !== null) {
    callback(match);
  }
};