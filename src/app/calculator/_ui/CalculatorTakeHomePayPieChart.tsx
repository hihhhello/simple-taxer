'use client';

import * as d3 from 'd3';
import { useCallback, useEffect, useRef } from 'react';

import {
  formatUSDCompact,
  formatUSDDecimal,
  formatUSDInteger,
} from '@/shared/utils/helpers';

const colors = {
  blue: '#13165C',
  lightBlue: '#306FD8',
  green: '#5EAC8D',
  yellow: '#F8D35D',
  red: '#F0907D',
};

export type TaxData = {
  name: string;
  amount: number;
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

type CalculatorTakeHomePayPieChartProps = {
  taxData: TaxData[];
};

export const CalculatorTakeHomePayPieChart = ({
  taxData: taxData,
}: CalculatorTakeHomePayPieChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  const getPieSectionColor = useCallback(
    (sourceName: string) => {
      // Map the source name to a number between 0 and 1
      const index = taxData.findIndex((d) => d.name === sourceName);
      const scalePosition = index / (taxData.length - 1);

      // Use the continuous color scale to get the color
      return colorScale(scalePosition);
    },
    [taxData],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const width = 335;
    const height = 335;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(ref.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; height: auto; font-size: 18px;');

    svg.selectAll('g').remove();

    const label = svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', '#888')
      .style('opacity', 0);

    label
      .append('tspan')
      .attr('class', 'percentage')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '-0.1em')
      .attr('font-size', '2rem')
      .text('');

    // Create the pie layout generator..
    const getPieLayout = d3
      .pie<TaxData>()
      .padAngle(0.04)
      .sort(null)
      .value((d) => d.amount);

    const arcOuterRadius = Math.min(width, height) / 2 - 1;

    // Create pie section generator

    const getPieSection = d3
      .arc<d3.PieArcDatum<TaxData>>()
      .innerRadius(radius * 0.67)
      .outerRadius(arcOuterRadius)
      .cornerRadius(15);

    // Generates a pie for the given array of data, returning an array of objects representing each datum’s arc angles.
    //  {"data":  1, "value":  1, "index": 6, "startAngle": 6.050474740247008, "endAngle": 6.166830023713296, "padAngle": 0}
    const pieArcsData = getPieLayout(taxData);

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
      .attr('fill', ({ data }) => getPieSectionColor(data.name))
      // "d" for each <path>
      .attr('d', getPieSection)
      .attr('opacity', 1)
      .on('mouseover', function (e, d) {
        svg
          .selectAll<d3.BaseType, d3.PieArcDatum<TaxData>>('path')
          .transition()
          .duration(300)
          .attr('opacity', (data) => {
            if (data.index === d.index) {
              return 0.85;
            }

            return 0.5;
          });

        label
          .transition()
          .duration(300)
          .style('opacity', 1)
          .select('.percentage')
          .text(formatUSDCompact(d.data.amount));
      })
      .on('mouseout', function (e, d) {
        svg
          .selectAll<d3.BaseType, d3.PieArcDatum<TaxData>>('path')
          .transition()
          .duration(300)
          .attr('opacity', 1);

        label.transition().duration(300).style('opacity', 0);
      })
      // <title> for each <d>
      .append('title')
      // Specify text node for the <title>
      .text((d) => `${d.data.name}: ${formatUSDDecimal(d.data.amount)}`);
  }, [getPieSectionColor, taxData]);

  return (
    <div className="relative ml-2 h-full rounded-lg bg-white p-2 sm:rounded-2xl sm:p-4">
      <div className="absolute -left-1 top-0 -z-10 mt-1 h-[115%] w-full rounded-lg bg-primary-green sm:-left-2 sm:-top-2 sm:h-full sm:rounded-3xl" />

      <div className="flex items-center justify-center rounded-full bg-primary-yellow px-4 py-1 text-sm sm:py-2 sm:text-base">
        <span className="leading-tight text-primary-blue">Take home pay</span>
      </div>

      <div className="mb-8 flex w-full items-center justify-center">
        <div className="h-[335px] w-[335px]">
          <svg ref={ref} />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-10 pb-6">
        {taxData.map(({ amount, name }) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-md bg-primary-background px-4 py-1"
          >
            <div
              style={{
                backgroundColor: String(getPieSectionColor(name)),
              }}
              className="h-5 w-5 rounded-full"
            ></div>

            <div>
              <p className="text-[#2B2C3B]">{name}</p>
            </div>

            <div>
              <p className="font-medium text-[#2B2C3B]">
                {formatUSDInteger(amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
