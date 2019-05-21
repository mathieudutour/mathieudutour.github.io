import React from "react"
import { graphql } from "gatsby"
import MDXRenderer from "gatsby-mdx/mdx-renderer"

import SEO from "../components/seo"

export default function ProjectTemplate({ data: { mdx } }) {
  return (
    <div>
      <SEO
        title={mdx.frontmatter.title}
        description={mdx.frontmatter.description}
        keywords={[]}
      />
      <section className="center blog">
        <article className="container small">
          <header>
            <h1>{mdx.frontmatter.title}</h1>
          </header>

          <MDXRenderer>{mdx.code.body}</MDXRenderer>
        </article>
      </section>
    </div>
  )
}

export const pageQuery = graphql`
  query ProjectQuery($id: String) {
    mdx(id: { eq: $id }) {
      fields {
        slug
      }
      frontmatter {
        title
        description
        url
        color
      }
      code {
        body
      }
    }
  }
`
