/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'navy': {
                    DEFAULT: '#001f3f',
                    50: '#e6f0ff',
                    100: '#b3d4ff',
                    200: '#80b8ff',
                    300: '#4d9cff',
                    400: '#1a80ff',
                    500: '#0074D9',
                    600: '#005cb3',
                    700: '#00448c',
                    800: '#002c66',
                    900: '#001f3f',
                },
                'electric': {
                    DEFAULT: '#0074D9',
                    light: '#4da6ff',
                    dark: '#005299',
                },
            },
            fontFamily: {
                'pretendard': ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
