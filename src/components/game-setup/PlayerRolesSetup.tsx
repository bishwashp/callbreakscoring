import { useState, useEffect } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { Crown } from 'lucide-react';
import { SimpleTouchDrag } from '@/components/ui/simple-touch-drag';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function PlayerRolesSetup() {
  const { currentGame, setInitialDealer, updateSeatingOrder, setView, goToPreviousView } = useGameStore();
  const [selectedDealer, setSelectedDealer] = useState(0);
  const [players, setPlayers] = useState(currentGame?.players || []);

  // Update local players state when currentGame.players changes
  useEffect(() => {
    if (currentGame?.players) {
      setPlayers(currentGame.players);
      setSelectedDealer(0); // Reset dealer selection for new game
    }
  }, [currentGame?.players]);

  const handleReorder = (newPlayers: typeof players) => {
    setPlayers(newPlayers);
    
    // Update dealer index if the dealer was moved
    const oldDealerId = players[selectedDealer]?.id;
    const newDealerIndex = newPlayers.findIndex(p => p.id === oldDealerId);
    if (newDealerIndex !== -1) {
      setSelectedDealer(newDealerIndex);
    }
  };

  const handleSubmit = () => {
    updateSeatingOrder(players);
    setInitialDealer(selectedDealer);
    setView('stakes-setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedCard variant="elevated" className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-white">Player Roles</CardTitle>
          <CardDescription className="text-center text-white/80">
            Drag grip icon to arrange seating • Tap player to assign dealer
          </CardDescription>
          <div className="text-center text-xs text-white/60">
            Current dealer: {selectedDealer + 1} ({players[selectedDealer]?.name || 'Unknown'})
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <SimpleTouchDrag
            items={players}
            onReorder={handleReorder}
          >
            {(player, index) => (
              <div 
                className="flex items-center justify-between w-full"
              >
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={(e) => {
                    console.log('DEALER CLICK EVENT FIRED:', index, player.name, e.target);
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedDealer(index);
                  }}
                  onTouchEnd={(e) => {
                    console.log('Dealer selection touched:', index, player.name);
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedDealer(index);
                  }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    selectedDealer === index ? 'bg-primary text-white' : 'bg-white text-gray-700'
                  }`}>
                    {player.name.charAt(0).toUpperCase() || `P${index + 1}`}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">{player.name || `Player ${index + 1}`}</p>
                    <p className="text-xs text-white/60">Seat {index + 1}</p>
                  </div>
                </div>
                {selectedDealer === index && (
                  <div className="flex items-center space-x-2 text-primary">
                    <Crown className="h-5 w-5 fill-current" />
                    <span className="text-sm font-semibold">Dealer</span>
                  </div>
                )}
              </div>
            )}
          </SimpleTouchDrag>
          
          <div className="bg-blue-50/90 backdrop-blur-sm border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Use grip icon (⋮⋮) to drag players into correct seating order (clockwise). Tap player name to make them dealer.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <AnimatedButton
              onClick={goToPreviousView}
              variant="secondary"
              className="flex-1"
            >
              Back
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSubmit}
              variant="primary"
              className="flex-1"
            >
              Continue
            </AnimatedButton>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  );
}