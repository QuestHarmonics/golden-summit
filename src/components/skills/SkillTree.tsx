import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SkillNode, SkillTreeData } from '../../types/skills';
import { Card } from '../shared/Card';
import { ProgressBar } from '../shared/ProgressBar';

interface SkillTreeProps {
  data: SkillTreeData;
  onNodeClick?: (node: SkillNode) => void;
}

export function SkillTree({ data, onNodeClick }: SkillTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [tooltip, setTooltip] = useState<{ node: SkillNode; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1200;
    const height = 800;
    const nodeRadius = 30;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(0,0)');

    // Create the tree layout
    const tree = d3.tree<SkillNode>()
      .size([width - 100, height - 100])
      .nodeSize([80, 160]);

    // Create hierarchy from data
    const root = d3.stratify<SkillNode>()
      .id(d => d.id)
      .parentId(d => d.prerequisites[0])(data.nodes);

    const treeData = tree(root);

    // Draw connections
    svg.selectAll('path.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      )
      .style('fill', 'none')
      .style('stroke', '#cbd5e1')
      .style('stroke-width', 2);

    // Create node groups
    const node = svg.selectAll('g.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Add circles for nodes
    node.append('circle')
      .attr('r', nodeRadius)
      .style('fill', d => d.data.unlocked ? '#3b82f6' : '#94a3b8')
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        setTooltip({
          node: d.data,
          x: event.pageX,
          y: event.pageY
        });
      })
      .on('mouseout', () => setTooltip(null))
      .on('click', (_, d) => {
        setSelectedNode(d.data);
        onNodeClick?.(d.data);
      });

    // Add icons
    node.append('image')
      .attr('x', -nodeRadius/2)
      .attr('y', -nodeRadius/2)
      .attr('width', nodeRadius)
      .attr('height', nodeRadius)
      .attr('href', d => d.data.icon)
      .style('pointer-events', 'none');

    // Add labels
    node.append('text')
      .attr('dy', nodeRadius + 20)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .style('font-size', '12px')
      .style('fill', '#1f2937')
      .style('pointer-events', 'none');

  }, [data, onNodeClick]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        className="w-full overflow-visible"
        style={{ minHeight: '800px' }}
      />
      
      {tooltip && (
        <div
          className="absolute z-10 p-4 bg-white rounded-lg shadow-lg"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            maxWidth: '300px'
          }}
        >
          <h3 className="font-semibold mb-2">{tooltip.node.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{tooltip.node.description}</p>
          <div className="text-sm">
            Level {tooltip.node.level}/{tooltip.node.maxLevel}
          </div>
          <ProgressBar
            value={tooltip.node.experience}
            max={tooltip.node.maxExperience}
            className="mt-2"
          />
        </div>
      )}

      {selectedNode && (
        <Card className="absolute right-4 top-4 w-80">
          <h2 className="text-xl font-semibold mb-4">{selectedNode.name}</h2>
          <p className="text-gray-600 mb-4">{selectedNode.description}</p>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-1">
                Level {selectedNode.level}/{selectedNode.maxLevel}
              </div>
              <ProgressBar
                value={selectedNode.experience}
                max={selectedNode.maxExperience}
              />
            </div>
            {selectedNode.prerequisites.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-1">Prerequisites</div>
                <div className="text-sm text-gray-600">
                  {selectedNode.prerequisites.join(', ')}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
} 