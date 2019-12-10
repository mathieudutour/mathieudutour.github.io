import React from "react"
import { Link, graphql } from "gatsby"
import MDXRenderer from "gatsby-plugin-mdx/mdx-renderer"

import SEO from "../components/seo"
import Pills from "../components/pills"
import Embed from "../components/embed"
import { formatPostDate, formatReadingTime } from "../utils/dates"

import "./blog.css"

export default function PageTemplate({ data: { mdx }, pageContext }) {
  const { previous, next } = pageContext
  const publicUrl = `https://mathieu.dutour.me${mdx.fields.slug}`

  return (
    <div>
      <SEO
        title={mdx.frontmatter.title}
        description={mdx.frontmatter.description}
        canonicalLink={mdx.frontmatter.canonicalLink}
        keywords={mdx.frontmatter.categories || []}
        meta={[
          {
            name: "twitter:label1",
            content: "Reading time",
          },
          {
            name: "twitter:data1",
            content: `${mdx.timeToRead} min read`,
          },
        ]}
      />
      <section className="center blog">
        <article className="container small">
          <header>
            <h1>
              <Link to="/blog">«</Link> {mdx.frontmatter.title}
            </h1>
            <p>
              {formatPostDate(mdx.frontmatter.date)}
              {` • ${formatReadingTime(mdx.timeToRead)}`}
            </p>
            <Pills items={mdx.frontmatter.categories} />
          </header>

          <MDXRenderer scope={{ Embed }}>{mdx.body}</MDXRenderer>
        </article>
        <footer className="container small">
          <small>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href={`https://twitter.com/search?q=${publicUrl}`}
            >
              Discuss on Twitter
            </a>{" "}
            &middot;{" "}
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href={`https://github.com/mathieudutour/mathieudutour.github.io/edit/master${
                mdx.fields.slug
              }index.mdx`}
            >
              Edit this post on GitHub
            </a>
          </small>
          <hr
            style={{
              margin: `24px 0`,
            }}
          />

          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </footer>
      </section>
    </div>
  )
}

export const pageQuery = graphql`
  query BlogPostQuery($id: String) {
    mdx(id: { eq: $id }) {
      fields {
        slug
      }
      timeToRead
      frontmatter {
        title
        description
        categories
        date(formatString: "MMMM DD, YYYY")
        canonicalLink
      }
      body
    }
  }
`
