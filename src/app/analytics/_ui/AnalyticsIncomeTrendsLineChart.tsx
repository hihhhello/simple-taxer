'use client';

import * as d3 from 'd3';
import { useCallback, useEffect, useRef } from 'react';

import { AnalyticsIncomeTrend } from '@/shared/types/analyticsTypes';
import { api } from '@/shared/api';
import { Transaction } from '@/shared/types/transactionTypes';
import { formatUSDInteger } from '@/shared/utils/helpers';

type AnalyticsIncomeTrendsLineChartProps = {
  // transactionsByDate: AnalyticsIncomeTrend[];
};

export const AnalyticsIncomeTrendsLineChart = ({} // transactionsByDate,
: AnalyticsIncomeTrendsLineChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);

  const { data: transactions } = api.transactions.getAll.useQuery({});

  useEffect(() => {
    if (!ref.current || !transactions?.data) {
      return;
    }

    const width = 800;
    const height = 260;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('g').remove();
    svg.selectAll('path').remove();

    const xScale = d3
      .scaleUtc([marginLeft, width - marginRight])
      .domain(d3.extent(transactions.data, (d) => d.date) as Iterable<Date>);

    const yScale = d3.scaleLinear(
      [0, d3.max(transactions.data, (d) => d.amount)] as Iterable<number>,
      [height - marginBottom, marginTop],
    );

    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(xScale).ticks(10));

    svg
      .append('g')
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => `${formatUSDInteger(Number(d))}`)
          .ticks(6),
      )
      .attr('transform', `translate(${marginLeft},0)`);

    const line = d3
      .line<Transaction>()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.amount))
      .curve(d3.curveBumpX);

    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(transactions.data));
  }, [transactions?.data]);

  return (
    <div className="rounded-2xl bg-white">
      <div className="mb-4 p-6">
        <p className="text-2xl font-semibold text-primary-blue">
          Income Trends
        </p>
      </div>

      <div className="mb-8 flex w-full items-center justify-center">
        {/* <div className="h-[335px] w-[335px]"> */}
        <svg ref={ref} />
        {/* </div> */}
      </div>
    </div>
  );
};
