import React from "react"

import Section from "./section"
import Pills from "./pills"
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
        <a href={post.fields.slug} className="blog-listing">
          <h1>{post.frontmatter.title}</h1>
          <p>
            {formatPostDate(post.frontmatter.date)}
            {` • ${formatReadingTime(post.timeToRead)}`}
          </p>
          <Pills items={post.frontmatter.categories} />
          <p>{post.frontmatter.description}</p>
        </a>
      </Section>
    ))}
  </>
)

export default BlogListing
