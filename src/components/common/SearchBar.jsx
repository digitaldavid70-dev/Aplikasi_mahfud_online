import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
    value,
    onChange,
    placeholder = 'Cari...',
    onClear
}) => {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px'
        }}>
            <Search
                size={18}
                style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--slate-400)',
                    pointerEvents: 'none'
                }}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                    border: '2px solid var(--slate-200)',
                    borderRadius: 'var(--radius-xl)',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--slate-200)';
                    e.target.style.boxShadow = 'none';
                }}
            />
            {value && (
                <button
                    onClick={() => {
                        onChange('');
                        if (onClear) onClear();
                    }}
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '4px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--slate-400)',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'var(--slate-100)';
                        e.target.style.color = 'var(--slate-600)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--slate-400)';
                    }}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
