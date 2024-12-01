import React from 'react';
import PropTypes from 'prop-types';

const NumberInput = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    currency,
    error,
    className = ''
}) => {
    const handleChange = (e) => {
        const newValue = e.target.value;
        if (newValue === '' || (!isNaN(newValue) && newValue >= 0)) {
            onChange(newValue);
        }
    };

    const handleBlur = () => {
        if (value === '') return;
        
        const numValue = parseFloat(value);
        if (numValue < min) {
            onChange(min.toString());
        } else if (numValue > max) {
            onChange(max.toString());
        }
    };

    const incrementValue = () => {
        const currentValue = value === '' ? 0 : parseFloat(value);
        const newValue = Math.min(currentValue + step, max);
        onChange(newValue.toString());
    };

    const decrementValue = () => {
        const currentValue = value === '' ? 0 : parseFloat(value);
        const newValue = Math.max(currentValue - step, min);
        onChange(newValue.toString());
    };

    return (
        <div className={`number-input-container ${className}`}>
            {label && <label className="input-label">{label}</label>}
            
            <div className="input-wrapper">
                {currency && (
                    <span className="currency-symbol">{currency}</span>
                )}
                
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={min}
                    max={max}
                    step={step}
                    className={`number-input ${error ? 'error' : ''}`}
                />
                
                <div className="input-controls">
                    <button
                        type="button"
                        onClick={incrementValue}
                        className="control-btn"
                        disabled={value !== '' && parseFloat(value) >= max}
                    >
                        ▲
                    </button>
                    <button
                        type="button"
                        onClick={decrementValue}
                        className="control-btn"
                        disabled={value !== '' && parseFloat(value) <= min}
                    >
                        ▼
                    </button>
                </div>
            </div>

            {error && (
                <span className="error-message">{error}</span>
            )}
        </div>
    );
};

NumberInput.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    currency: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string
};

export default NumberInput;