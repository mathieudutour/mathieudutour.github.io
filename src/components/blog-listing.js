import React from "react"
import { Link } from "gatsby"

import Pills from "gatsby-theme-medium-to-own-blog/src/components/pills"
import Section from "./section"
import { formatPostDate, formatReadingTime } from "../utils/dates"

import "./blog-listing.css"

const BlogListing = ({ posts, nested }) => (
  <>
    {posts.map(post => (
      <Section
        key={post.fields.slug}
        name={post.fields.slug}
        centered
        big={nested}
      >
        <Link to={post.fields.slug} className="blog-listing">
          <h1>{post.frontmatter.title}</h1>
          <p>
            {formatPostDate(post.frontmatter.date)}
            {` • ${formatReadingTime(post.timeToRead)}`}
          </p>
          <Pills items={post.frontmatter.categories} />
          <p>{post.frontmatter.description}</p>
        </Link>
      </Section>
    ))}
  </>
)

export default BlogListing
