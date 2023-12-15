'use client';

import * as d3 from 'd3';
import { useCallback, useEffect, useRef } from 'react';

import { formatUSDInteger } from '@/shared/utils/helpers';
import { AnalyticsIncomeTrend } from '@/shared/types/analyticsTypes';

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

type AnalyticsIncomeTrendsLineChartProps = {
  transactionsByDate: AnalyticsIncomeTrend[];
};

export const AnalyticsIncomeTrendsLineChart = ({
  transactionsByDate,
}: AnalyticsIncomeTrendsLineChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc(
      d3.extent(transactionsByDate, (d) => d.date),
      [marginLeft, width - marginRight],
    );

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear(
      [0, d3.max(aapl, (d) => d.close)],
      [height - marginBottom, marginTop],
    );

    // Declare the line generator.
    const line = d3
      .line<AnalyticsIncomeTrend>()
      .x((d) => x(d.date))
      .y((d) => y(d._sum.amount));

    // Create the SVG container.
    const svg = d3
      .create('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');
  }, [transactionsByDate]);

  return (
    <div className="rounded-2xl bg-white">
      <div className="mb-4 p-6">
        <p className="text-2xl font-semibold text-primary-blue">
          Income Trends
        </p>
      </div>

      <div className="mb-8 flex w-full items-center justify-center">
        <div className="h-[335px] w-[335px]">
          <svg ref={ref} />
        </div>
      </div>
    </div>
  );
};
