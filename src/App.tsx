import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuditConsole from './components/AuditConsole';
import FooterPagesReader from './components/FooterPages';

export default function App() {
  // Toggle between Landing Page, Console, and technical compliance pages
  const [showConsole, setShowConsole] = useState(false);
  const [activeSubPage, setActiveSubPage] = useState<'privacy' | 'terms' | 'security' | 'compliance' | 'why' | null>(null);

  // Sync state with URL paths and hashes for direct linking & browser navigation support
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path === '/privacy' || hash === '#privacy') {
        setActiveSubPage('privacy');
        setShowConsole(false);
      } else if (path === '/terms' || hash === '#terms') {
        setActiveSubPage('terms');
        setShowConsole(false);
      } else if (path === '/security' || hash === '#security') {
        setActiveSubPage('security');
        setShowConsole(false);
      } else if (path === '/compliance' || hash === '#compliance') {
        setActiveSubPage('compliance');
        setShowConsole(false);
      } else if (path === '/why-aiec' || path === '/why' || hash === '#why-aiec' || hash === '#why') {
        setActiveSubPage('why');
        setShowConsole(false);
      } else if (path === '/console' || hash === '#console') {
        setShowConsole(true);
        setActiveSubPage(null);
      } else {
        setActiveSubPage(null);
        setShowConsole(false);
      }
      window.scrollTo(0, 0);
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);

    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, []);

  const navigateToHome = () => {
    setActiveSubPage(null);
    setShowConsole(false);
    window.scrollTo(0, 0);
    window.history.pushState(null, '', '/');
  };

  const navigateToConsole = () => {
    setShowConsole(true);
    setActiveSubPage(null);
    window.scrollTo(0, 0);
    window.history.pushState(null, '', '#console');
  };

  const navigateToSubPage = (subPage: 'privacy' | 'terms' | 'security' | 'compliance' | 'why') => {
    setActiveSubPage(subPage);
    setShowConsole(false);
    window.scrollTo(0, 0);
    if (subPage === 'why') {
      window.history.pushState(null, '', '/why-aiec');
    } else {
      window.history.pushState(null, '', `/${subPage}`);
    }
  };

  if (showConsole) {
    return <AuditConsole onBackToLanding={navigateToHome} />;
  }

  if (activeSubPage) {
    return (
      <FooterPagesReader 
        initialTab={activeSubPage}
        onClose={navigateToHome}
        onEnterConsole={navigateToConsole}
      />
    );
  }

  return (
    <LandingPage 
      onEnterConsole={navigateToConsole} 
      onEnterSubPage={navigateToSubPage}
    />
  );
}
