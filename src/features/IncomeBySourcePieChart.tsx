'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

import { formatUSDDecimal } from '@/shared/utils/helpers';
import { AnalyticsSourceIncome } from '@/shared/types/analyticsTypes';

const colors = {
  blue: '#13165C',
  lightBlue: '#306FD8',
  green: '#5EAC8D',
  yellow: '#F8D35D',
  red: '#F0907D',
};

// Create an array of your colors
const colorRange = [colors.lightBlue, colors.red];

// Create a linear scale
const colorScale = d3
  .scaleLinear()
  .domain([0, 1, 2, 3]) // Define domains based on the number of colors
  //@ts-ignore
  .range(colorRange) // Use your color range
  //@ts-ignore
  .interpolate(d3.interpolateHsl); // Choose an interpolation method

type IncomeBySourcePieChartProps = {
  transactionsBySourceName: AnalyticsSourceIncome[];
};

export const IncomeBySourcePieChart = ({
  transactionsBySourceName,
}: IncomeBySourcePieChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  const getPieSectionColor = (sourceName: string) => {
    // Map the source name to a number between 0 and 1
    const index = transactionsBySourceName.findIndex(
      (d) => d.sourceName === sourceName,
    );
    const scalePosition = index / (transactionsBySourceName.length - 1);

    // Use the continuous color scale to get the color
    return colorScale(scalePosition);
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const width = 928;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    // Create the color scale.

    // Create the pie layout and arc generator.
    const getPieLayout = d3
      .pie<AnalyticsSourceIncome>()
      .padAngle(0.04)
      .sort(null)
      .value((d) => d._sum.amount ?? 0);

    const arcOuterRadius = Math.min(width, height) / 2 - 1;

    const getPieSection = d3
      .arc<d3.PieArcDatum<AnalyticsSourceIncome>>()
      .innerRadius(radius * 0.67)
      .outerRadius(arcOuterRadius)
      .cornerRadius(15);

    const labelRadius = arcOuterRadius * 0.8;

    // A separate arc generator for labels.
    const getPieLabelArc = d3
      .arc<d3.PieArcDatum<AnalyticsSourceIncome>>()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    // Generates a pie for the given array of data, returning an array of objects representing each datum’s arc angles.
    //  {"data":  1, "value":  1, "index": 6, "startAngle": 6.050474740247008, "endAngle": 6.166830023713296, "padAngle": 0}
    const pieArcsData = getPieLayout(transactionsBySourceName);

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto; font-size: 18px;');

    // Add colored sectors
    svg
      // Add single <g> to group all colored sectors
      .append('g')
      .attr('stroke', 'white')
      // Create empty Selection
      .selectAll()
      // Fill empty selection with pie arcs
      .data(pieArcsData)
      // <path> for each element in the "arcs"
      .join('path')
      .attr('fill', ({ data }) =>
        getPieSectionColor(data.sourceName ?? `Unknown-${data._sum.amount}`),
      )
      // "d" for each <path>
      .attr('d', getPieSection)
      // <title> for each <d>
      .append('title')
      // Specify text node for the <title>
      .text(
        (d) =>
          `${d.data.sourceName}: ${formatUSDDecimal(d.data._sum.amount ?? 0)}`,
      );

    // Add sector labels
    svg
      .append('g')
      .attr('text-anchor', 'middle')
      .selectAll()
      .data(pieArcsData)
      .join('text')
      .attr('transform', (d) => `translate(${getPieLabelArc.centroid(d)})`);
  }, [getPieSectionColor, transactionsBySourceName]);

  return <svg ref={ref} />;
};
