import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AvailabilityMatrix } from './components/matrix/AvailabilityMatrix';
import { SocialProofReviews } from './components/reviews/SocialProofReviews';
import { AdminCalendarPage } from './pages/AdminCalendarPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'landing' | 'matrix' | 'reviews' | 'admin'>('landing');

  return (
    <div className="min-h-screen flex flex-col bg-stone-light text-stone-charcoal font-sans antialiased">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-1">
        {currentTab === 'landing' && <HomePage />}
        {currentTab === 'matrix' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AvailabilityMatrix />
          </div>
        )}
        {currentTab === 'reviews' && <SocialProofReviews />}
        {currentTab === 'admin' && <AdminCalendarPage />}
      </main>

      <Footer />
    </div>
  );
};

export default App;
