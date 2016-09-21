import {mapAndFilter, viewsForDirector} from '../src/utils';
import React from 'react';
import Route from '../src/route';

test('mapAndFilter', () => {
  const users = [
    {
      name: 'Kitze',
      age: 17
    },
    {
      name: 'Sherlock',
      age: 20
    }
  ];

  const result = mapAndFilter(users, u => u.age > 18, u => `${u.name} can drink`);
  expect(result.length).toBe(1);
  expect(result[0]).toBe('Sherlock can drink');
});

test('viewsForDirector', () => {
  const views = {
    home: new Route({
      path: '/',
      component: <div/>
    }),
    userProfile: new Route({
      path: '/profile/:username/:tab',
      component: <div/>,
    }),
    gallery: new Route({
      path: '/gallery',
      component: <div/>
    }),
  };

  const result = viewsForDirector(views, {});
  const keys = Object.keys(result);
  const values = keys.map(k => result[k]);

  expect(keys).toEqual(['/', '/profile/:username/:tab', '/gallery']);
  values.forEach(value => {
    expect(typeof value).toEqual('function');
  });

});