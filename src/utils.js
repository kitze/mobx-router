export const isObject = obj => obj && typeof obj === 'object' && !(Array.isArray(obj));
export const getObjectKeys = obj => isObject(obj) ? Object.keys(obj) : [];

export const viewsForDirector = (views, store) => getObjectKeys(views).reduce((obj, viewKey) => {
  const view = views[viewKey];
  obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
  return obj;
}, {});

export const getRegexMatches = (string, regexExpression, callback) => {
  let match;
  while (( match = regexExpression.exec(string) ) !== null) {
    callback(match);
  }
};