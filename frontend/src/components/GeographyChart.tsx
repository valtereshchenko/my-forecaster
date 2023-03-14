import React from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { useTheme } from "@mui/material";

import { geoFeatures } from "../components/data/mockGeoFeatures";
import { mockGeographyData } from "../components/data/mockData";

const GeographyChart = ({ isDashboard = false }) => {
  const theme = useTheme();

  return (
    <ResponsiveChoropleth
      theme={{
        axis: {
          domain: {
            line: {
              stroke: "#e6e6e6",
            },
          },
          legend: {
            text: {
              fill: "#e6e6e6",
            },
          },
          ticks: {
            line: {
              stroke: "#e6e6e6",
              strokeWidth: 1,
            },
            text: {
              fill: "#e6e6e6",
            },
          },
        },
        legends: {
          text: {
            fill: "#e6e6e6",
          },
        },
        tooltip: {
          container: {
            background: "#F2F0F0",
            color: "#e6e6e6",
          },
        },
      }}
      data={mockGeographyData}
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors="nivo"
      domain={[0, 1000000]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 40 : 100}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      enableGraticule={false}
      graticuleLineColor="#444444"
      borderWidth={0.5}
      borderColor="#fff"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: "#e6e6e6",
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#97E3D5",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default GeographyChart;
