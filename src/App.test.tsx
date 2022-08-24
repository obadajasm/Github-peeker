import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { store } from './store/indext';
import { Provider } from 'react-redux';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Hi there/i);
  expect(linkElement).toBeInTheDocument();
});