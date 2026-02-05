import React from 'react';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
    const colorStyles = {
        primary: { bg: 'var(--primary)', light: '#FEF3C7' },
        success: { bg: 'var(--success)', light: '#D1FAE5' },
        danger: { bg: 'var(--danger)', light: '#FFE4E6' },
        info: { bg: 'var(--info)', light: '#DBEAFE' }
    };

    const style = colorStyles[color];

    return (
        <div className="card" style={{
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <div>
                <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--slate-500)',
                    marginBottom: '0.25rem'
                }}>
                    {title}
                </p>
                <p style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: 'var(--slate-900)'
                }}>
                    {value}
                </p>
            </div>
            <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-xl)',
                background: style.light,
                color: style.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
