import React, { useState } from 'react';
import { Navbar, type NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AccommodationsPage } from './pages/AccommodationsPage';
import { AvailabilityMatrix } from './components/matrix/AvailabilityMatrix';
import { SocialProofReviews } from './components/reviews/SocialProofReviews';
import { AdminCalendarPage } from './pages/AdminCalendarPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('landing');

  return (
    <div className="min-h-screen flex flex-col bg-stone-light text-stone-charcoal font-sans antialiased">
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="flex-1">
        {currentTab === 'landing' && (
          <HomePage onNavigateToAccommodations={() => setCurrentTab('accommodations')} />
        )}
        {currentTab === 'accommodations' && (
          <AccommodationsPage onGoHome={() => setCurrentTab('landing')} />
        )}
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
