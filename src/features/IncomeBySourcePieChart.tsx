'use client';

import * as d3 from 'd3';
import { useCallback, useEffect, useRef } from 'react';

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

  const getPieSectionColor = useCallback(
    (sourceName: string) => {
      // Map the source name to a number between 0 and 1
      const index = transactionsBySourceName.findIndex(
        (d) => d.sourceName === sourceName,
      );
      const scalePosition = index / (transactionsBySourceName.length - 1);

      // Use the continuous color scale to get the color
      return colorScale(scalePosition);
    },
    [transactionsBySourceName],
  );

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const width = 335;
    const height = 335;
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

    // Generates a pie for the given array of data, returning an array of objects representing each datum’s arc angles.
    //  {"data":  1, "value":  1, "index": 6, "startAngle": 6.050474740247008, "endAngle": 6.166830023713296, "padAngle": 0}
    const pieArcsData = getPieLayout(transactionsBySourceName);

    const svg = d3
      .select<SVGElement, d3.PieArcDatum<AnalyticsSourceIncome>>(ref.current)
      .attr('width', '100%')
      .attr('height', '100%')
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
      .attr('opacity', 1)
      .on('mouseover', function (e, d) {
        svg
          .selectAll<d3.BaseType, d3.PieArcDatum<AnalyticsSourceIncome>>('path')
          .transition()
          .duration(300)
          .attr('opacity', (data) => {
            if (data.index === d.index) {
              return 0.85;
            }

            return 0.5;
          });
      })
      .on('mouseout', function (e, d) {
        svg
          .selectAll<d3.BaseType, d3.PieArcDatum<AnalyticsSourceIncome>>('path')
          .transition()
          .duration(300)
          .attr('opacity', 1);
      })
      // <title> for each <d>
      .append('title')
      // Specify text node for the <title>
      .text(
        (d) =>
          `${d.data.sourceName}: ${formatUSDDecimal(d.data._sum.amount ?? 0)}`,
      );
  }, [getPieSectionColor, transactionsBySourceName]);

  return (
    <div className="rounded-2xl bg-white">
      <div className="mb-4 p-6">
        <p className="text-2xl font-semibold text-primary-blue">
          Income Distribution
        </p>
      </div>

      <div className="mb-8 flex w-full items-center justify-center">
        <div className="h-[335px] w-[335px]">
          <svg ref={ref} />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-10 pb-6">
        {transactionsBySourceName.map(({ _sum, sourceName }) => (
          <div
            key={sourceName}
            className="flex items-center justify-between rounded-md bg-primary-background px-4 py-1"
          >
            {sourceName && (
              <div
                style={{
                  backgroundColor: String(getPieSectionColor(sourceName)),
                }}
                className="h-5 w-5 rounded-full"
              ></div>
            )}

            <div>
              <p className="text-[#2B2C3B]">{sourceName}</p>
            </div>

            <div>
              <p>xx%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
