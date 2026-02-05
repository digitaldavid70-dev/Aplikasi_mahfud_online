import React, { useState } from 'react';
import { formatIDR } from '../../utils/formatters';

const CurrencyInput = ({
    value,
    onChange,
    name,
    placeholder = 'Rp 0',
    required = false,
    className = ''
}) => {
    const [displayValue, setDisplayValue] = useState(value ? formatIDR(value) : '');

    const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const numericValue = parseInt(rawValue) || 0;
        setDisplayValue(numericValue > 0 ? formatIDR(numericValue) : '');
        if (onChange) {
            onChange(numericValue);
        }
    };

    return (
        <input
            type="text"
            name={name}
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className={className}
        />
    );
};

export default CurrencyInput;
