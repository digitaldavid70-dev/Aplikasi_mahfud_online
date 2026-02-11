import React from 'react';

const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange, onClear }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            flexWrap: 'wrap'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: 'var(--slate-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Dari
                </label>
                <input
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => onStartChange(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        border: '2px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--slate-200)';
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: 'var(--slate-500)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Sampai
                </label>
                <input
                    type="date"
                    value={endDate || ''}
                    onChange={(e) => onEndChange(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        border: '2px solid var(--slate-200)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s'
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--slate-200)';
                    }}
                />
            </div>

            {(startDate || endDate) && (
                <button
                    onClick={() => {
                        onStartChange('');
                        onEndChange('');
                        if (onClear) onClear();
                    }}
                    style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        background: 'var(--slate-100)',
                        color: 'var(--slate-600)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: 'auto',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'var(--slate-200)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'var(--slate-100)';
                    }}
                >
                    Reset
                </button>
            )}
        </div>
    );
};

export default DateRangeFilter;
