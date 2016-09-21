export const mapAndFilter = (array, condition, modification) => array.reduce((results, member) => {
  condition(member) && results.push(modification(member))
  return results;
}, []);

export const viewsForDirector = (views, store) => Object.keys(views).reduce((obj, viewKey) => {
  const view = views[viewKey];
  obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
  return obj;
}, {});
