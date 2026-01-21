import React from 'react';
import { motion } from 'framer-motion';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-background bg-tree-pattern relative overflow-x-hidden">
            {/* Ambient background glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
            >
                {children}
            </motion.main>
        </div>
    );
};
