import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { LanguageProvider } from '../../context/LanguageContext';
import { describe, it, expect } from 'vitest';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  );
};

describe('Header', () => {
  it('renders the logo text correctly', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('SkySearch')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Flights')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
