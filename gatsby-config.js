module.exports = {
  siteMetadata: {
    title: `Mathieu Dutour`,
    description: `I build things.`,
    author: `Mathieu Dutour`,
    siteUrl: `https://mathieu.dutour.me`,
    social: {
      twitter: `@mathieudutour`,
    },
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
              backgroundColor: "transparent",
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-embed-video`,
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          "gatsby-remark-autolink-headers",
          "gatsby-remark-smartypants",
          "gatsby-remark-external-links",
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "blog",
        path: `${__dirname}/blog`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "project",
        path: `${__dirname}/project`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mathieu Dutour`,
        short_name: `Mathieu Dutour`,
        start_url: `/`,
        background_color: `#001724`,
        theme_color: `#001724`,
        display: `minimal-ui`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
