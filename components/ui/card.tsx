import React from 'react';
import { cn } from '@/lib/utils';

// Porting generic Card, removing framer-motion temporarily if not installed, 
// or I will add it if I decide to install framer-motion.
// For now, let's make it a standard div and we can upgrade to motion.div if we install the library.
// ACTUALLY, checking the previous file, it used `glass-card`.
// I will keep it simple and consistent.

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    noPadding?: boolean;
    variant?: 'default' | 'glass' | 'outline' | 'ghost';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, noPadding = false, variant = 'default', ...props }, ref) => {
        const variants = {
            default: "bg-white border border-slate-200 shadow-sm",
            glass: "glass-card border border-white/20 shadow-lg backdrop-blur-xl bg-white/40",
            outline: "bg-transparent border-2 border-slate-200",
            ghost: "bg-transparent border-none shadow-none"
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-2xl overflow-hidden transition-all duration-300",
                    variants[variant],
                    !noPadding && "p-6",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
