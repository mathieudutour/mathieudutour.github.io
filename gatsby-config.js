const config = {
  title: `Mathieu Dutour`,
  description: `I build things.`,
  author: `Mathieu Dutour`,
  siteUrl: `https://mathieu.dutour.me/`,
  githubUrl: `https://github.com/mathieudutour/mathieudutour.github.io`,
  bio: "",
  shortBio: "",
  social: {
    twitter: `mathieudutour`,
    github: `mathieudutour`,
    instagram: "",
    facebook: "",
    linkedin: "",
    medium: "@mathieudutour",
  },
}

module.exports = {
  siteMetadata: config,
  plugins: [
    {
      resolve: `gatsby-theme-medium-to-own-blog`,
      options: {
        pathPrefix: "blog",
        config,
        contentPath: "blog",
        webmentionsToken: process.env.WEBMENTIONS_TOKEN,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "project",
        path: `${__dirname}/project`,
      },
    },
  ],
}
