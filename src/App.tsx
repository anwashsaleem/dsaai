import { useState, useEffect } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MainApp } from './components/MainApp';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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