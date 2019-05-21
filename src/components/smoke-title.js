import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"

import getWebGLContext from "../utils/webgl"
import compileShaders from "../utils/shaders"

const SmokeTitle = ({ children }) => {
  const canvasRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0.99,
      VELOCITY_DISSIPATION: 1,
      PRESSURE_DISSIPATION: 0.9,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 1,
    }

    const { gl, ext } = getWebGLContext(canvas)

    class GLProgram {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {}
        this.program = gl.createProgram()

        gl.attachShader(this.program, vertexShader)
        gl.attachShader(this.program, fragmentShader)
        gl.linkProgram(this.program)

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
          throw gl.getProgramInfoLog(this.program)

        const uniformCount = gl.getProgramParameter(
          this.program,
          gl.ACTIVE_UNIFORMS
        )
        for (let i = 0; i < uniformCount; i += 1) {
          const uniformName = gl.getActiveUniform(this.program, i).name
          this.uniforms[uniformName] = gl.getUniformLocation(
            this.program,
            uniformName
          )
        }
      }

      bind() {
        gl.useProgram(this.program)
      }
    }

    const {
      baseVertexShader,
      backgroundShader,
      clearShader,
      displayShader,
      splatShader,
      advectionManualFilteringShader,
      advectionShader,
      divergenceShader,
      curlShader,
      vorticityShader,
      pressureShader,
      gradientSubtractShader,
    } = compileShaders(gl)

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      )
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      )
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(0)

      return destination => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination)
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
      }
    })()

    let simWidth
    let simHeight
    let dyeWidth
    let dyeHeight
    let density
    let velocity
    let divergence
    let curl
    let pressure

    const backgroundProgram = new GLProgram(baseVertexShader, backgroundShader)
    const clearProgram = new GLProgram(baseVertexShader, clearShader)
    const displayProgram = new GLProgram(baseVertexShader, displayShader)
    const splatProgram = new GLProgram(baseVertexShader, splatShader)
    const advectionProgram = new GLProgram(
      baseVertexShader,
      ext.supportLinearFiltering
        ? advectionShader
        : advectionManualFilteringShader
    )
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader)
    const curlProgram = new GLProgram(baseVertexShader, curlShader)
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader)
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader)
    const gradienSubtractProgram = new GLProgram(
      baseVertexShader,
      gradientSubtractShader
    )

    function getResolution(resolution) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio

      const max = Math.round(resolution * aspectRatio)
      const min = Math.round(resolution)

      if (gl.drawingBufferWidth > gl.drawingBufferHeight)
        return { width: max, height: min }
      return { width: min, height: max }
    }

    function createFBO(w, h, internalFormat, format, type, param) {
      gl.activeTexture(gl.TEXTURE0)
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      )

      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      )
      gl.viewport(0, 0, w, h)
      gl.clear(gl.COLOR_BUFFER_BIT)

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id) {
          gl.activeTexture(gl.TEXTURE0 + id)
          gl.bindTexture(gl.TEXTURE_2D, texture)
          return id
        },
      }
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param)
      let fbo2 = createFBO(w, h, internalFormat, format, type, param)

      return {
        get read() {
          return fbo1
        },
        set read(value) {
          fbo1 = value
        },
        get write() {
          return fbo2
        },
        set write(value) {
          fbo2 = value
        },
        swap() {
          const temp = fbo1
          fbo1 = fbo2
          fbo2 = temp
        },
      }
    }

    function resizeFBO(target, w, h, internalFormat, format, type, param) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param)
      clearProgram.bind()
      gl.uniform1i(clearProgram.uniforms.uTexture, target.attach(0))
      gl.uniform1f(clearProgram.uniforms.value, 1)
      blit(newFBO.fbo)
      return newFBO
    }

    function resizeDoubleFBO(
      target,
      w,
      h,
      internalFormat,
      format,
      type,
      param
    ) {
      // eslint-disable-next-line no-param-reassign
      target.read = resizeFBO(
        target.read,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      )
      // eslint-disable-next-line no-param-reassign
      target.write = createFBO(w, h, internalFormat, format, type, param)
      return target
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION)
      const dyeRes = getResolution(config.DYE_RESOLUTION)

      simWidth = simRes.width
      simHeight = simRes.height
      dyeWidth = dyeRes.width
      dyeHeight = dyeRes.height

      const texType = ext.halfFloatTexType
      const rgba = ext.formatRGBA
      const rg = ext.formatRG
      const r = ext.formatR
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

      if (density == null)
        density = createDoubleFBO(
          dyeWidth,
          dyeHeight,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        )
      else
        density = resizeDoubleFBO(
          density,
          dyeWidth,
          dyeHeight,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        )

      if (velocity == null)
        velocity = createDoubleFBO(
          simWidth,
          simHeight,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        )
      else
        velocity = resizeDoubleFBO(
          velocity,
          simWidth,
          simHeight,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        )

      divergence = createFBO(
        simWidth,
        simHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      )
      curl = createFBO(
        simWidth,
        simHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      )
      pressure = createDoubleFBO(
        simWidth,
        simHeight,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      )
    }

    initFramebuffers()

    function step(dt) {
      gl.disable(gl.BLEND)
      gl.viewport(0, 0, simWidth, simHeight)

      curlProgram.bind()
      gl.uniform2f(
        curlProgram.uniforms.texelSize,
        1.0 / simWidth,
        1.0 / simHeight
      )
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(curl.fbo)

      vorticityProgram.bind()
      gl.uniform2f(
        vorticityProgram.uniforms.texelSize,
        1.0 / simWidth,
        1.0 / simHeight
      )
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL)
      gl.uniform1f(vorticityProgram.uniforms.dt, dt)
      blit(velocity.write.fbo)
      velocity.swap()

      divergenceProgram.bind()
      gl.uniform2f(
        divergenceProgram.uniforms.texelSize,
        1.0 / simWidth,
        1.0 / simHeight
      )
      gl.uniform1i(
        divergenceProgram.uniforms.uVelocity,
        velocity.read.attach(0)
      )
      blit(divergence.fbo)

      clearProgram.bind()
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION)
      blit(pressure.write.fbo)
      pressure.swap()

      pressureProgram.bind()
      gl.uniform2f(
        pressureProgram.uniforms.texelSize,
        1.0 / simWidth,
        1.0 / simHeight
      )
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i += 1) {
        gl.uniform1i(
          pressureProgram.uniforms.uPressure,
          pressure.read.attach(1)
        )
        blit(pressure.write.fbo)
        pressure.swap()
      }

      gradienSubtractProgram.bind()
      gl.uniform2f(
        gradienSubtractProgram.uniforms.texelSize,
        1.0 / simWidth,
        1.0 / simHeight
      )
      gl.uniform1i(
        gradienSubtractProgram.uniforms.uPressure,
        pressure.read.attach(0)
      )
      gl.uniform1i(
        gradienSubtractProgram.uniforms.uVelocity,
        velocity.read.attach(1)
      )
      blit(velocity.write.fbo)
      velocity.swap()

      advectionProgram.bind()
      gl.uniform2f(
        advectionProgram.uniforms.texelSize,
        1.0 / simWidth,
        1.0 / simHeight
      )
      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          1.0 / simWidth,
          1.0 / simHeight
        )
      const velocityId = velocity.read.attach(0)
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId)
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId)
      gl.uniform1f(advectionProgram.uniforms.dt, dt)
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.VELOCITY_DISSIPATION
      )
      blit(velocity.write.fbo)
      velocity.swap()

      gl.viewport(0, 0, dyeWidth, dyeHeight)

      if (!ext.supportLinearFiltering)
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          1.0 / dyeWidth,
          1.0 / dyeHeight
        )
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read.attach(1))
      gl.uniform1f(
        advectionProgram.uniforms.dissipation,
        config.DENSITY_DISSIPATION
      )
      blit(density.write.fbo)
      density.swap()
    }

    function render() {
      gl.disable(gl.BLEND)

      const width = gl.drawingBufferWidth
      const height = gl.drawingBufferHeight

      gl.viewport(0, 0, width, height)

      backgroundProgram.bind()
      gl.uniform1f(
        backgroundProgram.uniforms.aspectRatio,
        canvas.width / canvas.height
      )
      blit(null)

      const program = displayProgram
      program.bind()
      gl.uniform1i(program.uniforms.uTexture, density.read.attach(0))

      blit(null)
    }

    function splat(x, y, dx, dy, color) {
      gl.viewport(0, 0, simWidth, simHeight)
      splatProgram.bind()
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
      gl.uniform1f(
        splatProgram.uniforms.aspectRatio,
        canvas.width / canvas.height
      )
      gl.uniform2f(
        splatProgram.uniforms.point,
        x / canvas.width,
        1.0 - y / canvas.height
      )
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0)
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS / 100.0)
      blit(velocity.write.fbo)
      velocity.swap()

      gl.viewport(0, 0, dyeWidth, dyeHeight)
      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.attach(0))
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
      blit(density.write.fbo)
      density.swap()
    }

    function resizeCanvas() {
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        initFramebuffers()
      }
    }

    splat(canvas.width / 2, canvas.height, 0, -1000, { r: 9, g: 31, b: 29 })

    function update() {
      resizeCanvas()
      step(0.016)
      render(null)
      window.requestAnimationFrame(update)
    }

    update()
  }, [canvasRef])

  useEffect(() => {
    const timeout = setTimeout(() => {
      contentRef.current.classList.add("fadeInSlow")
    }, 1000)

    return () => clearTimeout(timeout)
  }, [contentRef])

  return (
    <section className="center" id="hero">
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "150%",
          left: "0",
          top: "-40%",
        }}
      />
      <div ref={contentRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </section>
  )
}

SmokeTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SmokeTitle
