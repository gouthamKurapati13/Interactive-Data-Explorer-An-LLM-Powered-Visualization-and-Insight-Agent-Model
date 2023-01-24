import React from "react"
import PropTypes from "prop-types"
import * as d3 from "d3"

import Chart from "./chart/Chart"
import Circles from "./chart/Circles"
import Axis from "./chart/Axis"
import { useChartDimensions, accessorPropsType } from "./chart/utils"

const ScatterPlot = ({ outOfFocus, active, onClick, data, xAccessor, yAccessor, xLabel, yLabel, xFormat, yFormat }) => {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77
  })

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = d => xScale(xAccessor(d))
  const yAccessorScaled = d => yScale(yAccessor(d))
  const keyAccessor = (d, i) => i

  return (
    <div onClick={onClick} className={active ? "Chart__square active" : outOfFocus ? "Chart__square outOfFocus" : "Chart__square"} ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis
          dimensions={dimensions}
          dimension="x"
          scale={xScale}
          label={xLabel}
          formatTick={xFormat}
        />
        <Axis
          dimensions={dimensions}
          dimension="y"
          scale={yScale}
          label={yLabel}
          formatTick={yFormat}
        />
        <Circles
          data={data}
          keyAccessor={keyAccessor}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
      </Chart>
    </div>
  )
}

ScatterPlot.propTypes = {
  xAccessor: accessorPropsType,
  yAccessor: accessorPropsType,
  xLabel: PropTypes.string,
  yLabel: PropTypes.string,
  xFormat: PropTypes.func,
  yFormat: PropTypes.func,
}

ScatterPlot.defaultProps = {
  xAccessor: d => d.x,
  yAccessor: d => d.y,
}
export default ScatterPlot
