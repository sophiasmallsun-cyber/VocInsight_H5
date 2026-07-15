import React from 'react';
import { ConcernData } from '../types';

interface ConcernBarChartProps {
  title: string;
  data: ConcernData[];
  selectedItem?: string | null;
  onItemClick?: (name: string) => void;
  ticks?: string[];
}

export default function ConcernBarChart({
  title,
  data,
  selectedItem,
  onItemClick,
  ticks = ['0%', '20%', '40%', '60%', '80%', '100%']
}: ConcernBarChartProps) {
  return (
    <div className="bg-white rounded-[4px] border border-[#e5e6eb] px-5 py-4 shadow-xs flex flex-col h-full w-full">
      {/* Header containing Title and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-4">
        <p className="font-sans font-medium text-[#1d2129] text-[16px] leading-[24px]">
          {title}
        </p>
        
        {/* Sentiment Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-1.5 items-center py-0.5">
            <span className="w-2.5 h-2.5 bg-[#F76560] rounded-[2px] block shrink-0" />
            <span className="font-sans font-normal text-[#4e5969] text-xs whitespace-nowrap">
              Positive Sentiment
            </span>
          </div>
          <div className="flex gap-1.5 items-center py-0.5">
            <span className="w-2.5 h-2.5 bg-[#4080FF] rounded-[2px] block shrink-0" />
            <span className="font-sans font-normal text-[#4e5969] text-xs whitespace-nowrap">
              Negative Sentiment
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout of Axis Labels + Chart Area */}
      <div className="flex flex-row relative select-none flex-grow">
        
        {/* 1. Left Y-Axis: Labels Column */}
        <div className="w-[90px] sm:w-[120px] md:w-[170px] shrink-0 flex flex-col justify-between py-2 pr-2 md:pr-3.5 gap-4">
          {data.map((item) => {
            const isClickable = !!onItemClick;
            const isSelected = selectedItem === item.name;
            return (
              <div
                key={item.name}
                onClick={() => onItemClick && onItemClick(item.name)}
                className={`h-[22px] flex items-center justify-end text-right transition-all truncate text-xs font-sans font-medium ${
                  isClickable ? 'cursor-pointer hover:text-[#00AAA6]' : ''
                } ${isSelected ? 'text-[#00AAA6] font-bold scale-[1.03]' : 'text-[#86909c]'}`}
                title={item.name}
              >
                {item.name}
              </div>
            );
          })}
          {/* Bottom margin spacer to align horizontally with the bottom ticks */}
          <div className="h-4" />
        </div>

        {/* 2. Right Plot: Grid area containing bars + ticks */}
        <div className="flex-grow relative flex flex-col pt-2 pb-5 gap-4 border-l border-[#e5e6eb]">
          
          {/* Transparent Vertical Ticks Backdrop Layer */}
          <div className="absolute inset-x-0 top-0 bottom-[20px] flex justify-between pointer-events-none z-0">
            {ticks.map((_, index) => {
              const positionPercent = (index / (ticks.length - 1)) * 100;
              return (
                <div
                  key={index}
                  style={{ left: `${positionPercent}%` }}
                  className={`absolute top-0 bottom-0 w-px border-l ${
                    index === 0 ? 'border-solid border-[#e5e6eb]' : 'border-dashed border-[#e5e6eb]/65'
                  }`}
                />
              );
            })}
          </div>

          {/* Foreground Rows Area */}
          <div className="relative z-10 flex flex-col gap-4 flex-grow">
            {data.map((item) => {
              const isClickable = !!onItemClick;
              const isSelected = selectedItem === item.name;

              // Calculate proportional sizes for segments
              const positiveRatio = item.positive / item.total;
              const negativeRatio = item.negative / item.total;

              return (
                <div
                  key={item.name}
                  onClick={() => onItemClick && onItemClick(item.name)}
                  className={`group h-[22px] flex items-center relative transition-all duration-200 px-2 py-1 rounded-[4px] border ${
                    isClickable ? 'cursor-pointer hover:bg-slate-50/70 hover:border-slate-100' : ''
                  } ${
                    isSelected ? 'bg-[#E6F8F8] border-[#00AAA6] shadow-xs' : 'border-transparent bg-transparent'
                  }`}
                >
                  {/* Left accent highlighting active state bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00aaa6] rounded-l-[3px]" />
                  )}

                  {/* Horizontal Bar stack and Value */}
                  <div className="w-full flex items-center z-10">
                    <div
                      style={{ width: `${item.total}%` }}
                      className="flex h-[14px] sm:h-[18px] bg-[#fafbfc] border border-gray-100 rounded-[2px] overflow-hidden transition-all duration-300 relative shrink-0"
                    >
                      {/* Positive Segment */}
                      <div
                        style={{ width: `${positiveRatio * 100}%` }}
                        className="bg-[#F76560] h-full transition-all duration-300 flex items-center justify-center px-1 shrink-0"
                        title={`Positive Sentiment Distribution: ${item.positive}%`}
                      >
                        {item.positive > 12 && (
                          <span className="text-[9px] sm:text-[10px] font-semibold text-white font-mono truncate">
                            {item.positive}%
                          </span>
                        )}
                      </div>
                      
                      {/* Negative Segment */}
                      <div
                        style={{ width: `${negativeRatio * 100}%` }}
                        className="bg-[#4080FF] h-full transition-all duration-300 flex items-center justify-center px-1 shrink-0"
                        title={`Negative Sentiment Distribution: ${item.negative}%`}
                      >
                        {item.negative > 12 && (
                          <span className="text-[9px] sm:text-[10px] font-semibold text-white font-mono truncate">
                            {item.negative}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Numeric Value Label */}
                    <span 
                      className={`font-mono font-bold text-[11px] sm:text-[12px] ml-2.5 whitespace-nowrap transition-colors ${
                        isSelected ? 'text-[#00AAA6] scale-[1.03]' : 'text-gray-700'
                      }`}
                    >
                      {item.total}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Absolute Bottom Ticks Labels */}
          <div className="absolute left-0 bottom-0 right-0 h-4 flex justify-between select-none pointer-events-none z-10">
            {ticks.map((tick, index) => {
              const positionPercent = (index / (ticks.length - 1)) * 100;
              return (
                <div
                  key={index}
                  style={{ left: `${positionPercent}%` }}
                  className="absolute -translate-x-1/2 text-[9px] sm:text-[10px] font-mono text-[#86909c] font-normal"
                >
                  {tick}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
