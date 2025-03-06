import React, { createContext, useContext, useEffect, useState, useRef } from "react"
import ResizeObserver from "resize-observer-polyfill"
import debounce from 'lodash.debounce'

const ChartDimensionsContext = createContext()
export const useChartDimensionsContext = () => useContext(ChartDimensionsContext)

export const combineChartDimensions = dimensions => {
  let parsedDimensions = {
      marginTop: 40,
      marginRight: 30,
      marginBottom: 40,
      marginLeft: 45,
      ...dimensions,
  }

  return {
      ...parsedDimensions,
      boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
      boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
  }
}

export const useNewChartDimensions = passedSettings => {
  const ref = useRef()
  const dimensions = combineChartDimensions(passedSettings)

  const [width, changeWidth] = useState(0)
  const [height, changeHeight] = useState(0)

  useEffect(() => {
      if (dimensions.width && dimensions.height) return [ref, dimensions]

      const element = ref.current
      const handleResize = debounce(entries => {
          if (!Array.isArray(entries)) return
          if (!entries.length) return

          const entry = entries[0]

          let resizeTimer;
          if (width !== entry.contentRect.width || height !== entry.contentRect.height) {
              document.body.classList.add("resize-animation-stopper");
              clearTimeout(resizeTimer);
              resizeTimer = setTimeout(() => {
                  document.body.classList.remove("resize-animation-stopper");
              }, 300);
          }

          requestAnimationFrame(() => {
              if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width)
              if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height)
          })
      }, 100) // Adjust the debounce delay as needed

      const resizeObserver = new ResizeObserver(handleResize)

      resizeObserver.observe(element)

      return () => {
          resizeObserver.unobserve(element)
          handleResize.cancel()
      }
  }, [passedSettings, height, width, dimensions])

  const newSettings = combineChartDimensions({
      ...dimensions,
      width: dimensions.width || width,
      height: dimensions.height || height,
      offsetTop: dimensions.offsetTop || ref.current?.offsetTop,
      offsetLeft: dimensions.offsetLeft || ref.current?.offsetLeft,
  })

  return [ref, newSettings]
}

export const Chart = ({ dimensions, children }) => (
  <ChartDimensionsContext.Provider value={dimensions}>
    <svg className="Chart" width={dimensions.width} height={dimensions.height}>
      <g transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}>
        { children }
      </g>
    </svg>
  </ChartDimensionsContext.Provider>
)