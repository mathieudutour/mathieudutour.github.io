import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Section from "../components/section"

const IndexPage = () => (
  <Layout>
    <SEO title="Thanks! Mathieu Dutour" keywords={[]} />
    <Section name="hero" centered>
      <h1 className="head fadeIn">
        Thanks!{" "}
        <span role="img" aria-label="Heart Raised-hands">
          ❤️🙌
        </span>
      </h1>
      <h3 className="subhead fadeIn">
        I’m truly grateful to all the wonderful humans and companies{" "}
        <a
          href="https://www.patreon.com/mathieudutour"
          rel="noopener noreferrer"
          target="_blank"
        >
          supporting
        </a>{" "}
        my open source work.
      </h3>
    </Section>
  </Layout>
)

export default IndexPage
