import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock the GameWrapper component since it depends on Three.js
jest.mock('@/components/game/GameWrapper', () => {
  return function MockGameWrapper() {
    return <div data-testid="game-wrapper">Game Wrapper</div>;
  };
});

describe('Home Page', () => {
  it('should render the GameWrapper component', () => {
    render(<Home />);
    expect(screen.getByTestId('game-wrapper')).toBeInTheDocument();
  });

  it('should render without errors', () => {
    const { container } = render(<Home />);
    expect(container).toBeTruthy();
  });
});
