import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../hooks/useSocket';
import BettingForm from './BettingForm';
import GameList from './GameList';
import BetHistory from './BetHistory';
import LiveOdds from './LiveOdds';

const GamblingInterface = () => {
    const { t } = useTranslation();
    const socket = useSocket();
    const [activeGames, setActiveGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [userBalance, setUserBalance] = useState(null);

    useEffect(() => {
        loadActiveGames();
        subscribeToOddsUpdates();

        return () => {
            socket.off('odds_update');
        };
    }, []);

    const loadActiveGames = async () => {
        try {
            const response = await fetch('/api/gambling/active-games');
            const games = await response.json();
            setActiveGames(games);
        } catch (error) {
            console.error('Error loading games:', error);
        }
    };

    const subscribeToOddsUpdates = () => {
        socket.on('odds_update', (data) => {
            setActiveGames(prev => prev.map(game => {
                if (game.id === data.gameId) {
                    return { ...game, odds: data.odds };
                }
                return game;
            }));
        });
    };

    const handlePlaceBet = async (betData) => {
        try {
            const response = await fetch('/api/gambling/place-bet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(betData)
            });
            const result = await response.json();
            
            if (result.success) {
                // Update user balance and show success message
                setUserBalance(result.newBalance);
                return { success: true, message: t('Bet placed successfully') };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Error placing bet:', error);
            return { success: false, message: t('Error placing bet') };
        }
    };

    return (
        <div className="gambling-interface">
            <div className="gambling-header">
                <h2>{t('Live Games')}</h2>
                {userBalance && (
                    <div className="balance-display">
                        {t('Balance')}: {userBalance}
                    </div>
                )}
            </div>
            
            <div className="gambling-content">
                <div className="games-section">
                    <GameList
                        games={activeGames}
                        onGameSelect={setSelectedGame}
                        selectedGame={selectedGame}
                    />
                    {selectedGame && (
                        <LiveOdds
                            gameId={selectedGame.id}
                            initialOdds={selectedGame.odds}
                        />
                    )}
                </div>
                
                <div className="betting-section">
                    {selectedGame && (
                        <BettingForm
                            game={selectedGame}
                            onPlaceBet={handlePlaceBet}
                            userBalance={userBalance}
                        />
                    )}
                </div>
                
                <div className="history-section">
                    <BetHistory />
                </div>
            </div>
        </div>
    );
};

export default GamblingInterface; 