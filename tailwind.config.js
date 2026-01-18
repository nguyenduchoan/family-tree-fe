/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#f8fafc', // slate-50
                surface: '#ffffff',
                primary: '#10b981', // emerald-500
                secondary: '#64748b', // slate-500
                'tree-line': '#cbd5e1', // slate-300
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
