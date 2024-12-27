import React from 'react';
import { Line } from 'react-chartjs-2';
import { tutorials } from '../../../data/tutorials';

export function CompletionRateChart() {
  const data = {
    labels: Object.values(tutorials).map(t => t.title),
    datasets: [
      {
        label: 'Completion Rate',
        data: [85, 76, 92, 68, 88, 79],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tutorial Completion Rates'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <Line data={data} options={options} />
    </div>
  );
} 