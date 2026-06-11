import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type TabbarSwitchIconProps = {
  className?: string;
  propValue?: boolean;
  propValue1?: boolean;
  propValue2?: "左侧" | "右侧";
  onClick?: () => void;
};

function TabbarSwitchIcon({ className, propValue = false, propValue1 = false, propValue2 = "左侧", onClick }: TabbarSwitchIconProps) {
  const isFalseAndTrueAnd = !propValue && propValue1 && propValue2 === "右侧";
  const isFalseAndTrueAnd1 = !propValue && propValue1 && propValue2 === "左侧";
  const isTrueAndFalseAnd = propValue && !propValue1 && propValue2 === "左侧";
  const isTrueAndFalseAnd1 = propValue && !propValue1 && propValue2 === "右侧";
  const isTrueAndFalseAndIsOr = propValue && !propValue1 && ["左侧", "右侧"].includes(propValue2);
  return (
    <div className={className || `h-[36px] relative ${!propValue && !propValue1 && propValue2 === "右侧" ? "" : "w-[28px]"}`} onClick={onClick}>
      <div className="flex flex-row items-center size-full">
        <div className={`content-stretch flex items-center py-[6px] relative size-full ${propValue2 === "右侧" && ((!propValue && !propValue1) || (propValue && !propValue1) || (!propValue && propValue1)) ? "pl-[4px] pr-[8px]" : "pl-[8px] pr-[4px]"}`}>
          <div className={`cursor-pointer content-stretch flex gap-[10px] items-center p-[3px] relative shrink-0 ${isTrueAndFalseAnd || isTrueAndFalseAnd1 || isFalseAndTrueAnd ? "justify-center" : ""}`} data-name="icon-wrapper">
            {propValue2 === "左侧" ? <ChevronLeft className="w-4 h-4 text-gray-500 hover:text-teal-600 transition-colors" /> : <ChevronRight className="w-4 h-4 text-gray-500 hover:text-teal-600 transition-colors" />}
          </div>
        </div>
      </div>
    </div>
  );
}

type DividerProps = {
  className?: string;
  propValue?: "水平" | "垂直";
  propValue1?: boolean;
  propValue2?: boolean;
  propValue3?: "左" | "居中" | "右" | "无";
};

function Divider({ className, propValue = "水平", propValue1 = false, propValue2 = true, propValue3 = "居中" }: DividerProps) {
  return (
    <div className={className || "relative bg-[#e5e6eb] h-[12px] w-px shrink-0"}>
    </div>
  );
}

type TableCategoryTabsProps = {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function TableCategoryTabs({ categories, activeCategory, onSelectCategory }: TableCategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white content-stretch flex items-center relative w-full mb-4">
      <div className="flex flex-row items-center self-stretch">
        <TabbarSwitchIcon className="h-full relative shrink-0 w-[28px]" propValue1 propValue2="左侧" onClick={() => scroll('left')} />
      </div>
      
      <div 
        ref={scrollRef}
        className="content-stretch flex flex-[1_0_0] items-center overflow-x-auto relative no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat, index) => {
          const isActive = cat === activeCategory;
          return (
            <React.Fragment key={cat}>
              {index > 0 && (
                <div className="content-stretch flex items-center relative shrink-0">
                  <Divider className="bg-[#e5e6eb] h-[12px] relative shrink-0" propValue="垂直" propValue2={false} propValue3="无" />
                </div>
              )}
              <div 
                onClick={() => onSelectCategory(cat)}
                className={`cursor-pointer content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[5px] relative shrink-0 hover:opacity-80 transition-opacity`}
              >
                <p 
                  className={`[word-break:break-word] relative shrink-0 text-[14px] whitespace-nowrap ${isActive ? 'font-medium text-[#00aaa6]' : 'font-normal text-[#4e5969]'}`} 
                  style={{ fontFamily: isActive ? "'Roboto:Medium',sans-serif" : "'Roboto:Regular',sans-serif", fontVariationSettings: '"wdth" 100' }}
                >
                  {cat}
                </p>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-row items-center self-stretch">
        <TabbarSwitchIcon className="h-full relative shrink-0 w-[28px]" propValue2="右侧" onClick={() => scroll('right')} />
      </div>
    </div>
  );
}
