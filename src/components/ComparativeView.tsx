import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Search, 
  Tv, 
  MessageSquare,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import TableCategoryTabs from './TableCategoryTabs';

interface ComparativeProduct {
  id: string;
  brand: string;
  series: string;
  model: string;
  priceRange: string;
  sampleCount: number;
}

const BRAND_OPTIONS = ['Hisense', 'TCL', 'Sony', 'Samsung'];

const SERIES_BY_BRAND: Record<string, string[]> = {
  Hisense: ['U7-Series', 'U8-Series'],
  TCL: ['QM8-Series', 'QM7-Series'],
  Sony: ['Bravia XR', 'X90L-Series'],
  Samsung: ['Neo QLED', 'QLED-Series'],
};

const MODELS_BY_SERIES: Record<string, string[]> = {
  'U7-Series': ['100U7K-US', '75U7K'],
  'U8-Series': ['85U8K'],
  'QM8-Series': ['85QM851G'],
  'QM7-Series': ['65QM751G'],
  'Bravia XR': ['XR85X90L'],
  'X90L-Series': ['XR75X90K'],
  'Neo QLED': ['QN85QN90CAF'],
  'QLED-Series': ['QN75Q60CAF'],
};

// Data sets mapped per brand for highly dynamic content switching
const PAINT_SCENARIOS_BY_BRAND: Record<string, { issue: string; val: string }[]> = {
  Hisense: [
    { issue: 'Wireless Connection Experience Issues', val: '29.6%(42)' },
    { issue: 'Screen Distortion Issues', val: '21.8%(31)' },
    { issue: 'Maintenance Standard Compliance Issues', val: '16.2%(23)' },
    { issue: 'Selling Price Fluctuation Issues', val: '8.5%(12)' },
    { issue: 'Accessory Issues', val: '4.2%(6)' },
    { issue: 'Promotion Compliance Issues', val: '3.5%(5)' },
    { issue: 'Black Screen Issues', val: '2.8%(4)' },
    { issue: 'National Subsidy Policy Issues', val: '2.8%(4)' },
    { issue: 'Remote Control Sensitivity Issues', val: '2.1%(3)' },
    { issue: 'Power On/Off Issues', val: '1.4%(2)' },
  ],
  TCL: [
    { issue: 'Wireless Connection Experience Issues', val: '25.4%(36)' },
    { issue: 'Screen Distortion Issues', val: '23.1%(33)' },
    { issue: 'Maintenance Standard Compliance Issues', val: '14.8%(21)' },
    { issue: 'Selling Price Fluctuation Issues', val: '10.2%(15)' },
    { issue: 'Accessory Issues', val: '5.1%(7)' },
    { issue: 'Promotion Compliance Issues', val: '4.0%(6)' },
    { issue: 'Black Screen Issues', val: '3.2%(5)' },
    { issue: 'National Subsidy Policy Issues', val: '2.0%(3)' },
    { issue: 'Remote Control Sensitivity Issues', val: '1.8%(2)' },
    { issue: 'Power On/Off Issues', val: '1.1%(1)' },
  ],
  Sony: [
    { issue: 'Wireless Connection Experience Issues', val: '18.2%(16)' },
    { issue: 'Screen Distortion Issues', val: '28.5%(25)' },
    { issue: 'Maintenance Standard Compliance Issues', val: '12.1%(11)' },
    { issue: 'Selling Price Fluctuation Issues', val: '15.4%(14)' },
    { issue: 'Accessory Issues', val: '3.0%(3)' },
    { issue: 'Promotion Compliance Issues', val: '2.1%(2)' },
    { issue: 'Black Screen Issues', val: '4.2%(4)' },
    { issue: 'National Subsidy Policy Issues', val: '1.1%(1)' },
    { issue: 'Remote Control Sensitivity Issues', val: '2.5%(2)' },
    { issue: 'Power On/Off Issues', val: '1.5%(1)' },
  ],
  Samsung: [
    { issue: 'Wireless Connection Experience Issues', val: '21.3%(28)' },
    { issue: 'Screen Distortion Issues', val: '25.0%(33)' },
    { issue: 'Maintenance Standard Compliance Issues', val: '15.0%(20)' },
    { issue: 'Selling Price Fluctuation Issues', val: '12.8%(17)' },
    { issue: 'Accessory Issues', val: '4.8%(6)' },
    { issue: 'Promotion Compliance Issues', val: '3.1%(4)' },
    { issue: 'Black Screen Issues', val: '3.5%(5)' },
    { issue: 'National Subsidy Policy Issues', val: '1.5%(2)' },
    { issue: 'Remote Control Sensitivity Issues', val: '2.0%(3)' },
    { issue: 'Power On/Off Issues', val: '1.2%(1)' },
  ],
};

