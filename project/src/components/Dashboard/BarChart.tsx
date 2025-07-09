import React from 'react';

interface BarChartProps {
  data: {
    day: string;
    borrowed: number;
    returned: number;
  }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.borrowed, d.returned]));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Equipment Borrow/Return</h3>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>{item.day}</span>
            </div>
            
            {/* Borrowed Bar */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-blue-600 font-medium w-16">Borrowed</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(item.borrowed / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">
                {item.borrowed}
              </span>
            </div>
            
            {/* Returned Bar */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-green-600 font-medium w-16">Returned</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(item.returned / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">
                {item.returned}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;