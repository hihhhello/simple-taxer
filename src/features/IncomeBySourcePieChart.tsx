'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

import { formatToUSDCurrency } from '@/shared/utils';

type SourceIncome = {
  sourceName: string | null;
  _sum: { amount: number | null };
};

type IncomeBySourcePieChartProps = {
  transactionsBySourceName: SourceIncome[];
};

export const IncomeBySourcePieChart = ({
  transactionsBySourceName,
}: IncomeBySourcePieChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const width = 928;
    const height = 500;

    // Create the color scale.
    const getColor = d3
      .scaleOrdinal<string>()
      .domain(
        transactionsBySourceName.map(
          (d) => d.sourceName ?? 'Unknown source name',
        ),
      )
      .range(
        d3
          .quantize(
            (t) => d3.interpolateSpectral(t * 0.8 + 0.1),
            transactionsBySourceName.length,
          )
          .reverse(),
      );

    // Create the pie layout and arc generator.
    const pie = d3
      .pie<SourceIncome>()
      .sort(null)
      .value((d) => d._sum.amount ?? 0);

    const arcOuterRadius = Math.min(width, height) / 2 - 1;

    const arc = d3
      .arc<d3.PieArcDatum<SourceIncome>>()
      .innerRadius(0)
      .outerRadius(arcOuterRadius);

    const labelRadius = arcOuterRadius * 0.8;

    // A separate arc generator for labels.
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);

    // Generates a pie for the given array of data, returning an array of objects representing each datum’s arc angles.
    //  {"data":  1, "value":  1, "index": 6, "startAngle": 6.050474740247008, "endAngle": 6.166830023713296, "padAngle": 0}
    const arcs = pie(transactionsBySourceName);

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
      // Fill empty selection with arcs
      .data(arcs)
      // <path> for each element in the "arcs"
      .join('path')
      .attr('fill', ({ data }) =>
        getColor(data.sourceName ?? `Unknown-${data._sum.amount}`),
      )
      // <d> for each <path>
      /**
       * TODO: figure out how "arc" can be assign to "d" attribute and transformed from ArcObject to path commands (See https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#path_commands).
       */
      .attr('d', arc)
      // <title> for each <d>
      .append('title')
      // Specify text node for the <title>
      .text(
        (d) =>
          `${d.data.sourceName}: ${formatToUSDCurrency(
            d.data._sum.amount ?? 0,
          )}`,
      );

    // Add sector labels
    svg
      .append('g')
      .attr('text-anchor', 'middle')
      .selectAll()
      .data(arcs)
      .join('text')
      /**
       * TODO: figure out how "centroid" method works and why TS complains.
       */
      .attr('transform', (d) => `translate(${arcLabel.centroid(d)})`)
      .call((text) =>
        text
          .append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .text(
            ({ data }) => data.sourceName ?? `Unknown-${data._sum.amount ?? 0}`,
          ),
      )
      .call((text) =>
        text
          .append('tspan')
          .attr('x', 0)
          .attr('y', '0.7em')
          .attr('class', 'fill-gray-700')
          .text(({ data }) => formatToUSDCurrency(data._sum.amount ?? 0)),
      );
  }, [transactionsBySourceName]);

  return <svg ref={ref} />;
};