const LATENT_NEEDS_BY_BRAND: Record<string, { need: string; val: string }[]> = {
  Hisense: [
    { need: 'Ultra-thin frame request', val: '15.4%(22)' },
    { need: 'Brighter HDR Peak brightness', val: '12.1%(17)' },
    { need: 'Deeper Bass audio punch', val: '11.2%(16)' },
    { need: 'Smart speaker response speed', val: '10.5%(15)' },
    { need: 'More HDMI 2.1 144Hz ports', val: '9.8%(14)' },
    { need: 'Anti-glare screen filter', val: '8.9%(13)' },
    { need: 'Bilingual local dialect commands', val: '8.2%(12)' },
    { need: 'Easier wall flush mount', val: '7.6%(11)' },
    { need: 'Skip boot advertisement option', val: '7.1%(10)' },
    { need: 'Automatic ambient lighting focus', val: '6.8%(9)' },
  ],
  TCL: [
    { need: 'Ultra-thin frame request', val: '14.2%(20)' },
    { need: 'Brighter HDR Peak brightness', val: '13.5%(19)' },
    { need: 'Deeper Bass audio punch', val: '10.8%(15)' },
    { need: 'Smart speaker response speed', val: '11.1%(16)' },
    { need: 'More HDMI 2.1 144Hz ports', val: '8.5%(12)' },
    { need: 'Anti-glare screen filter', val: '9.2%(13)' },
    { need: 'Bilingual local dialect commands', val: '7.9%(11)' },
    { need: 'Easier wall flush mount', val: '8.0%(11)' },
    { need: 'Skip boot advertisement option', val: '6.5%(9)' },
    { need: 'Automatic ambient lighting focus', val: '7.0%(10)' },
  ],
  Sony: [
    { need: 'Ultra-thin frame request', val: '18.5%(16)' },
    { need: 'Brighter HDR Peak brightness', val: '11.0%(10)' },
    { need: 'Deeper Bass audio punch', val: '15.2%(13)' },
    { need: 'Smart speaker response speed', val: '9.5%(8)' },
    { need: 'More HDMI 2.1 144Hz ports', val: '11.0%(10)' },
    { need: 'Anti-glare screen filter', val: '8.0%(7)' },
    { need: 'Bilingual local dialect commands', val: '6.8%(6)' },
    { need: 'Easier wall flush mount', val: '8.5%(8)' },
    { need: 'Skip boot advertisement option', val: '5.0%(4)' },
    { need: 'Automatic ambient lighting focus', val: '7.5%(7)' },
  ],
  Samsung: [
    { need: 'Ultra-thin frame request', val: '16.0%(21)' },
    { need: 'Brighter HDR Peak brightness', val: '13.0%(17)' },
    { need: 'Deeper Bass audio punch', val: '12.5%(16)' },
    { need: 'Smart speaker response speed', val: '10.0%(13)' },
    { need: 'More HDMI 2.1 144Hz ports', val: '10.5%(14)' },
    { need: 'Anti-glare screen filter', val: '8.5%(11)' },
    { need: 'Bilingual local dialect commands', val: '7.5%(10)' },
    { need: 'Easier wall flush mount', val: '7.0%(9)' },
    { need: 'Skip boot advertisement option', val: '6.8%(9)' },
    { need: 'Automatic ambient lighting focus', val: '6.2%(8)' },
  ],
};

const EXPERIENCE_BY_BRAND: Record<string, {
  advantages: string[];
  advComment: string;
  disadvantages: string[];
  disadvComment: string;
}> = {
  Hisense: {
    advantages: [
      'Service Attitude   5',
      'Trade-in Service Experience   5',
      'Image Clarity   5',
      'Screen Anti-glare Perform   5',
      'Hisense Brand Recognition   5',
    ],
    advComment: 'The TV quality is excellent. The trade-in product collection was completed quickly, and the service technician delivered great service.',
    disadvantages: [
      'Accessory Missing   5',
      'Slow Interface Response   4',
      'Screen Backlight Uniformity   4',
      'Complimentary Remote Missing   5',
      'Complicated Warranty Process   3',
    ],
    disadvComment: 'Hello, Hisense delivered and installed the TV at my home today, but the complimentary remote control was not provided; I just found a dark patch on the top-left corner of the screen right after receiving the product, so I want to apply for the 7-day free return & exchange service.',
  },
  TCL: {
    advantages: [
      'Peak HDR Highlights   5',
      'Mini-LED Panel Dimming   5',
      'Contrast Precision   5',
      'Snappy Google TV Experience   4',
      'Solid Bass Soundbar Built-in   5',
    ],
    advComment: 'Excellent high peak brightness! The local dimming zones perform exceptionally well on HDR streams with deep blacks and great dynamic range. Very responsive menu navigation.',
    disadvantages: [
      'HDMI Sound Sync Latency   4',
      'Occasional Wi-Fi Dropout   5',
      'Oversized Box Packaging   3',
      'Fragile Panel Housing   4',
      'Remote Backlight Missing   5',
    ],
    disadvComment: 'Image quality is robust, but the eARC sound synchronization has a noticeable lag. Also, the cargo shipping box is humongous, making physical returns extremely cumbersome.',
  },
  Sony: {
    advantages: [
      'Bravia XR AI Cognitive Chip   5',
      'Superb Calibration   5',
      'Acoustic Surface Acoustic   5',
      'Apple AirPlay Seamless Air   5',
      'Elegant Frame Fit   5',
    ],
    advComment: 'Absolute masterpiece of colors straight out of the box! No color calibrating required. Acoustic Surface audio is magical, matching sound positions exactly with actors.',
    disadvantages: [
      'Premium Pricing Tier   5',
      'Only 2 Full HDMI 2.1 Gates   4',
      'Extremely Heavy Bottom   4',
      'No Standard Paper Handbook   3',
      'Voice Assistant Idle Wake   3',
    ],
    disadvComment: 'Pricing is excessively high compared to competitors with highly matching specifications. Why only two high-speed 4K ports on a flagship set in 2026? A disappointing limit.',
  },
  Samsung: {
    advantages: [
      'SmartThings Hub Core   5',
      'Sleek Bezel Depth Frame   5',
      'Anti-Reflective sheet   5',
      'Fluid Gaming Hub dashboard   5',
      'Eco Solar Power Remote   5',
    ],
    advComment: 'Ultra thin chassis fits the wall neatly like art. The anti-gloss sheet blocks modern window glare perfectly, and the built-in ambient gaming overlays are quick and snappy.',
    disadvantages: [
      'Refusal of Dolby Vision   5',
      'Tizen Store Selection   4',
      'Crushed Shadow Dimming   4',
      'Annoying Auto-Play Ad   5',
      'No Physical AUX Port   3',
    ],
    disadvComment: 'Lacking Dolby vision format licensing on premium television sets is purely greedy. Dynamic zone dimming of Tizen tries too hard and ends up totally crushing shadow details.',
  },
};

