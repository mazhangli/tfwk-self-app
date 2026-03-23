module.exports = {
  plugins: {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-import": {},
    "autoprefixer": {},
    "postcss-px2rem-exclude": {
      remUnit: 200,
      exclude: /node_modules|folder_name/i
    }
  }
}
// module.exports = {
//   plugins: [require('autoprefixer'), require('postcss-import')],
// };
