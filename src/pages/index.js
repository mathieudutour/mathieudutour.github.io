import React from "react"
import { Link, graphql } from "gatsby"

import SEO from "gatsby-theme-medium-to-own-blog/src/components/seo"
import Layout from "gatsby-theme-medium-to-own-blog/src/components/layout"
import Section from "../components/section"
import Projects from "../components/projects"
import SmokeTitle from "../components/smoke-title"
import BlogListing from "../components/blog-listing"

import "./index.css"

const IndexPage = ({ data: { allMdx } }) => (
  <Layout>
    <SEO title="Mathieu Dutour" keywords={[]} />
    <SmokeTitle>
      <h1 className="head fadeIn">Mathieu Dutour</h1>
      <h3 className="subhead fadeIn">I build things.</h3>
    </SmokeTitle>

    <Section name="about" centered>
      <p>
        I'm a <span className="keyword">maker</span> &amp; digital{" "}
        <span className="keyword">nomad</span>.
      </p>
      <p>
        I code in JavaScript for pretty much{" "}
        <span className="keyword">everything</span> (React, Electron, NodeJS,
        etc.), Python for <span className="keyword">AI</span>, and Swift/Java
        for <span className="keyword">mobile apps.</span> I{" "}
        <span className="keyword">design</span> in Sketch.
      </p>
    </Section>

    <Section name="projects">
      <h1 className="head">Projects</h1>
      <Projects />
    </Section>

    <Section name="blog-posts" noFade>
      <h1 className="head">Writings</h1>
      <BlogListing posts={allMdx.nodes} nested />
    </Section>

    <Section name="social">
      <p>
        Find my writing on my <Link to="/blog">Blog</Link>, my thoughts on{" "}
        <a
          href="https://twitter.com/mathieudutour"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        , and my code on{" "}
        <a
          href="https://github.com/mathieudutour"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
      <p>
        Feel free to reach out by sending me an{" "}
        <a href="mailto:mathieu@dutour.me" rel="noopener noreferrer">
          Email
        </a>
        .
      </p>
    </Section>
  </Layout>
)

export default IndexPage

export const query = graphql`
  query BlogFrontPage {
    allMdx(
      filter: { fields: { blogPost: { eq: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 4
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
