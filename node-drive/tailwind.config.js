/** @type {import('tailwindcss').Config} */
export default {
  	content: [
		'./src/**/*.{js,jsx,ts,tsx}',
		'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  	],
  	theme: {
		extend: {
			animation: {
				"fast-pulse": "pulse 500ms cubic-bezier(0.4, 0, 0.6, 1) infinite"
			}
		},
  	},
  	plugins: [
		require("flowbite/plugin")
	],
}

