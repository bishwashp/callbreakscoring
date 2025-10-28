import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { HomeScreen } from './components/HomeScreen';
import { PlayerCountSelector } from './components/game-setup/PlayerCountSelector';
import { PlayerDetailsForm } from './components/game-setup/PlayerDetailsForm';
import { PlayerRolesSetup } from './components/game-setup/PlayerRolesSetup';
import { StakesSetup } from './components/game-setup/StakesSetup';
import { CallEntry } from './components/gameplay/CallEntry';
import { ResultEntry } from './components/gameplay/ResultEntry';
import { RoundSummary } from './components/gameplay/RoundSummary';
import { CallLog } from './components/gameplay/CallLog';
import { GameComplete } from './components/gameplay/GameComplete';
import { GameHistory } from './components/GameHistory';
import { CardBackground } from './components/ui/card-background';
import { PageTransition, StaggeredChildren } from './components/ui/page-transition';
import { CardLoadingSpinner } from './components/ui/page-transition';
import { HamburgerMenu } from './components/ui/hamburger-menu';

function App() {
  const { currentView, isLoading, loadActiveGame, currentGame } = useGameStore();
  
  useEffect(() => {
    loadActiveGame();
  }, []);

  if (isLoading) {
    return (
      <CardBackground variant="table">
        <CardLoadingSpinner />
      </CardBackground>
    );
  }

  // Determine background variant based on current view
  const getBackgroundVariant = () => {
    if (['home', 'game-history'].includes(currentView)) return 'elegant';
    if (['player-count', 'player-details', 'player-roles', 'stakes-setup'].includes(currentView)) return 'casino';
    return 'table';
  };

  // Determine transition direction based on view flow
  const getTransitionDirection = () => {
    const setupViews = ['player-count', 'player-details', 'player-roles', 'stakes-setup'];
    const gameplayViews = ['player-calls', 'player-results', 'round-summary', 'call-log'];
    
    if (setupViews.includes(currentView)) return 'right';
    if (gameplayViews.includes(currentView)) return 'left';
    if (currentView === 'game-complete') return 'scale';
    return 'fade';
  };

  return (
    <CardBackground variant={getBackgroundVariant()}>
      <HamburgerMenu />
      <AnimatePresence mode="wait">
        <PageTransition 
          key={currentView} 
          direction={getTransitionDirection()}
          className="px-4 py-6"
        >
          <StaggeredChildren delay={0.1}>
            {currentView === 'home' && <HomeScreen />}
            {currentView === 'player-count' && <PlayerCountSelector />}
            {currentView === 'player-details' && <PlayerDetailsForm />}
            {currentView === 'player-roles' && <PlayerRolesSetup key={currentGame?.id} />}
            {currentView === 'stakes-setup' && <StakesSetup />}
            {currentView === 'player-calls' && <CallEntry />}
            {currentView === 'player-results' && <ResultEntry />}
            {currentView === 'round-summary' && <RoundSummary />}
            {currentView === 'call-log' && <CallLog />}
            {currentView === 'game-complete' && <GameComplete />}
            {currentView === 'game-history' && <GameHistory />}
          </StaggeredChildren>
        </PageTransition>
      </AnimatePresence>
    </CardBackground>
  );
}

export default App;

