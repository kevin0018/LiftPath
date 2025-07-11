const { join } = require('path');
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [join(__dirname, "src/**/*.{js,ts,jsx,tsx}")],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				primary: "#2a2a2a",
				secondary: "#a4a5ad",
				accent: "#bc4c7c",
			},
		},
	},
	plugins: [],
}