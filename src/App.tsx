import { useState, useEffect } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MainApp } from './components/MainApp';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import FullLogo from './imports/FullLogo';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Show loading screen for 1-1.5 seconds on initial load
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1200); // 1.2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Show initial loading screen
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background flex items-center justify-center">
        <div className="animate-fade-in">
          <FullLogo className="w-48 h-auto" />
        </div>
      </div>
    );
  }

  if (!hasOnboarded) {
    return (
      <>
        <OnboardingScreen 
          onStart={() => setShowAuthModal(true)} 
          onGuestMode={() => {
            setIsGuestMode(true);
            setHasOnboarded(true);
          }}
        />
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setShowAuthModal(false);
              setHasOnboarded(true);
            }}
          />
        )}
      </>
    );
  }

  return (
    <AuthProvider>
      <MainApp isGuestMode={isGuestMode} />
      <Toaster />
    </AuthProvider>
  );
}