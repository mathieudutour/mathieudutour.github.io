import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import "./projects.css"

const Projects = () => {
  const { allMdx } = useStaticQuery(
    graphql`
      query {
        allMdx(
          filter: { fields: { project: { eq: true } } }
          sort: { fields: [frontmatter___order] }
        ) {
          nodes {
            frontmatter {
              title
              color
              description
              order
              url
            }
          }
        }
      }
    `
  )

  const projects = allMdx.nodes.map(x => x.frontmatter)

  return (
    <div className="projects-container">
      {projects.map(project => (
        <div className="project" key={project.url}>
          <p>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-title"
            >
              {project.title}
            </a>{" "}
            {project.description}.
          </p>
        </div>
      ))}
    </div>
  )
}

export default Projects
