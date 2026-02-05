import React from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content ${sizeClasses[size]}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && (
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                        color: 'var(--slate-900)'
                    }}>
                        {title}
                    </h3>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
