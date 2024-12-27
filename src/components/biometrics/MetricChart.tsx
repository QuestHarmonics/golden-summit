import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MetricChartProps {
  title: string;
  data: any[];
  metrics: {
    key: string;
    label: string;
    color?: string;
  }[];
  type: 'line' | 'bar' | 'stacked-bar';
}

export function MetricChart({ title, data, metrics, type }: MetricChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.timestamp)) as [Date, Date])
      .range([0, width]);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => 
        Math.max(...metrics.map(m => d[m.key]))
      ) as number])
      .range([height, 0]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    if (type === 'line') {
      // Create line generator
      const line = d3.line<any>()
        .x(d => x(new Date(d.timestamp)))
        .y(d => y(d.value));

      // Add lines for each metric
      metrics.forEach((metric, i) => {
        const color = metric.color || d3.schemeCategory10[i];
        
        svg.append('path')
          .datum(data.map(d => ({
            timestamp: d.timestamp,
            value: d[metric.key]
          })))
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('d', line);
      });
    } else if (type === 'stacked-bar') {
      const stack = d3.stack()
        .keys(metrics.map(m => m.key))
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

      const stackedData = stack(data);

      const color = d3.scaleOrdinal()
        .domain(metrics.map(m => m.key))
        .range(d3.schemeCategory10);

      svg.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key as string))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => x(new Date(d.data.timestamp)))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', width / data.length * 0.8);
    }

    // Add legend
    const legend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('g')
      .data(metrics)
      .join('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    legend.append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d, i) => d.color || d3.schemeCategory10[i]);

    legend.append('text')
      .attr('x', width - 24)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .text(d => d.label);

  }, [data, metrics, type]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <svg ref={svgRef} className="w-full" />
    </div>
  );
} 