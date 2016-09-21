import _ from 'lodash';

export const mapAndFilter = (array, condition, modification) => _.reduce(array, (results, member) => {
  condition(member) && results.push(modification(member))
  return results;
}, []);

export const viewsForDirector = (views, store) => _.reduce(views, (obj, view) => {
  obj[view.path] = (...paramsArr) => view.goTo(store, paramsArr);
  return obj;
}, {});
