const { join } = require('path');
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [join(__dirname, "src/**/*.{js,ts,jsx,tsx}")],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {},
	},
	plugins: [],
}