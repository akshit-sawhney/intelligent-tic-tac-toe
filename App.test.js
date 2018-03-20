import React from 'react';
import App1 from './App';

import renderer from 'react-test-renderer';

it('renders without crashing', () => {
  const rendered = renderer.create(<App1 />).toJSON();
  expect(rendered).toBeTruthy();
});
