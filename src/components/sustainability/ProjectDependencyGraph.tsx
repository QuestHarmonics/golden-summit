import React, { useEffect, useRef } from 'react';
import { SUSTAINABILITY_PROJECTS } from '../../types/sustainability/projects';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  readiness: number;
}

interface Link {
  source: string;
  target: string;
  type: 'project' | 'resource' | 'skill';
}

export function ProjectDependencyGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const nodes: Node[] = Object.values(SUSTAINABILITY_PROJECTS).map(project => ({
      id: project.id,
      name: project.name,
      status: 'locked',
      readiness: 0
    }));

    const links: Link[] = [];
    Object.values(SUSTAINABILITY_PROJECTS).forEach(project => {
      project.dependencies.projects?.forEach(dep => {
        links.push({
          source: dep,
          target: project.id,
          type: 'project'
        });
      });
    });

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Clear previous content
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => getColorForLinkType(d.type))
      .attr('stroke-width', 2);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');

    node.append('circle')
      .attr('r', 20)
      .attr('fill', d => getColorForStatus(d.status));

    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', 30)
      .attr('class', 'font-pixel text-xs fill-current text-gray-300');

    // Add progress indicators
    node.append('circle')
      .attr('r', 20)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', d => `${d.readiness * 125.6} 125.6`);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="font-pixel text-white mb-4">PROJECT DEPENDENCIES</h2>
      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-full" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-300">Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-300">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-300">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-300">Completed</span>
        </div>
      </div>
    </div>
  );
}

function getColorForStatus(status: Node['status']): string {
  switch (status) {
    case 'locked': return '#EF4444';
    case 'available': return '#F59E0B';
    case 'in-progress': return '#3B82F6';
    case 'completed': return '#10B981';
  }
}

function getColorForLinkType(type: Link['type']): string {
  switch (type) {
    case 'project': return '#6B7280';
    case 'resource': return '#8B5CF6';
    case 'skill': return '#F59E0B';
  }
} 