const USAGE_SCENARIOS_BY_BRAND: Record<string, { scenario: string; val: string }[]> = {
  Hisense: [
    { scenario: 'External Devices', val: '29.6%(42)' },
    { scenario: 'Movies', val: '21.8%(31)' },
    { scenario: 'Gaming', val: '16.2%(23)' },
    { scenario: 'Sports', val: '8.5%(12)' },
    { scenario: 'Cartoons', val: '4.2%(6)' },
    { scenario: 'Fitness', val: '3.5%(5)' },
    { scenario: 'Mobile', val: '2.8%(4)' },
    { scenario: 'Casting', val: '2.8%(4)' },
    { scenario: 'Office & Meeting', val: '2.1%(3)' },
    { scenario: 'Online Classes', val: '1.4%(2)' },
  ],
  TCL: [
    { scenario: 'External Devices', val: '28.0%(40)' },
    { scenario: 'Movies', val: '22.5%(32)' },
    { scenario: 'Gaming', val: '18.0%(25)' },
    { scenario: 'Sports', val: '9.0%(13)' },
    { scenario: 'Cartoons', val: '4.0%(6)' },
    { scenario: 'Fitness', val: '3.0%(4)' },
    { scenario: 'Mobile', val: '3.0%(4)' },
    { scenario: 'Casting', val: '2.5%(3)' },
    { scenario: 'Office & Meeting', val: '2.0%(3)' },
    { scenario: 'Online Classes', val: '1.0%(1)' },
  ],
  Sony: [
    { scenario: 'External Devices', val: '24.0%(21)' },
    { scenario: 'Movies', val: '28.0%(25)' },
    { scenario: 'Gaming', val: '20.0%(18)' },
    { scenario: 'Sports', val: '10.0%(9)' },
    { scenario: 'Cartoons', val: '3.5%(3)' },
    { scenario: 'Fitness', val: '2.5%(2)' },
    { scenario: 'Mobile', val: '2.0%(2)' },
    { scenario: 'Casting', val: '3.0%(3)' },
    { scenario: 'Office & Meeting', val: '4.0%(4)' },
    { scenario: 'Online Classes', val: '1.5%(1)' },
  ],
  Samsung: [
    { scenario: 'External Devices', val: '26.5%(35)' },
    { scenario: 'Movies', val: '24.0%(31)' },
    { scenario: 'Gaming', val: '18.5%(24)' },
    { scenario: 'Sports', val: '9.5%(12)' },
    { scenario: 'Cartoons', val: '4.5%(6)' },
    { scenario: 'Fitness', val: '3.2%(4)' },
    { scenario: 'Mobile', val: '2.5%(3)' },
    { scenario: 'Casting', val: '2.8%(4)' },
    { scenario: 'Office & Meeting', val: '3.0%(4)' },
    { scenario: 'Online Classes', val: '1.2%(1)' },
  ],
};

const CATEGORIES_LIST = [
  'All Categories',
  'Brand Awareness',
  'Purchase Interaction',
  'Logistics & Delivery',
  'Returns & Exchanges',
  'Installation & Commissioning',
  'Product Application',
  'Maintenance',
  'Repurchase & Replacement'
];

