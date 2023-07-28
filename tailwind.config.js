/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                light: '#f7f7f7', // Background color of logo
                dark: '#1b1d22',
            },
            fontFamily: {
                sans: ['Nunito', 'sans-serif'],
            }
        },
    },
    plugins: [],
};
