import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { Crown, GripVertical } from 'lucide-react';

export function PlayerRolesSetup() {
  const { currentGame, setInitialDealer, updateSeatingOrder, setView, goToPreviousView } = useGameStore();
  const [selectedDealer, setSelectedDealer] = useState(0);
  const [players, setPlayers] = useState(currentGame?.players || []);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Update local players state when currentGame.players changes
  useEffect(() => {
    if (currentGame?.players) {
      setPlayers(currentGame.players);
      setSelectedDealer(0); // Reset dealer selection for new game
    }
  }, [currentGame?.players]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newPlayers = [...players];
    const draggedPlayer = newPlayers[draggedIndex];
    
    // Remove from old position
    newPlayers.splice(draggedIndex, 1);
    // Insert at new position
    newPlayers.splice(index, 0, draggedPlayer);
    
    setPlayers(newPlayers);
    
    // Update dealer index if needed
    if (draggedIndex === selectedDealer) {
      setSelectedDealer(index);
    } else if (draggedIndex < selectedDealer && index >= selectedDealer) {
      setSelectedDealer(selectedDealer - 1);
    } else if (draggedIndex > selectedDealer && index <= selectedDealer) {
      setSelectedDealer(selectedDealer + 1);
    }
    
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = () => {
    updateSeatingOrder(players);
    setInitialDealer(selectedDealer);
    setView('stakes-setup');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Player Roles</CardTitle>
          <CardDescription>Drag to arrange seating • Tap to assign dealer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {players.map((player, index) => (
              <div
                key={player.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedDealer(index)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-move ${
                  selectedDealer === index
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    selectedDealer === index ? 'bg-primary text-white' : 'bg-gray-100'
                  }`}>
                    {player.name.charAt(0).toUpperCase() || `P${index + 1}`}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{player.name || `Player ${index + 1}`}</p>
                    <p className="text-xs text-gray-500">Seat {index + 1}</p>
                  </div>
                </div>
                {selectedDealer === index && (
                  <div className="flex items-center space-x-2 text-primary">
                    <Crown className="h-5 w-5 fill-current" />
                    <span className="text-sm font-semibold">Dealer</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Drag players to match your physical seating arrangement (clockwise)
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={goToPreviousView} className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

