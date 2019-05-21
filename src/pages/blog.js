import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import BlogListing from "../components/blog-listing"

const BlogIndexPage = ({ data: { allMdx } }) => (
  <Layout>
    <SEO title="Mathieu Dutour - Blog" keywords={[]} />
    <BlogListing posts={allMdx.nodes} />
  </Layout>
)

export default BlogIndexPage

export const query = graphql`
  query BlogIndex {
    allMdx(
      filter: { fields: { blogPost: { eq: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        timeToRead
        frontmatter {
          title
          description
          categories
          date(formatString: "MMMM DD, YYYY")
        }
      }
    }
  }
`
