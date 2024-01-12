import nextra from "nextra";

// module.exports = {
//   reactStrictMode: true,
// }

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx'
})
 
export default withNextra({
  output: "export",
  images: {
    unoptimized: true
  },
  basePath: '/ajel',
})
