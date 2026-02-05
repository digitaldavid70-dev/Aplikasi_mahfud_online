import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ activeTab, toggleSidebar }) => {
    return (
        <header style={{
            height: '64px',
            background: 'white',
            borderBottom: '1px solid var(--slate-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            flexShrink: 0
        }}>
            <button
                onClick={toggleSidebar}
                style={{
                    padding: '0.5rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-600)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--slate-100)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                <Menu size={20} />
            </button>

            ...

            <div style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: 'var(--slate-500)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
            }}>
                {activeTab}
            </div>
        </header>
    );
};

export default Header;
