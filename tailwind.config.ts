import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#4863D4",
                    dark: "#3A51B5",
                    light: "#EBEEFD",
                },
                background: {
                    DEFAULT: "#F5F6FA",
                    paper: "#FFFFFF",
                },
                success: {
                    DEFAULT: "#01865F",
                    dark: "#016D4D",
                    light: "#D1FAE5",
                },
                danger: {
                    DEFAULT: "#C93B3B",
                    dark: "#A82F2F",
                    light: "#FEE2E2",
                },
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'clean': '0 1px 3px rgba(0,0,0,0.05)',
                'card': '0 2px 4px rgba(0,0,0,0.02), 0 1px 0 rgba(0,0,0,0.06)',
            }
        },
    },
    plugins: [],
};
export default config;
