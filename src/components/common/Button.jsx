import React from 'react';

const Button = ({
    children,
    onClick,
    variant = 'primary',
    type = 'button',
    disabled = false,
    className = '',
    ...props
}) => {
    const variantClasses = {
        primary: 'btn-primary',
        success: 'btn-success',
        danger: 'btn-danger',
        outline: 'btn-outline'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
