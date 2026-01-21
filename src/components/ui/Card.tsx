import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, noPadding = false, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn(
                    "glass-card rounded-2xl overflow-hidden",
                    !noPadding && "p-6",
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = "Card";
