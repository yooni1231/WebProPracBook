import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/도서 관리/i);
  expect(headerElement).toBeInTheDocument();
});
