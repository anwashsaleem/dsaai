import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MainApp } from './components/MainApp';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);

  if (!hasOnboarded) {
    return <OnboardingScreen onStart={() => setHasOnboarded(true)} />;
  }

  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
