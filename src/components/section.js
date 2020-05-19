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

const Section = ({ name, centered, children, big, noFade, fullPage }) => {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (noFade) {
      return
    }
    const elem = sectionRef.current
    observer.observe(elem)

    return () => observer.unobserve(elem)
  }, [sectionRef, noFade])

  return (
    <section
      id={name}
      className={centered ? `center${fullPage ? " full-page" : ""}` : ""}
      ref={sectionRef}
    >
      <div className={`${big ? "" : "container small"}`}>{children}</div>
    </section>
  )
}

export default Section
