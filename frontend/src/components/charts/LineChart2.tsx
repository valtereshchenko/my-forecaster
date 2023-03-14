import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { mockLineData } from "../data/mockData";

export default function LineChart2() {
  return <ResponsiveLine data={mockLineData} />;
}
