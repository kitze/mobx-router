import reduce from 'lodash/reduce';

export const mapAndFilter = (array, condition, modification) => reduce(array, (results, member) => {
  condition(member) && results.push(modification(member))
  return results;
}, []);

export const viewsForDirector = (views, store) => reduce(views, (obj, view) => {
  obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
  return obj;
}, {});
