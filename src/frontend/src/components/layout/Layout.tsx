import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: 'landing' | 'matrix' | 'reviews' | 'admin';
  onSelectTab?: (tab: 'landing' | 'matrix' | 'reviews' | 'admin') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab = 'landing', onSelectTab = () => {} }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-light text-stone-charcoal font-sans antialiased">
      <Navbar currentTab={currentTab} onSelectTab={onSelectTab} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
