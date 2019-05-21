const path = require("path")
const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === "Mdx") {
    const value = createFilePath({ node, getNode })
    const parent = getNode(node.parent)
    createNodeField({
      name: "slug",
      node,
      value: `/${parent.sourceInstanceName}${value}`,
    })
    createNodeField({
      name: "blogPost",
      node,
      value: parent.sourceInstanceName === "blog",
    })
    createNodeField({
      name: "project",
      node,
      value: parent.sourceInstanceName === "project",
    })
  }
}

exports.createPages = ({ graphql, actions, reporter, pathPrefix }) => {
  const { createPage } = actions
  return graphql(
    `
      {
        allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
          edges {
            node {
              id
              fields {
                slug
                blogPost
              }
              frontmatter {
                title
              }
              parent {
                ... on File {
                  sourceInstanceName
                }
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors && result.errors.length) {
      if (result.errors.length === 1) {
        throw new Error(result.errors[0])
      }

      result.errors.forEach(error => {
        reporter.error("Error while querying the mdx", error)
      })

      throw new Error("See errors above")
    }
    const posts = result.data.allMdx.edges
    // We'll call `createPage` for each result
    result.data.allMdx.edges.forEach(({ node }, index) => {
      let previous = index === posts.length - 1 ? null : posts[index + 1].node
      let next = index === 0 ? null : posts[index - 1].node

      if (previous && !previous.fields.blogPost) {
        previous = null
      }
      if (next && !next.fields.blogPost) {
        next = null
      }

      createPage({
        // This is the slug we created before
        // (or `node.frontmatter.slug`)
        path: `${pathPrefix}${node.fields.slug}`,
        // This component will wrap our MDX content
        component: path.resolve(
          `./src/templates/${node.parent.sourceInstanceName}.js`
        ),
        // We can use the values in this context in
        // our page layout component
        context: { id: node.id, previous, next },
      })
    })
  })
}
