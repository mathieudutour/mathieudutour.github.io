import React, { useEffect, useRef } from "react"

import "./section.css"

const observer =
  typeof window !== "undefined"
    ? new window.IntersectionObserver(
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
    : {
        observe() {},
        unobserve() {},
      }

const Section = ({ name, centered, children, big, noFade }) => {
  const sectionRef = useRef(null)
  if (!noFade) {
    useEffect(() => {
      const elem = sectionRef.current
      observer.observe(elem)

      return () => observer.unobserve(elem)
    }, [sectionRef])
  }

  return (
    <section id={name} className={centered ? "center" : ""} ref={sectionRef}>
      <div className={`${big ? "" : "container small"}`}>{children}</div>
    </section>
  )
}

export default Section
