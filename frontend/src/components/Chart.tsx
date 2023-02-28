import React from "react";
import { data, data2 } from "./data.js";
import { ResponsiveLine } from "@nivo/line";

const line1Color = "#2E3648"; //dark theme"#FFD200";

export default function Chart(actual: any, prediction: any) {
  console.log("actual", actual);
  console.log("prediction", prediction);
  return (
    <div className="App">
      <div className="wrapper">
        <div className="graphContainer">
          <ResponsiveLine
            data={actual.actual}
            colors={[line1Color]}
            layers={["grid", "axes", "lines", "markers", "legends"]}
            axisLeft={{
              legend: "Actual Sales",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            theme={getColoredAxis(line1Color)}
            margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
          />
        </div>

        <div className="secondGraph">
          <SecondGraph prediction={actual.prediction} />
        </div>
      </div>
    </div>
  );
}

// I want this to be on top of the other graph
const SecondGraph = (prediction: any) => {
  // const data1And2 = data.concat(data2);
  // console.log("Graph2 Data: ", data1And2);
  console.log("prediciton second", prediction);
  return (
    <ResponsiveLine
      data={prediction.prediction}
      colors={[
        "rgba(255, 255, 255, 0)",
        "#7b1fa2",
      ]} /* Make the first line transparent with 0 opacity */
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      axisRight={{
        legend: "Forecasted Sales",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={null}
      axisTop={null}
      enableGridY={false}
      enableGridX={false}
      axisBottom={null}
      theme={getColoredAxis("#7B1FA2")} //dark theme #99EBFD
      /* Add this for tooltip */
      useMesh={false}
      enableSlices="x"
      sliceTooltip={({ slice }) => {
        return (
          <div
            style={{
              background: "white",
              padding: "9px 12px",
              border: "1px solid #ccc",
            }}
          >
            <div>x: {slice.points[0].data.x.toString()}</div>
            {slice.points.map((point) => (
              <div
                key={point.id}
                style={{
                  color:
                    point.serieColor === "rgba(255, 255, 255, 0)"
                      ? line1Color
                      : point.serieColor,
                  padding: "3px 0",
                }}
              >
                <strong>{point.serieId}</strong> [{point.data.yFormatted}]
              </div>
            ))}
          </div>
        );
      }}
    />
  );
};

const getColoredAxis = (color: string) => {
  return {
    axis: {
      ticks: {
        line: {
          stroke: color,
        },
        text: { fill: color },
      },
      legend: {
        text: {
          fill: color,
        },
      },
    },
  };
};
