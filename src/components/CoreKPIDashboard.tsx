import React, { useState, useContext } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

export default function CoreKPIDashboard() {
  const { t } = useContext(LanguageContext);

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const trendData = [
    { date: '2026-05-08', volume: 1, rating: 4.2 },
    { date: '2026-05-10', volume: 2, rating: 4.8 },
    { date: '2026-05-15', volume: 4, rating: 3.9 },
    { date: '2026-05-21', volume: 2, rating: 4.5 },
    { date: '2026-05-23', volume: 1, rating: 4.0 },
    { date: '2026-05-24', volume: 1, rating: 3.6 },
    { date: '2026-05-28', volume: 2, rating: 4.3 },
    { date: '2026-06-01', volume: 4, rating: 4.1 },
    { date: '2026-06-02', volume: 2, rating: 4.7 },
    { date: '2026-06-04', volume: 2, rating: 4.0 },
  ];

  const [range, setRange] = useState<[number, number]>([0, trendData.length - 1]);
  const filteredData = trendData.slice(range[0], range[1] + 1);

  const [activeDrag, setActiveDrag] = useState<'left' | 'right' | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const getPercent = (i: number) => (i / (trendData.length - 1)) * 100;

  React.useEffect(() => {
    if (!activeDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const idx = Math.round(pct * (trendData.length - 1));

      if (activeDrag === 'left') {
        const val = Math.min(idx, range[1]);
        setRange([Math.max(0, val), range[1]]);
      } else {
        const val = Math.max(idx, range[0]);
        setRange([range[0], Math.min(trendData.length - 1, val)]);
      }
    };

    const handleMouseUp = () => {
      setActiveDrag(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDrag, range, trendData.length]);

  React.useEffect(() => {
    if (!activeDrag) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!trackRef.current || e.touches.length === 0) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = e.touches[0].clientX;
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const idx = Math.round(pct * (trendData.length - 1));

      if (activeDrag === 'left') {
        const val = Math.min(idx, range[1]);
        setRange([Math.max(0, val), range[1]]);
      } else {
        const val = Math.max(idx, range[0]);
        setRange([range[0], Math.min(trendData.length - 1, val)]);
      }
    };

    const handleTouchEnd = () => {
      setActiveDrag(null);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeDrag, range, trendData.length]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const ExpandIcon = ({ expanded }: { expanded: boolean }) => (
    <span className="mr-2 inline-flex items-center justify-center w-4 h-4">
      {expanded ? <ChevronDown size={14} className="text-[#86909c]" /> : <ChevronRight size={14} className="text-[#86909c]" />}
    </span>
  );

  return (
    <div className="flex flex-col gap-4 w-full h-full min-w-0">
      <div className="border border-[#e5e6eb] rounded-[4px] overflow-hidden overflow-x-auto -mx-3 md:mx-0">
        <table className="w-full text-left border-collapse text-[12px] md:text-[13px] font-sans whitespace-nowrap min-w-[750px] md:min-w-[900px]">
          <thead className="bg-[#f2f3f5] text-[#4e5969] font-medium border-b border-[#e5e6eb]">
            <tr>
              <th className="py-3 px-4 font-medium" width="25%">{t('Country / Brand / Series / Product/domain')}</th>
              <th className="py-3 px-4 font-medium" width="10%">{t('Total Mentions')}</th>
              <th className="py-3 px-4 font-medium" width="15%">{t('Star Rating')}</th>
              <th className="py-3 px-4 font-medium" width="12%">{t('Positive (4-5★)')}</th>
              <th className="py-3 px-4 font-medium" width="12%">{t('Negative (1-3★)')}</th>
              <th className="py-3 px-4 font-medium" width="13%">{t('Positive Rate')}</th>
              <th className="py-3 px-4 font-medium" width="13%">{t('Negative Rate')}</th>
            </tr>
          </thead>
          <tbody className="text-[#1d2129]">
            {/* US */}
            <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 cursor-pointer" onClick={() => toggleNode('US')}>
              <td className="py-3 px-4 flex items-center font-medium"><ExpandIcon expanded={!!expandedNodes['US']} />🇺🇸 <span className="ml-1">{t('United States')}</span></td>
              <td className="py-3 px-4">1.42K</td>
              <td className="py-3 px-4 font-medium text-[#ff7d00]">★★★★☆ <span className="text-[#1d2129] ml-1">4.0</span></td>
              <td className="py-3 px-4">1.05K</td>
              <td className="py-3 px-4">365</td>
              <td className="py-3 px-4 text-[#F53F3F] font-medium">74.27%</td>
              <td className="py-3 px-4 text-[#165DFF] font-medium">25.72%</td>
            </tr>
            {expandedNodes['US'] && (
              <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 cursor-pointer bg-slate-50/50" onClick={() => toggleNode('US-H')}>
                <td className="py-3 px-4 pl-10 flex items-center text-[#4e5969] font-medium"><ExpandIcon expanded={!!expandedNodes['US-H']} />Hisense</td>
                <td className="py-3 px-4 text-[#4e5969]">483</td>
                <td className="py-3 px-4 text-[#ff7d00] font-medium">★★★★☆ <span className="text-[#1d2129] ml-1">4.0</span></td>
                <td className="py-3 px-4 text-[#4e5969]">361</td>
                <td className="py-3 px-4 text-[#4e5969]">122</td>
                <td className="py-3 px-4 text-[#F53F3F] font-medium">74.74%</td>
                <td className="py-3 px-4 text-[#165DFF] font-medium">25.25%</td>
              </tr>
            )}
            {expandedNodes['US'] && expandedNodes['US-H'] && (
              <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 cursor-pointer bg-slate-50/50" onClick={() => toggleNode('US-H-R6')}>
                <td className="py-3 px-4 pl-[72px] flex items-center text-[#4e5969]"><ExpandIcon expanded={!!expandedNodes['US-H-R6']} />R6 Series</td>
                <td className="py-3 px-4 text-[#4e5969]">166</td>
                <td className="py-3 px-4 text-[#ff7d00] font-medium">★★★☆☆ <span className="text-[#1d2129] ml-1">3.9</span></td>
                <td className="py-3 px-4 text-[#4e5969]">122</td>
                <td className="py-3 px-4 text-[#4e5969]">44</td>
                <td className="py-3 px-4 text-[#F53F3F] font-medium">73.49%</td>
                <td className="py-3 px-4 text-[#165DFF] font-medium">26.50%</td>
              </tr>
            )}
            {expandedNodes['US'] && expandedNodes['US-H'] && expandedNodes['US-H-R6'] && (
              <>
                <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 bg-slate-50/50 cursor-pointer" onClick={() => toggleNode('US-H-R6-58R6')}>
                  <td className="py-3 px-4 pl-[112px] text-[#4e5969] flex items-center">
                    <ExpandIcon expanded={!!expandedNodes['US-H-R6-58R6']} />
                    <span className="font-medium text-[#1d2129]">58R6-US</span>
                  </td>
                  <td className="py-3 px-4 text-[#4e5969] font-medium">104</td>
                  <td className="py-3 px-4 font-medium text-[#ff7d00]">★★★☆☆ <span className="text-[#1d2129] ml-1">3.9</span></td>
                  <td className="py-3 px-4 text-[#4e5969]">74</td>
                  <td className="py-3 px-4 text-[#4e5969]">30</td>
                  <td className="py-3 px-4 text-[#F53F3F] font-medium">71.15%</td>
                  <td className="py-3 px-4 text-[#165DFF] font-medium">28.84%</td>
                </tr>
                {expandedNodes['US-H-R6-58R6'] && (
                  <>
                    <tr className="border-b border-[#e5e6eb]/80 hover:bg-slate-50 bg-slate-50/30 text-[12px] text-[#a0a5b1]">
                      <td className="py-2 px-4 pl-[144px] flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] mr-2" />
                        <span>Amazon</span>
                      </td>
                      <td className="py-2 px-4">64</td>
                      <td className="py-2 px-4 font-medium text-[#ff7d00]/70">★★★★☆ <span className="text-gray-500 ml-1">4.1</span></td>
                      <td className="py-2 px-4">48</td>
                      <td className="py-2 px-4">16</td>
                      <td className="py-2 px-4 text-[#F53F3F]/70 font-medium">75.00%</td>
                      <td className="py-2 px-4 text-[#165DFF]/70 font-medium">25.00%</td>
                    </tr>
                    <tr className="border-b border-[#e5e6eb]/80 hover:bg-slate-50 bg-slate-50/30 text-[12px] text-[#a0a5b1]">
                      <td className="py-2 px-4 pl-[144px] flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] mr-2" />
                        <span>Best Buy</span>
                      </td>
                      <td className="py-2 px-4">40</td>
                      <td className="py-2 px-4 font-medium text-[#ff7d00]/70">★★★☆☆ <span className="text-gray-500 ml-1">3.6</span></td>
                      <td className="py-2 px-4">26</td>
                      <td className="py-2 px-4">14</td>
                      <td className="py-2 px-4 text-[#F53F3F]/70 font-medium">65.00%</td>
                      <td className="py-2 px-4 text-[#165DFF]/70 font-medium">35.00%</td>
                    </tr>
                  </>
                )}

                <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 bg-slate-50/50 cursor-pointer" onClick={() => toggleNode('US-H-R6-65R6')}>
                  <td className="py-3 px-4 pl-[112px] text-[#4e5969] flex items-center">
                    <ExpandIcon expanded={!!expandedNodes['US-H-R6-65R6']} />
                    <span className="font-medium text-[#1d2129]">65R6-US</span>
                  </td>
                  <td className="py-3 px-4 text-[#4e5969] font-medium">30</td>
                  <td className="py-3 px-4 font-medium text-[#ff7d00]">★★★☆☆ <span className="text-[#1d2129] ml-1">3.6</span></td>
                  <td className="py-3 px-4 text-[#4e5969]">20</td>
                  <td className="py-3 px-4 text-[#4e5969]">10</td>
                  <td className="py-3 px-4 text-[#F53F3F] font-medium">66.66%</td>
                  <td className="py-3 px-4 text-[#165DFF] font-medium">33.33%</td>
                </tr>
                {expandedNodes['US-H-R6-65R6'] && (
                  <>
                    <tr className="border-b border-[#e5e6eb]/80 hover:bg-slate-50 bg-slate-50/30 text-[12px] text-[#a0a5b1]">
                      <td className="py-2 px-4 pl-[144px] flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] mr-2" />
                        <span>Amazon</span>
                      </td>
                      <td className="py-2 px-4">20</td>
                      <td className="py-2 px-4 font-medium text-[#ff7d00]/70">★★★★☆ <span className="text-gray-500 ml-1">3.8</span></td>
                      <td className="py-2 px-4">14</td>
                      <td className="py-2 px-4">6</td>
                      <td className="py-2 px-4 text-[#F53F3F]/70 font-medium">70.00%</td>
                      <td className="py-2 px-4 text-[#165DFF]/70 font-medium">30.00%</td>
                    </tr>
                    <tr className="border-b border-[#e5e6eb]/80 hover:bg-slate-50 bg-slate-50/30 text-[12px] text-[#a0a5b1]">
                      <td className="py-2 px-4 pl-[144px] flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cbd5e1] mr-2" />
                        <span>Best Buy</span>
                      </td>
                      <td className="py-2 px-4">10</td>
                      <td className="py-2 px-4 font-medium text-[#ff7d00]/70">★★★☆☆ <span className="text-gray-500 ml-1">3.2</span></td>
                      <td className="py-2 px-4">6</td>
                      <td className="py-2 px-4">4</td>
                      <td className="py-2 px-4 text-[#F53F3F]/70 font-medium">60.00%</td>
                      <td className="py-2 px-4 text-[#165DFF]/70 font-medium">40.00%</td>
                    </tr>
                  </>
                )}
              </>
            )}

            {/* UK */}
            <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 cursor-pointer" onClick={() => toggleNode('UK')}>
              <td className="py-3 px-4 flex items-center font-medium"><ExpandIcon expanded={!!expandedNodes['UK']} />🇬🇧 <span className="ml-1">{t('United Kingdom')}</span></td>
              <td className="py-3 px-4">0.98K</td>
              <td className="py-3 px-4 font-medium text-[#ff7d00]">★★★★☆ <span className="text-[#1d2129] ml-1">4.1</span></td>
              <td className="py-3 px-4">725</td>
              <td className="py-3 px-4">255</td>
              <td className="py-3 px-4 text-[#F53F3F] font-medium">73.97%</td>
              <td className="py-3 px-4 text-[#165DFF] font-medium">26.03%</td>
            </tr>
            {expandedNodes['UK'] && (
              <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 bg-slate-50/50">
                <td className="py-3 px-4 pl-10 text-[#4e5969]">Hisense UK</td>
                <td className="py-3 px-4 text-[#4e5969]">310</td>
                <td className="py-3 px-4 text-[#ff7d00] font-medium">★★★★☆ <span className="text-[#1d2129] ml-1">4.2</span></td>
                <td className="py-3 px-4 text-[#4e5969]">240</td>
                <td className="py-3 px-4 text-[#4e5969]">70</td>
                <td className="py-3 px-4 text-[#F53F3F] font-medium">77.41%</td>
                <td className="py-3 px-4 text-[#165DFF] font-medium">22.58%</td>
              </tr>
            )}

            {/* Germany */}
            <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 cursor-pointer" onClick={() => toggleNode('DE')}>
              <td className="py-3 px-4 flex items-center font-medium"><ExpandIcon expanded={!!expandedNodes['DE']} />🇩🇪 <span className="ml-1">{t('Germany')}</span></td>
              <td className="py-3 px-4">1.15K</td>
              <td className="py-3 px-4 font-medium text-[#ff7d00]">★★★★☆ <span className="text-[#1d2129] ml-1">4.3</span></td>
              <td className="py-3 px-4">910</td>
              <td className="py-3 px-4">240</td>
              <td className="py-3 px-4 text-[#F53F3F] font-medium">79.13%</td>
              <td className="py-3 px-4 text-[#165DFF] font-medium">20.87%</td>
            </tr>

            {/* Italy */}
            <tr className="border-b border-[#e5e6eb] hover:bg-slate-50 cursor-pointer" onClick={() => toggleNode('IT')}>
              <td className="py-3 px-4 flex items-center font-medium"><ExpandIcon expanded={!!expandedNodes['IT']} />🇮🇹 <span className="ml-1">{t('Italy')}</span></td>
              <td className="py-3 px-4">0.65K</td>
              <td className="py-3 px-4 font-medium text-[#ff7d00]">★★★★☆ <span className="text-[#1d2129] ml-1">3.8</span></td>
              <td className="py-3 px-4">450</td>
              <td className="py-3 px-4">200</td>
              <td className="py-3 px-4 text-[#F53F3F] font-medium">69.23%</td>
              <td className="py-3 px-4 text-[#165DFF] font-medium">30.76%</td>
            </tr>

            {/* Malaysia */}
            <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => toggleNode('MY')}>
              <td className="py-3 px-4 flex items-center font-medium"><ExpandIcon expanded={!!expandedNodes['MY']} />🇲🇾 <span className="ml-1">{t('Malaysia')}</span></td>
              <td className="py-3 px-4">0.42K</td>
              <td className="py-3 px-4 font-medium text-[#ff7d00]">★★★★☆ <span className="text-[#1d2129] ml-1">4.5</span></td>
              <td className="py-3 px-4">360</td>
              <td className="py-3 px-4">60</td>
              <td className="py-3 px-4 text-[#F53F3F] font-medium">85.71%</td>
              <td className="py-3 px-4 text-[#165DFF] font-medium">14.28%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION: REVIEW VOLUME & STAR RATING TREND (评论量与星级趋势图) */}
      <div className="bg-white p-5 rounded border border-[#e5e6eb] mt-0 shadow-xs flex flex-col relative overflow-hidden">
        
        {/* Faint watermark grid mirroring the screenshot */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-around opacity-[0.03] z-0">
          <div className="text-xl font-bold font-sans rotate-[-20deg] text-gray-500 uppercase tracking-widest">
            {t('VocInsight BI') || 'VocInsight BI'}
          </div>
          <div className="text-xl font-bold font-sans rotate-[-20deg] text-gray-500 uppercase tracking-widest hidden sm:block">
            {t('VocInsight BI') || 'VocInsight BI'}
          </div>
        </div>

        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e6eb]/80 pb-3 mb-5 z-10">
          <div>
            <h3 className="text-[15px] font-semibold text-[#1d2129] tracking-tight">
              {t('Review Volume & Star Rating Trend') || 'Review Volume & Star Rating Trend'}
            </h3>
            <p className="text-xs text-[#86909c] mt-0.5">
              Dual-Y axis performance model: review distribution bars alongside rating trend line.
            </p>
          </div>

          {/* Legends */}
          <div className="flex items-center gap-4 text-xs font-sans">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#22BBB3] rounded-[2px] block" />
              <span className="text-[#4e5969] text-[12px] font-medium">{t('Review Volume') || 'Review Volume'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border-2 border-[#6B60EC] bg-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B60EC]" />
              </span>
              <span className="text-[#4e5969] text-[12px] font-medium">{t('Star Rating') || 'Star Rating'}</span>
            </div>
          </div>
        </div>

        {/* SVG Chart Drawing Canvas */}
        <div className="min-w-[320px] md:min-w-[700px] h-[320px] relative">
          
          {/* Left Y Axis (Volume 0 to 5) */}
          <div className="absolute left-0 top-[30px] bottom-[70px] w-8 flex flex-col justify-between text-[12px] font-sans text-[#86909c] text-right pr-2">
            <span>5</span>
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>
          <div className="absolute left-0 top-[10px] text-[10px] text-[#86909c] font-sans scale-90 origin-left">
            Review Volume
          </div>

          {/* Right Y Axis (Rating 0 to 5.0) */}
          <div className="absolute right-0 top-[30px] bottom-[70px] w-8 flex flex-col justify-between text-[12px] font-sans text-[#86909c] text-left pl-2">
            <span>5.0</span>
            <span>4.0</span>
            <span>3.0</span>
            <span>2.0</span>
            <span>1.0</span>
            <span>0</span>
          </div>
          <div className="absolute right-0 top-[10px] text-[10px] text-[#86909c] font-sans scale-90 origin-right text-right">
            Star Rating
          </div>

          {/* Main SVG Plotting Layer */}
          <svg viewBox="0 0 800 320" className="w-[calc(100%-80px)] h-full mx-auto" preserveAspectRatio="none">
            {/* Background Grid Lines (rendered at the bottom-most layer, behind bars and lines) */}
            {Array.from({ length: 6 }).map((_, i) => {
              const y = 30 + i * 44;
              return (
                <line
                  key={`grid-${i}`}
                  x1="50"
                  y1={y}
                  x2="750"
                  y2={y}
                  stroke="#e5e6eb"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Plot width: 700 px, plot height from y=30 to y=250 (220px range), padding-bottom for label dates is at 295. */}
            {/* Bars: Review Volume */}
            {filteredData.map((item, index) => {
              const totalCount = filteredData.length;
              const cellWidth = 700 / (totalCount || 1);
              const x = index * cellWidth + cellWidth / 2 + 50;
              
              // Max Volume is 5, bar height maps directly to 220px height
              const barHeight = (item.volume / 5) * 220;
              const y = 250 - barHeight;
              const barWidth = Math.min(36, cellWidth * 0.4);

              return (
                <g key={`bar-${index}`}>
                  <rect
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill="#22BBB3"
                    rx="2"
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                  />
                  <text
                    x={x}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-[12px] font-medium fill-neutral-600 font-sans"
                  >
                    {item.volume}
                  </text>
                </g>
              );
            })}

            {/* Line: Star Rating Connection Polyline */}
            {filteredData.length > 1 && (
              <path
                d={filteredData.map((item, index) => {
                  const totalCount = filteredData.length;
                  const cellWidth = 700 / (totalCount || 1);
                  const x = index * cellWidth + cellWidth / 2 + 50;
                  
                  // Rating is mapping up to 220px height
                  const y = 250 - (item.rating / 5) * 220;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#6B60EC"
                strokeWidth="1.5"
                className="transition-all duration-300"
              />
            )}

            {/* Points: Dot circles representing Ratings */}
            {filteredData.map((item, index) => {
              const totalCount = filteredData.length;
              const cellWidth = 700 / (totalCount || 1);
              const x = index * cellWidth + cellWidth / 2 + 50;
              const y = 250 - (item.rating / 5) * 220;

              return (
                <g key={`dot-${index}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#6B60EC"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                  />
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    className="text-[12px] font-medium fill-[#6B60EC] font-sans"
                  >
                    {item.rating.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Bottom X-axis labels */}
            {filteredData.map((item, index) => {
              const totalCount = filteredData.length;
              const cellWidth = 700 / (totalCount || 1);
              const x = index * cellWidth + cellWidth/2 + 50;
              return (
                <text
                  key={`label-${index}`}
                  x={x}
                  y={290}
                  textAnchor="middle"
                  className="text-[12px] fill-neutral-500 font-sans"
                >
                  {item.date}
                </text>
              );
            })}
          </svg>

        </div>

        {/* Double Slider Timeline Control / Range Brush */}
        <div className="mt-6 border-t border-gray-100 pt-5 flex flex-col gap-4 z-10">
          
          {/* Horizontal Labels above Track */}
          <div className="relative w-full h-5 select-none text-[11px] text-[#86909c] font-mono font-medium">
            {trendData.map((d, i) => {
              const pct = getPercent(i);
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                >
                  {d.date.replace(/-/g, '')}
                </div>
              );
            })}
          </div>

          {/* Timeline Track & Brush with sparkline preview */}
          <div className="relative w-full h-11 bg-slate-50 border border-slate-200/80 rounded-md select-none touch-none" ref={trackRef}>
            {/* Sparkline Canvas Area Background */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.25] px-[1px]" preserveAspectRatio="none" viewBox="0 0 100 44">
              <path
                d={`M 0 44 ${trendData.map((d, i) => {
                  const x = (i / (trendData.length - 1)) * 100;
                  const y = 44 - (d.volume / 5) * 32; // map volume level [0..5] to y [44..12]
                  return `L ${x} ${y}`;
                }).join(' ')} L 100 44 Z`}
                fill="#cbd5e1"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
            </svg>

            {/* Selected Highlight Zone */}
            <div
              className="absolute top-0 bottom-0 bg-[#6B60EC]/10 border-l border-r border-[#6B60EC]/40 transition-all duration-75"
              style={{
                left: `${getPercent(range[0])}%`,
                width: `${getPercent(range[1]) - getPercent(range[0])}%`
              }}
            />

            {/* Left Button Grab Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 cursor-ew-resize z-20 flex items-center justify-center w-7 h-7"
              style={{
                left: `calc(${getPercent(range[0])}% - 14px)`
              }}
              onMouseDown={() => setActiveDrag('left')}
              onTouchStart={() => setActiveDrag('left')}
            >
              <div 
                className={`w-7 h-7 rounded-full bg-white border-2 border-[#6B60EC] shadow-md flex items-center justify-center transition-all ${
                  activeDrag === 'left' ? 'scale-110 shadow-lg border-2' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-[10px] text-[#6B60EC] font-bold leading-none select-none tracking-tight">||</span>
              </div>
              <div className={`absolute top-1/2 -translate-y-1/2 ${
                getPercent(range[0]) < 10 ? 'left-[36px]' : 'right-[36px]'
              }`}>
                <span className="text-[10px] font-mono font-bold text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm pointer-events-none select-none whitespace-nowrap">
                  {trendData[range[0]].date.replace(/-/g, '')}
                </span>
              </div>
            </div>

            {/* Right Button Grab Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 cursor-ew-resize z-20 flex items-center justify-center w-7 h-7"
              style={{
                left: `calc(${getPercent(range[1])}% - 14px)`
              }}
              onMouseDown={() => setActiveDrag('right')}
              onTouchStart={() => setActiveDrag('right')}
            >
              <div 
                className={`w-7 h-7 rounded-full bg-white border-2 border-[#6B60EC] shadow-md flex items-center justify-center transition-all ${
                  activeDrag === 'right' ? 'scale-110 shadow-lg border-2' : 'hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-[10px] text-[#6B60EC] font-bold leading-none select-none tracking-tight">||</span>
              </div>
              <div className={`absolute top-1/2 -translate-y-1/2 ${
                getPercent(range[1]) > 90 ? 'right-[36px]' : 'left-[36px]'
              }`}>
                <span className="text-[10px] font-mono font-bold text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm pointer-events-none select-none whitespace-nowrap">
                  {trendData[range[1]].date.replace(/-/g, '')}
                </span>
              </div>
            </div>
          </div>

          {/* Reset / Range Info bar at bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-1 gap-2 text-[12px] text-[#86909c] font-sans">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>{t('Selected range:') || 'Selected range:'}</span>
              <span className="font-mono font-bold bg-indigo-50 text-[#6B60EC] px-2 py-0.5 rounded border border-indigo-100/60">
                {trendData[range[0]].date}
              </span>
              <span className="text-gray-400">至</span>
              <span className="font-mono font-bold bg-indigo-50 text-[#6B60EC] px-2 py-0.5 rounded border border-indigo-100/60">
                {trendData[range[1]].date}
              </span>
            </div>
            <button
              onClick={() => setRange([0, trendData.length - 1])}
              className="px-2.5 py-1 border border-neutral-200 text-xs rounded-md bg-white hover:bg-neutral-50 hover:text-neutral-900 text-neutral-600 font-medium cursor-pointer transition-colors"
            >
              Reset
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
