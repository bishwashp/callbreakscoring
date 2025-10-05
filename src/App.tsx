import { useEffect } from 'react';
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
import { GameHeader } from './components/GameHeader';

function App() {
  const { currentView, isLoading, loadActiveGame, currentGame } = useGameStore();
  
  useEffect(() => {
    loadActiveGame();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const showHeader = [
    'player-calls', 
    'player-results', 
    'round-summary', 
    'call-log', 
    'game-complete'
  ].includes(currentView);

  return (
    <div className="min-h-screen">
      {showHeader && <GameHeader />}
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
    </div>
  );
}

export default App;

