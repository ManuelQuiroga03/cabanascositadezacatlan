import React from 'react';
import { Navbar, type NavTab } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentTab?: NavTab;
  onSelectTab?: (tab: NavTab) => void;
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
