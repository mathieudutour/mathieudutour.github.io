import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"

import "./section.css"

const observer = new window.IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const elem = entry.target
        elem.classList.add("fadeIn")
      }
    })
  },
  {
    threshold: 0.1,
  }
)

const Section = ({ name, centered, children, big }) => {
  const sectionRef = useRef(null)
  useEffect(() => {
    const elem = sectionRef.current
    observer.observe(elem)

    return () => observer.unobserve(elem)
  }, [sectionRef])

  return (
    <section id={name} className={centered ? "center" : ""} ref={sectionRef}>
      <div className={`${big ? "" : "container small"}`}>{children}</div>
    </section>
  )
}

Section.propTypes = {
  name: PropTypes.string.isRequired,
  centered: PropTypes.bool,
  big: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Section
