import React from "react"
import './styles.css'
import useWindowSize from "../components/Hooks/useWindowSize"
import ScatterPlotViz from "../components/Viz/ScatterPlotViz"
import data from '../data/my_weather_data.json'

const ScatterPlot = () => {
    const [width, height] = useWindowSize()

    // Accessors
    const xAccessor = (d) => d.dewPoint
    const yAccessor = (d) => d.humidity
    const colorAccessor = (d) => d.cloudCover

    // Labels
    const xAxisLabel = "Dew point (&deg;F)"
    const yAxisLabel = "Relative humidity"
    const colorLegendLabel = "Cloud cover"

    return (
        <div className="pages">
            <h1>Scatter Plot</h1>
            <ScatterPlotViz 
                data={data}
                xAccessor={xAccessor}
                yAccessor={yAccessor}
                colorAccessor={colorAccessor}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                colorLegendLabel={colorLegendLabel}
                width={width - 280}
                height={height - 130} />
        </div>
    );
}

export default ScatterPlot