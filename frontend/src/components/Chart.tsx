import { ResponsiveLine } from "@nivo/line";

const line1Color = "#2E3648"; //dark theme"#FFD200";

type ChartProps = {
  actual: {
    data: { x: string; y: number }[];
    id: string;
  }[];
  prediction: {
    data: { x: string; y: number }[];
    id: string;
  }[];
};
export default function Chart({ actual, prediction }: ChartProps) {
  return (
    <div className="App">
      <div className="wrapper">
        <div className="graphContainer">
          <ResponsiveLine
            data={actual}
            colors={[line1Color]}
            layers={["grid", "axes", "lines", "markers", "legends"]}
            axisLeft={{
              legend: "Actual Sales",
              legendPosition: "middle",
              legendOffset: -50,
            }}
            axisBottom={{
              tickRotation: 75,
              legendOffset: -80,
              legendPosition: "start",
            }}
            theme={getColoredAxis(line1Color)}
            margin={{ top: 50, right: 50, bottom: 60, left: 55 }}
          />
        </div>

        <div className="secondGraph">
          <SecondGraph prediction={prediction} actual={actual} />
        </div>
      </div>
    </div>
  );
}

// I want this to be on top of the other graph
const SecondGraph = ({ prediction, actual }: any) => {
  let data1And2 = actual.concat(prediction);

  return (
    <ResponsiveLine
      data={data1And2}
      xFormat="time:%Y-%m-%d"
      colors={[
        "rgba(255, 255, 255, 0)",
        "#7b1fa2",
      ]} /* Make the first line transparent with 0 opacity */
      margin={{ top: 50, right: 55, bottom: 20, left: 55 }}
      axisRight={{
        legend: "Forecasted Sales",
        legendPosition: "middle",
        legendOffset: 50,
      }}
      axisLeft={null}
      axisTop={null}
      axisBottom={null}
      enableGridY={false}
      enableGridX={false}
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
            <div>date: {slice.points[0].data.x.toString()}</div>
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
