import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const Button = ({ children, className, disabled, loading, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.01 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={cn(
                "relative w-full h-12 rounded-lg font-medium text-sm overflow-hidden",
                "bg-gradient-to-b from-blue-500 to-blue-600",
                "text-white shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset,0_-1px_0_0_rgba(0,0,0,0.1)_inset]",
                "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
                "transition-shadow duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                    </svg>
                )}
                {children}
            </span>
        </motion.button>
    );
};

export { Button };
