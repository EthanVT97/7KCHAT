import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../hooks/useToast';
import NumberInput from '../common/NumberInput';
import OddsDisplay from './OddsDisplay';
import BetConfirmation from './BetConfirmation';

const BettingForm = ({ game, onPlaceBet, userBalance }) => {
    const { t } = useTranslation();
    const toast = useToast();
    const [betAmount, setBetAmount] = useState('');
    const [selectedOdds, setSelectedOdds] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [potentialWinnings, setPotentialWinnings] = useState(0);

    useEffect(() => {
        if (betAmount && selectedOdds) {
            calculatePotentialWinnings();
        }
    }, [betAmount, selectedOdds]);

    const calculatePotentialWinnings = () => {
        const amount = parseFloat(betAmount);
        const odds = parseFloat(selectedOdds);
        setPotentialWinnings(amount * odds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateBet()) return;
        
        setShowConfirmation(true);
    };

    const validateBet = () => {
        const amount = parseFloat(betAmount);
        
        if (isNaN(amount) || amount <= 0) {
            toast.error(t('Please enter a valid bet amount'));
            return false;
        }

        if (amount > userBalance) {
            toast.error(t('Insufficient balance'));
            return false;
        }

        if (amount < game.restrictions.minBet) {
            toast.error(t('Bet amount below minimum'));
            return false;
        }

        if (amount > game.restrictions.maxBet) {
            toast.error(t('Bet amount above maximum'));
            return false;
        }

        return true;
    };

    const confirmBet = async () => {
        const result = await onPlaceBet({
            gameId: game.id,
            amount: parseFloat(betAmount),
            odds: selectedOdds,
            type: 'single'
        });

        if (result.success) {
            toast.success(result.message);
            resetForm();
        } else {
            toast.error(result.message);
        }
        
        setShowConfirmation(false);
    };

    const resetForm = () => {
        setBetAmount('');
        setSelectedOdds(null);
        setPotentialWinnings(0);
    };

    return (
        <div className="betting-form">
            <form onSubmit={handleSubmit}>
                <div className="form-header">
                    <h3>{game.name}</h3>
                    <span className="game-type">{game.type}</span>
                </div>

                <div className="odds-section">
                    <OddsDisplay
                        odds={game.odds}
                        selectedOdds={selectedOdds}
                        onSelect={setSelectedOdds}
                    />
                </div>

                <div className="bet-input-section">
                    <NumberInput
                        label={t('Bet Amount')}
                        value={betAmount}
                        onChange={setBetAmount}
                        min={game.restrictions.minBet}
                        max={game.restrictions.maxBet}
                        currency="MMK"
                    />

                    <div className="bet-limits">
                        <span>{t('Min')}: {game.restrictions.minBet}</span>
                        <span>{t('Max')}: {game.restrictions.maxBet}</span>
                    </div>
                </div>

                {potentialWinnings > 0 && (
                    <div className="potential-winnings">
                        <span>{t('Potential Win')}:</span>
                        <strong>{potentialWinnings.toLocaleString()} MMK</strong>
                    </div>
                )}

                <button
                    type="submit"
                    className="place-bet-btn"
                    disabled={!betAmount || !selectedOdds}
                >
                    {t('Place Bet')}
                </button>
            </form>

            {showConfirmation && (
                <BetConfirmation
                    betData={{
                        amount: betAmount,
                        odds: selectedOdds,
                        potentialWin: potentialWinnings,
                        game: game.name
                    }}
                    onConfirm={confirmBet}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
};

export default BettingForm; 