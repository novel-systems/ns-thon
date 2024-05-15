export default {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  prefix: 'tw-',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'wave-pattern': "url('../assets/images/nawbar_waves.svg')",
      },
      spacing: {
        '270px': '270px',
        '400px': '400px',
        '464px': '464px',
        '480px': '480px',
        '500px': '500px',
        '576px': '576px',
        '600px': '600px',
        '672px': '672px',
      },
      minHeight: {
        '576px': '576px',
        '600px': '600px',
        '672px': '672px',
      },
      minWidth: {
        '360px': '360px',
        '540px': '540px',
      },
    },
  },
  variants: {},
  plugins: [],
}
