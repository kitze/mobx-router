export const isObject = obj => obj && typeof obj === 'object' && !(Array.isArray(obj));
export const getObjectKeys = obj => isObject(obj) ? Object.keys(obj) : [];

export const mapAndFilter = (array, condition, modification) => array.reduce((results, member) => {
  condition(member) && results.push(modification(member))
  return results;
}, []);

export const viewsForDirector = (views, store) => getObjectKeys(views).reduce((obj, viewKey) => {
  const view = views[viewKey];
  obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
  return obj;
}, {});