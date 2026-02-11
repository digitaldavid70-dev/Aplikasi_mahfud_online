import React from 'react';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import Button from '../common/Button';

const LoginView = () => {
    const { login, settings } = useApp();

    // Ensure theme is applied even on login screen
    React.useEffect(() => {
        if (settings?.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
    }, [settings?.darkMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        try {
            const success = login(username, password);

            if (!success) {
                toast.error(`Login Gagal! Username atau Password salah.`);
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Terjadi error saat login: " + err.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
            padding: '1.5rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                background: 'var(--slate-50)', // Uses variable for dark mode support
                borderRadius: 'var(--radius-2xl)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                padding: '2.5rem'
            }}>
                {/* Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        margin: '0 auto 1rem',
                        boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                    }}>
                        <Package size={32} />
                    </div>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: '800',
                        color: 'var(--slate-900)',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.02em'
                    }}>
                        ERP DISTRIBUSI
                    </h1>
                    <p style={{
                        color: 'var(--slate-500)',
                        fontSize: '0.875rem'
                    }}>
                        Silakan masuk untuk melanjutkan
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-xl)',
                                border: '2px solid var(--slate-200)',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                                background: 'var(--slate-50)',
                                color: 'var(--slate-900)'
                            }}
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-xl)',
                                border: '2px solid var(--slate-200)',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                                background: 'var(--slate-50)',
                                color: 'var(--slate-900)'
                            }}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            fontSize: '1rem',
                            fontWeight: '700',
                            marginTop: '0.5rem'
                        }}
                    >
                        Masuk
                    </Button>
                </form>

                {/* Info */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'var(--slate-50)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.75rem',
                    color: 'var(--slate-600)',
                    textAlign: 'center',
                    lineHeight: '1.6'
                }}>
                    <strong>Akun Demo:</strong><br />
                    Admin: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px' }}>admin</code> / <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px' }}>admin123</code><br />
                    Staf: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px' }}>staf</code> / <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px' }}>staf123</code>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