export default function ComparativeView() {
  const [activeTabSection, setActiveTabSection] = useState<string>('benchmark');
  const [activeCategory, setActiveCategory] = useState<string>('All Categories');
  const [activeLevel, setActiveLevel] = useState<string>('LV3');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [compProducts, setCompProducts] = useState<ComparativeProduct[]>([
    {
      id: 'p-1',
      brand: 'Hisense',
      series: 'U7-Series',
      model: '100U7K-US',
      priceRange: '3000-3999',
      sampleCount: 482
    },
    {
      id: 'p-2',
      brand: 'TCL',
      series: 'QM8-Series',
      model: '85QM851G',
      priceRange: '3000-3999',
      sampleCount: 351
    }
  ]);

  useEffect(() => {
    const sectionIds = [
      { id: 'benchmark_sec', name: 'benchmark' },
      { id: 'pain_sec', name: 'pain' },
      { id: 'latent_sec', name: 'latent' },
      { id: 'experience_sec', name: 'experience' },
      { id: 'usage_sec', name: 'usage' }
    ];
    
    // We observe the scroll container from App.tsx or use a wider margin
    // Since App.tsx has its own overflow, we can just use the document root by not specifying root
    // But since the elements are inside App's flex-grow container, they might scroll within that.
    // If the entire page scrolls, window is fine. In this app, the container with bg-white flex-grow scrolls.
    // We can query that element or just use a generic observer.
    const scrollContainer = document.querySelector('.flex-grow.flex-col.overflow-y-auto') as HTMLDivElement;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = sectionIds.find(s => s.id === entry.target.id);
          if (match) setActiveTabSection(match.name);
        }
      });
    }, {
      root: scrollContainer,
      rootMargin: '-20% 0px -70% 0px', // When the top hits the top 20%
      threshold: 0
    });

    sectionIds.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleAddProduct = () => {
    if (compProducts.length >= 4) return;
    
    // Choose a default brand that isn't already taking multiple slots
    const availableBrands = ['Sony', 'Samsung', 'Hisense', 'TCL'];
    const currentBrands = compProducts.map((p) => p.brand);
    const newBrand = availableBrands.find((b) => !currentBrands.includes(b)) || 'Sony';

    const defaultSeriesArr = SERIES_BY_BRAND[newBrand] || ['Bravia XR'];
    const defaultSeries = defaultSeriesArr[0];
    const defaultModels = MODELS_BY_SERIES[defaultSeries] || ['XR85X90L'];
    const defaultModel = defaultModels[0];

    let defaultPrice = '4000-4999';
    let defaultSamples = 220;

    if (newBrand === 'Sony') {
      defaultPrice = '5000-7999';
      defaultSamples = 189;
    } else if (newBrand === 'Samsung') {
      defaultPrice = '4000-6999';
      defaultSamples = 290;
    } else if (newBrand === 'Hisense') {
      defaultPrice = '3000-3999';
      defaultSamples = 482;
    } else if (newBrand === 'TCL') {
      defaultPrice = '2500-3499';
      defaultSamples = 351;
    }

    const newProduct: ComparativeProduct = {
      id: `p-${Date.now()}`,
      brand: newBrand,
      series: defaultSeries,
      model: defaultModel,
      priceRange: defaultPrice,
      sampleCount: defaultSamples
    };

    setCompProducts([...compProducts, newProduct]);
  };

  const handleRemoveProduct = (id: string) => {
    if (compProducts.length <= 2) return;
    setCompProducts(compProducts.filter((p) => p.id !== id));
  };

  const handleUpdateProductSelect = (id: string, field: 'brand' | 'series' | 'model', value: string) => {
    setCompProducts(compProducts.map((p) => {
      if (p.id !== id) return p;

      const updated = { ...p };

      if (field === 'brand') {
        updated.brand = value;
        // cascade sets default series and model under this brand
        const seriesArr = SERIES_BY_BRAND[value] || [];
        updated.series = seriesArr[0] || '';
        const modelsArr = MODELS_BY_SERIES[updated.series] || [];
        updated.model = modelsArr[0] || '';

        // Dynamic price and sample metrics
        if (value === 'Sony') {
          updated.priceRange = '5000-7999';
          updated.sampleCount = 189;
        } else if (value === 'Samsung') {
          updated.priceRange = '4000-6999';
          updated.sampleCount = 290;
        } else if (value === 'Hisense') {
          updated.priceRange = '3000-3999';
          updated.sampleCount = 482;
        } else if (value === 'TCL') {
          updated.priceRange = '2500-3499';
          updated.sampleCount = 351;
        }
      } else if (field === 'series') {
        updated.series = value;
        const modelsArr = MODELS_BY_SERIES[value] || [];
        updated.model = modelsArr[0] || '';
      } else if (field === 'model') {
        updated.model = value;
      }

      return updated;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* SECONDARY ANCHOR NAVBAR (锚点分类导航) */}
      <div className="bg-white sticky top-[36px] z-30 shadow-xs border-b border-[#e5e6eb] h-[38px] flex items-end">
        <div className="flex gap-[32px] items-center h-full">
          {[
            { id: 'benchmark_sec', name: 'benchmark', label: 'Competitor Benchmark' },
            { id: 'pain_sec', name: 'pain', label: 'Pain Scenarios' },
            { id: 'latent_sec', name: 'latent', label: 'Latent Needs' },
            { id: 'experience_sec', name: 'experience', label: 'Product Experience' },
            { id: 'usage_sec', name: 'usage', label: 'Usage Scenarios' }
          ].map((sec) => (
            <div 
              key={sec.id}
              onClick={() => {
                setActiveTabSection(sec.name);
                const el = document.getElementById(sec.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-white relative shrink-0 cursor-pointer h-full flex flex-col justify-center"
            >
              <div className={`content-stretch flex items-center relative shrink-0 transition-colors pb-[5px] pt-[5px] ${
                activeTabSection === sec.name ? 'text-[#00aaa6]' : 'text-[#4e5969] hover:text-gray-900'
              }`}>
                <div className={`[word-break:break-word] flex flex-col justify-center leading-[0] relative shrink-0 text-[14px] whitespace-nowrap ${
                  activeTabSection === sec.name ? 'font-medium' : 'font-normal'
                }`}>
                  <p className="leading-[22px]">{sec.label}</p>
                </div>
              </div>
              {activeTabSection === sec.name && (
                <div className="bg-[#00aaa6] h-[2px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1: COMPETITOR BENCHMARK */}
      <div id="benchmark_sec" className="scroll-mt-[100px] space-y-4 mb-[40px]">
        <h2 className="text-base font-bold text-[#1d2129] font-sans">Competitor Benchmark</h2>

        <div className="relative border border-[#e5e6eb] rounded-md overflow-hidden bg-white">
          <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#e5e6eb]">
            
            {/* Loop through actual compared products */}
            {compProducts.map((p, idx) => {
              const seriesList = SERIES_BY_BRAND[p.brand] || [];
              const modelList = MODELS_BY_SERIES[p.series] || [];
              const showCloseBtn = compProducts.length >= 3;

              return (
                <div 
                  key={p.id}
                  className="flex-1 min-w-[220px] relative flex flex-col justify-between group py-6 px-9"
                >
                  
                  {/* CLOSE BUTTON - Display on hover only if we have at least 3 products */}
                  {showCloseBtn && (
                    <button
                      onClick={() => handleRemoveProduct(p.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-50 hover:bg-[#ffece8] text-[#86909c] hover:text-[#f53f3f] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 border border-[#e5e6eb]"
                      title="Remove product from comparison"
                    >
                      <X size={12} />
                    </button>
                  )}

                  {/* Top Display Cards */}
                  <div className="flex flex-col items-center gap-3">
                    
                    {/* TV Visual Emblem Frame */}
                    <div className="h-[48px] w-[56px] bg-[#edf1ff] rounded-[8px] flex items-center justify-center p-2 shadow-inner border border-blue-50/50">
                      <Tv className="text-[#3c54c4] w-6 h-6 animate-pulse-slow" />
                    </div>

                    {/* SELECT CONTROLS */}
                    <div className="w-full space-y-2 mt-2">
                      
                      {/* Brand Select */}
                      <div className="relative rounded-[4px] border border-[#e5e6eb] bg-white text-xs text-[#1d2129]">
                        <select
                          value={p.brand}
                          onChange={(e) => handleUpdateProductSelect(p.id, 'brand', e.target.value)}
                          className="w-full px-3 py-1.5 focus:outline-none bg-transparent cursor-pointer font-medium"
                        >
                          {BRAND_OPTIONS.map((br) => (
                            <option key={br} value={br}>{br}</option>
                          ))}
                        </select>
                      </div>

                      {/* Series Select */}
                      <div className="relative rounded-[4px] border border-[#e5e6eb] bg-white text-xs text-[#1d2129]">
                        <select
                          value={p.series}
                          onChange={(e) => handleUpdateProductSelect(p.id, 'series', e.target.value)}
                          className="w-full px-3 py-1.5 focus:outline-none bg-transparent cursor-pointer"
                        >
                          {seriesList.map((ser) => (
                            <option key={ser} value={ser}>{ser}</option>
                          ))}
                        </select>
                      </div>

                      {/* Model Select */}
                      <div className="relative rounded-[4px] border border-[#e5e6eb] bg-white text-xs text-[#1d2129]">
                        <select
                          value={p.model}
                          onChange={(e) => handleUpdateProductSelect(p.id, 'model', e.target.value)}
                          className="w-full px-3 py-1.5 focus:outline-none bg-transparent cursor-pointer"
                        >
                          {modelList.map((mod) => (
                            <option key={mod} value={mod}>{mod}</option>
                          ))}
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="border-t border-[#e5e6eb] my-4" />

                  {/* Metrics Row block */}
                  <div className="space-y-4 text-center mt-auto">
                    <div>
                      <span className="text-[11px] text-gray-400 block font-sans">COMPARE SEGMENT PRICE ($)</span>
                      <strong className="text-[13px] text-[#1d2129] font-mono leading-7">{p.priceRange}</strong>
                    </div>
                    <div className="border-t border-dashed border-[#e5e6eb] pt-2">
                      <span className="text-[11px] text-gray-400 block font-sans">SAMPLE CLICKS VOLUME</span>
                      <strong className="text-[13px] text-teal-600 font-mono leading-7">{p.sampleCount}</strong>
                    </div>
                  </div>

                  {/* Absolute positioning of VS circles between columns if not the last */}
                  {idx < compProducts.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-[#f7f8fa] border border-[#e5e6eb] flex items-center justify-center font-semibold text-[11px] text-[#00aaa6] shadow-sm z-20">
                      VS
                    </div>
                  )}

                </div>
              );
            })}

            {/* If we have less than 4 compared products, show the add slot */}
            {compProducts.length < 4 && (
              <div className="flex-1 min-w-[220px] flex items-center justify-center py-12 px-6 bg-slate-50/50">
                <button
                  onClick={handleAddProduct}
                  className="flex flex-col items-center gap-3 group focus:outline-none cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:text-[#00aaa6] group-hover:border-[#00aaa6] bg-white shadow-xs group-hover:scale-105 transition-all duration-200">
                    <Plus size={20} />
                  </div>
                  <span className="text-xs text-gray-400 font-medium group-hover:text-[#00aaa6] transition-colors">
                    Add Comparative Product
                  </span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* FILTER SEARCH BAR FOR COMPARISON TABLES */}
      <div className="relative w-full mb-[16px]">
        {/* Top: Categories via TableCategoryTabs */}
        <TableCategoryTabs 
          categories={CATEGORIES_LIST}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        
        {/* Bottom: Search Box + LV3/4 Toggle */}
        <div className="content-stretch flex flex-col md:flex-row items-center justify-between w-full mt-3 gap-3">
          {/* Search Box */}
          <div className="bg-white h-[32px] relative rounded-[4px] shrink-0 w-full md:w-[300px] border border-[#e5e6eb]">
            <div className="flex flex-row items-center justify-center size-full">
              <div className="content-stretch flex items-center justify-between pl-[12px] pr-[8px] relative size-full">
                <div className="flex flex-[1_0_0] gap-[8px] items-center min-w-px relative">
                  <Search size={14} className="text-[#86909c]" />
                  <input
                    type="text"
                    placeholder="Search what you want to know"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex flex-[1_0_0] text-[13px] text-[#1d2129] font-normal leading-[22px] bg-transparent outline-none min-w-px"
                  />
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="bg-[#f7f8fa] flex items-center justify-center rounded-[12px] size-[20px] ml-2 text-[#86909c] hover:text-gray-900 transition-colors">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Local Level Toggle */}
          <div className="content-stretch flex items-center relative shrink-0">
            <div className="bg-[#f7f8fa] relative rounded-[4px] shrink-0">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <div className="content-stretch flex gap-[3px] items-center p-[3px] relative size-full">
                  <button
                    onClick={() => setActiveLevel('LV3')}
                    className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                      activeLevel === 'LV3'
                        ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                        : 'text-[#4e5969] font-normal hover:text-gray-900'
                    }`}
                  >
                    LV3
                  </button>
                  <button
                    onClick={() => setActiveLevel('LV4')}
                    className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                      activeLevel === 'LV4'
                        ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                        : 'text-[#4e5969] font-normal hover:text-gray-900'
                    }`}
                  >
                    LV4
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PAIN SCENARIOS */}
      <div id="pain_sec" className="scroll-mt-[100px] space-y-4 mb-[40px]">
        <h2 className="text-base font-bold text-[#1d2129] font-sans">Pain Scenarios</h2>
        
        <div className="border border-[#e5e6eb] rounded-md overflow-hidden bg-white">
          <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#e5e6eb]">
            
            {/* Generate columns for each configured product */}
            {compProducts.map((p) => {
              const baseScenarios = PAINT_SCENARIOS_BY_BRAND[p.brand] || PAINT_SCENARIOS_BY_BRAND.Hisense;
              
              // Filter based on query and active category (simulate category filtering logically)
              const filteredScenarios = baseScenarios.filter((item) => {
                const matchesSearch = item.issue.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                
                // Mock categories mapping
                if (activeCategory === 'All Categories') return true;
                if (activeCategory === 'Brand Awareness' && item.issue.includes('Price')) return true;
                if (activeCategory === 'Returns & Exchanges' && item.issue.includes('Compliance')) return true;
                if (activeCategory === 'Product Application' && item.issue.includes('Sensitivity')) return true;
                return item.issue.length % 2 === 0; // fallback arbitrary filter for visual variety
              });

              return (
                <div key={p.id} className="flex-1 min-w-[200px] flex flex-col divide-y divide-[#e5e6eb]">
                  {/* Column Header */}
                  <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 tracking-wider text-center border-b border-[#e5e6eb]">
                    {p.brand} ({p.model})
                  </div>

                  {filteredScenarios.length > 0 ? (
                    filteredScenarios.map((item, rowIdx) => (
                      <div 
                        key={rowIdx}
                        className="px-4 py-3 text-xs text-[#10141a] flex justify-between items-start gap-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <span className="font-sans leading-[1.6] text-gray-700 min-w-0 break-words flex-1">
                          {item.issue}
                        </span>
                        <span className="font-mono text-gray-500 shrink-0 font-medium text-right text-[11px] bg-slate-50 h-[18px] flex items-center px-1.5 rounded border border-gray-200/40">
                          {item.val}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-xs text-gray-400 font-sans italic">
                      No matching pain entries found
                    </div>
                  )}
                </div>
              );
            })}

            {/* Fill placeholder blank columns */}
            {compProducts.length < 4 && (
              <div className="flex-1 min-w-[200px] flex flex-col bg-gray-50/10 divide-y divide-[#e5e6eb]">
                <div className="px-4 py-2 bg-slate-50/10 text-xs font-semibold text-gray-400 text-center border-b border-[#e5e6eb]">
                  —
                </div>
                {Array.from({ length: 10 }).map((_, r) => (
                  <div key={r} className="px-4 py-3 text-xs text-gray-400 text-center flex items-center justify-center font-sans italic flex-1">
                    —
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
      
      <div id="latent_sec" className="scroll-mt-[100px] space-y-4 mb-[40px]">
        <h2 className="text-base font-bold text-[#1d2129] font-sans">Latent Needs</h2>
        
        <div className="border border-[#e5e6eb] rounded-md overflow-hidden bg-white">
          <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#e5e6eb]">
            
            {compProducts.map((p) => {
              const baseNeeds = LATENT_NEEDS_BY_BRAND[p.brand] || LATENT_NEEDS_BY_BRAND.Hisense;
              const filteredNeeds = baseNeeds.filter((item) => {
                const matchesSearch = item.need.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                
                if (activeCategory === 'All Categories') return true;
                if (activeCategory === 'Brand Awareness' && item.need.includes('HDR')) return true;
                if (activeCategory === 'Product Application' && item.need.includes('Smart')) return true;
                return item.need.length % 2 === 0;
              });

              return (
                <div key={p.id} className="flex-1 min-w-[200px] flex flex-col divide-y divide-[#e5e6eb]">
                  <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 tracking-wider text-center border-b border-[#e5e6eb]">
                    {p.brand} ({p.model})
                  </div>

                  {filteredNeeds.length > 0 ? (
                    filteredNeeds.map((item, rowIdx) => (
                      <div 
                        key={rowIdx}
                        className="px-4 py-3 text-xs text-[#10141a] flex justify-between items-start gap-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <span className="font-sans leading-[1.6] text-gray-700 min-w-0 break-words flex-1">
                          {item.need}
                        </span>
                        <span className="font-mono text-gray-500 shrink-0 font-medium text-right text-[11px] bg-slate-50 h-[18px] flex items-center px-1.5 rounded border border-gray-200/40">
                          {item.val}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-xs text-gray-400 font-sans italic">
                      No matching needs found
                    </div>
                  )}
                </div>
              );
            })}

            {/* Match list placeholder blanks */}
            {compProducts.length < 4 && (
              <div className="flex-1 min-w-[200px] flex flex-col bg-gray-50/10 divide-y divide-[#e5e6eb]">
                <div className="px-4 py-2 bg-slate-50/10 text-xs font-semibold text-gray-400 text-center border-b border-[#e5e6eb]">
                  —
                </div>
                {Array.from({ length: 10 }).map((_, r) => (
                  <div key={r} className="px-4 py-3 text-xs text-gray-400 text-center flex items-center justify-center font-sans italic flex-1">
                    —
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      <div id="experience_sec" className="scroll-mt-[100px] space-y-4 mb-[40px]">
        <h2 className="text-base font-bold text-[#1d2129] font-sans">Product Experience</h2>
        
        <div className="border border-[#e5e6eb] rounded-md overflow-hidden bg-white">
          <div className="flex flex-col divide-y divide-[#e5e6eb]">
            
            {/* Row 1: Header Row */}
            <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#e5e6eb]">
              {compProducts.map((p) => (
                <div key={p.id} className="flex-1 min-w-[240px] px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 tracking-wider text-center">
                  {p.brand} ({p.model})
                </div>
              ))}
              {compProducts.length < 4 && (
                <div className="flex-1 min-w-[240px] px-4 py-2 bg-slate-50/50 text-xs font-semibold text-gray-400 text-center">
                  —
                </div>
              )}
            </div>

            {/* Row 2: Product Advantages Row */}
            <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#e5e6eb]">
              {compProducts.map((p) => {
                const expObj = EXPERIENCE_BY_BRAND[p.brand] || EXPERIENCE_BY_BRAND.Hisense;
                return (
                  <div key={p.id} className="flex-1 min-w-[240px] p-4 flex flex-col justify-between space-y-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mb-[16px]">
                        <ThumbsUp size={13} />
                        <h3 className="text-[#1d2129]">Product Advantages</h3>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {expObj.advantages.map((adv, aidx) => (
                          <span 
                            key={aidx} 
                            className="bg-[#ffece8] text-[#f53f3f] px-2 py-0.5 rounded text-[11px] font-sans font-medium"
                          >
                            {adv}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Top Review Highlight */}
                    <div className="bg-gray-50 rounded p-2.5 space-y-1.5 border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <div className="size-[16px] rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold text-[9px]">
                          {p.brand[0]}
                        </div>
                        <span className="text-[11px] font-medium text-[#1d1f24] font-mono">@*********a</span>
                      </div>
                      <p className="text-[12px] leading-relaxed text-gray-500 font-sans italic line-clamp-3">
                        "{expObj.advComment}"
                      </p>
                    </div>
                  </div>
                );
              })}
              {compProducts.length < 4 && (
                <div className="flex-1 min-w-[240px] p-4 flex flex-col items-center justify-center text-gray-400 italic text-xs font-sans bg-gray-50/5">
                  — No Advantages
                </div>
              )}
            </div>

            {/* Row 3: Product Disadvantages Row */}
            <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#e5e6eb]">
              {compProducts.map((p) => {
                const expObj = EXPERIENCE_BY_BRAND[p.brand] || EXPERIENCE_BY_BRAND.Hisense;
                return (
                  <div key={p.id} className="flex-1 min-w-[240px] p-4 flex flex-col justify-between space-y-3 bg-slate-50/20">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#165dff] font-semibold mb-[16px]">
                        <AlertCircle size={13} />
                        <h3 className="text-[#1d2129]">Product Disadvantages</h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {expObj.disadvantages.map((dis, didx) => (
                          <span 
                            key={didx} 
                            className="bg-[#e8f3ff] text-[#165dff] px-2 py-0.5 rounded text-[11px] font-sans font-medium"
                          >
                            {dis}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Disadvantage Review Highlight with requested Gray background (bg-gray-50) */}
                    <div className="bg-gray-50 rounded p-2.5 space-y-1.5 border border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <div className="size-[16px] rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-[9px]">
                          {p.brand[0]}
                        </div>
                        <span className="text-[11px] font-medium text-[#1d1f24] font-mono">@*********a</span>
                      </div>
                      <p className="text-[12px] leading-relaxed text-gray-500 font-sans italic line-clamp-3">
                        "{expObj.disadvComment}"
                      </p>
                    </div>
                  </div>
                );
              })}
              {compProducts.length < 4 && (
                <div className="flex-1 min-w-[240px] p-4 flex flex-col items-center justify-center text-gray-400 italic text-xs font-sans bg-slate-50/10">
                  — No Disadvantages
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      
      <div id="usage_sec" className="scroll-mt-[100px] space-y-4 mb-[40px]">
        <h2 className="text-base font-bold text-[#1d2129] font-sans">Usage Scenarios</h2>
        
        <div className="border border-[#e5e6eb] rounded-md overflow-hidden bg-white">
          <div className="flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-[#e5e6eb]">
            
            {compProducts.map((p) => {
              const baseScenarios = USAGE_SCENARIOS_BY_BRAND[p.brand] || USAGE_SCENARIOS_BY_BRAND.Hisense;
              
              const filteredScenarios = baseScenarios.filter((item) => {
                const matchesSearch = item.scenario.toLowerCase().includes(searchQuery.toLowerCase());
                if (!matchesSearch) return false;
                
                if (activeCategory === 'All Categories') return true;
                if (activeCategory === 'Product Application' && item.scenario.includes('Gaming')) return true;
                return item.scenario.length % 2 === 0;
              });

              return (
                <div key={p.id} className="flex-1 min-w-[200px] flex flex-col divide-y divide-[#e5e6eb]">
                  <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-gray-500 tracking-wider text-center border-b border-[#e5e6eb]">
                    {p.brand} ({p.model})
                  </div>

                  {filteredScenarios.length > 0 ? (
                    filteredScenarios.map((item, rowIdx) => (
                      <div 
                        key={rowIdx}
                        className="px-4 py-3 text-xs text-[#10141a] flex justify-between items-start gap-4 hover:bg-slate-50/50 transition-colors"
                      >
                        <span className="font-sans leading-[1.6] text-gray-700 min-w-0 break-words flex-1">
                          {item.scenario}
                        </span>
                        <span className="font-mono text-gray-500 shrink-0 font-medium text-right text-[11px] bg-slate-50 h-[18px] flex items-center px-1.5 rounded border border-gray-200/40">
                          {item.val}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-xs text-gray-400 font-sans italic">
                      No matching usage entries found
                    </div>
                  )}
                </div>
              );
            })}

            {/* Fill placeholder columns */}
            {compProducts.length < 4 && (
              <div className="flex-1 min-w-[200px] flex flex-col bg-gray-50/10 divide-y divide-[#e5e6eb]">
                <div className="px-4 py-2 bg-slate-50/10 text-xs font-semibold text-gray-400 text-center border-b border-[#e5e6eb]">
                  —
                </div>
                {Array.from({ length: 10 }).map((_, r) => (
                  <div key={r} className="px-4 py-3 text-xs text-gray-400 text-center flex items-center justify-center font-sans italic flex-1">
                    —
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
