/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useContext, useEffect, useRef } from 'react';
import svgPaths from './svg-dur0yqn9vf';
import {
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Bell,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  MessageSquare,
  ShoppingBag,
  Globe,
  HelpCircle,
  Eye,
  LineChart,
  HardDrive,
  CheckCircle,
  Home,
  Database,
  Grid,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Menu,
  Tv,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterState, MetricCardData, IssueData, CommentDetail } from './types';
import {
  initialProductIssues,
  initialPotentialRequirements,
  lv1Concerns,
  lv2Concerns,
  lv4ConcernsList,
  usageScenarioData,
  placementLocationData,
  externalDeviceNameData,
  sampleReviews
} from './data';
import ComparativeView from './components/ComparativeView';
import SelfServiceView from './components/SelfServiceView';
import CoreKPIDashboard from './components/CoreKPIDashboard';
import TableCategoryTabs from './components/TableCategoryTabs';
import ConcernBarChart from './components/ConcernBarChart';
import { LanguageContext } from './contexts/LanguageContext';

export default function App() {
  const { language, toggleLanguage, t } = useContext(LanguageContext);
  // ----- Applet Context & Sidebar States -----
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isProductInsightExpanded, setIsProductInsightExpanded] = useState<boolean>(true);
  const [isVoiceClosedLoopExpanded, setIsVoiceClosedLoopExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'single_sku' | 'comparative' | 'self_service' | 'core_kpi'>('single_sku');
  const [activeSKUTab, setActiveSKUTab] = useState<string>('metrics');
  const [activeMenu, setActiveMenu] = useState<string>('Single SKU Analysis');
  const [openTabs, setOpenTabs] = useState<('single_sku' | 'comparative' | 'self_service' | 'core_kpi')[]>(['single_sku']);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const openTab = (tab: 'single_sku' | 'comparative' | 'self_service' | 'core_kpi') => {
    if (!openTabs.includes(tab)) {
      setOpenTabs(prev => [...prev, tab]);
    }
    setActiveTab(tab);
    if (tab === 'single_sku') setActiveMenu('Single SKU Analysis');
    else if (tab === 'comparative') setActiveMenu('Comparative Analysis');
    else if (tab === 'self_service') setActiveMenu('Self-service analytics');
    // Close mobile sidebar after navigation
    setIsMobileSidebarOpen(false);
  };

  const closeTab = (tab: 'single_sku' | 'comparative' | 'self_service' | 'core_kpi', e: React.MouseEvent) => {
    e.stopPropagation();
    if (openTabs.length <= 1) return;
    
    const updatedTabs = openTabs.filter(t => t !== tab);
    setOpenTabs(updatedTabs);
    
    if (activeTab === tab) {
      const index = openTabs.indexOf(tab);
      const newActiveTab = updatedTabs[index] || updatedTabs[updatedTabs.length - 2] || updatedTabs[0];
      setActiveTab(newActiveTab);
      if (newActiveTab === 'single_sku') setActiveMenu('Single SKU Analysis');
      else if (newActiveTab === 'comparative') setActiveMenu('Comparative Analysis');
      else if (newActiveTab === 'self_service') setActiveMenu('Self-service analytics');
    }
  };

  // ----- Global Interactive Filter Caching States -----
  const [filterState, setFilterState] = useState<FilterState>({
    timeRange: ['2025-02-04', '2025-06-24'],
    period: 'Daily',
    dataSource: 'All',
    category: 'TV',
    ecommerceSource: 'Walmart',
    brand: 'Hisense',
    productCountry: 'US',
    productSeries: 'U7K',
    productName: '100U7K-US',
    size: '100',
    isVerticalReview: 'True',
    starRating: 'All',
    showDuplicateReview: 'Yes',
    keywordQuery: ''
  });

  // Storing intermediate input before clicking "+ Search"
  const [draftFilters, setDraftFilters] = useState<FilterState>({ ...filterState });
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState<boolean>(false);

  // Search keyword input for the Issue list
  const [productIssueSearch, setProductIssueSearch] = useState<string>('');
  const [potentialReqSearch, setPotentialReqSearch] = useState<string>('');
  const [lv4Search, setLv4Search] = useState<string>('');
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>(['Negative Sentiment']);
  const [sentimentMenuOpen, setSentimentMenuOpen] = useState<boolean>(false);

  // Tables controls
  const [showMomChangeColumn, setShowMomChangeColumn] = useState<boolean>(true);
  const [productIssueTier, setProductIssueTier] = useState<'LV3' | 'LV4'>('LV3');
  const [productIssueMode, setProductIssueMode] = useState<'Ranking' | 'Surge'>('Ranking');

  const [potentialReqTier, setPotentialReqTier] = useState<'LV3' | 'LV4'>('LV3');
  const [potentialReqMode, setPotentialReqMode] = useState<'Ranking' | 'Surge'>('Ranking');

  // Interactive Chart drills
  const [selectedL1Concern, setSelectedL1Concern] = useState<string | null>(null);
  const [selectedL2Concern, setSelectedL2Concern] = useState<string | null>(null);
  const [selectedL3Concern, setSelectedL3Concern] = useState<string | null>(null);
  const [selectedScenarioFilter, setSelectedScenarioFilter] = useState<string | null>(null);
  const [selectedPlacementFilter, setSelectedPlacementFilter] = useState<string | null>(null);

  // Modal dialog popup for Viewing评论 detail
  const [selectedReviewPopup, setSelectedReviewPopup] = useState<CommentDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Hidden installation methods elements toggle for donut chart
  const [hiddenInstallationSectors, setHiddenInstallationSectors] = useState<string[]>([]);

  // Show a status tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Alert/Status notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ----- Scroll Spy Observer -----
  const listRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (activeTab !== 'single_sku') return;
    
    // Using IntersectionObserver to detect which section is currently on screen
    const sectionIds = ['metrics_sec', 'issues_sec', 'potential_sec', 'concern_sec', 'scenario_sec'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // If the section occupies a significant portion or its top crosses the threshold
          setActiveSKUTab(entry.target.id);
        }
      });
    }, {
      root: listRef.current, // Observe scrolling within the main container
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is near the top
      threshold: 0
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, [activeTab]);

  // Disable browser automatic scroll restoration to prevent cached scroll memory on routing/module switches
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Force content container and window scroll back to absolute top on activeTab or activeMenu switching
  useEffect(() => {
    const forceScrollToTop = () => {
      if (listRef.current) {
        listRef.current.scrollTop = 0;
        listRef.current.scrollLeft = 0;
      }
      window.scrollTo(0, 0);
    };

    forceScrollToTop();

    // Use successive requestAnimationFrames to fully overwrite any browser-native delayed scroll attempts
    let frameId1 = requestAnimationFrame(() => {
      forceScrollToTop();
      let frameId2 = requestAnimationFrame(forceScrollToTop);
      return () => cancelAnimationFrame(frameId2);
    });

    return () => {
      cancelAnimationFrame(frameId1);
    };
  }, [activeTab, activeMenu]);

  // ----- Reset Action -----
  const handleResetFilters = () => {
    const defaultState: FilterState = {
      timeRange: ['2025-02-04', '2025-06-24'],
      period: 'Daily',
      dataSource: 'All',
      category: 'TV',
      ecommerceSource: 'Walmart',
      brand: 'Hisense',
      productCountry: 'US',
      productSeries: 'U7K',
      productName: '100U7K-US',
      size: '100',
      isVerticalReview: 'True',
      starRating: 'All',
      showDuplicateReview: 'Yes',
      keywordQuery: ''
    };
    setDraftFilters(defaultState);
    setFilterState(defaultState);
    setProductIssueSearch('');
    setPotentialReqSearch('');
    setLv4Search('');
    setSelectedL1Concern(null);
    setSelectedScenarioFilter(null);
    setSelectedPlacementFilter(null);
    triggerNotification('Filters successfully reset to defaults.');
  };

  const handleApplyFilters = () => {
    setFilterState({ ...draftFilters });
    triggerNotification('Search filters updated successfully.');
  };

  const triggerNotification = (msg: string) => {
    if (msg === t('Stay tuned') || msg === '敬请期待') {
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
  };

  // Switch Data Source from metric card click
  const handleMetricCardClick = (sourceName: string) => {
    let sourceValue = 'All';
    if (sourceName.includes('E-commerce')) sourceValue = 'E-commerce';
    if (sourceName.includes('Social Media')) sourceValue = 'Social Media';
    if (sourceName.includes('Internal Data')) sourceValue = 'Internal Data';

    setDraftFilters(prev => ({ ...prev, dataSource: sourceValue }));
    setFilterState(prev => ({ ...prev, dataSource: sourceValue }));
    triggerNotification(`Filtered view to only: ${sourceValue}`);
  };

  // ----- View Review Popup Trigger Helper -----
  const triggerReviewPopup = (no: number, tableType: string, titleStr: string) => {
    const match = sampleReviews.find(r => r.category.toLowerCase().includes(titleStr.split(' ')[0].toLowerCase().trim())) || {
      id: `m-gen-${no}`,
      user: 'Verified Purchaser - Customer Feedback',
      rating: 4,
      source: filterState.ecommerceSource ? `E-commerce ${filterState.ecommerceSource}` : 'E-commerce Source',
      date: '2025-05-24',
      commentText: `Customer expressed general notice on "${titleStr}". System raw text matches specific issue reports: "${titleStr}" with high frequency occurrence during period summaries. Recommended focus actions include optimization of service loops and bracket configurations in high-demand series like ${filterState.productSeries}.`,
      category: titleStr,
      sentiment: 'negative' as const
    };
    setSelectedReviewPopup(match);
    setDialogOpen(true);
  };

  // ----- Filtered lists / values based on interactive state -----
  const [selectedSKUCategory, setSelectedSKUCategory] = useState<string>('All Categories');

  // 1. Core metric values (dynamically update slightly according to filter to feel real!)
  const metrics = useMemo<MetricCardData[]>(() => {
    // base ratios
    let multiplier = 1.0;
    if (filterState.brand !== 'Hisense' && filterState.brand !== 'All') multiplier *= 0.7;
    if (filterState.size === '85') multiplier *= 0.6;
    if (filterState.size === '75') multiplier *= 0.45;
    if (filterState.dataSource && filterState.dataSource !== 'All') {
      multiplier *= 0.8;
    }

    // Proportional metrics multiplier based on active category
    let catMultiplier = 1.0;
    if (selectedSKUCategory === 'Brand Awareness') catMultiplier = 0.35;
    else if (selectedSKUCategory === 'Purchase Interaction') catMultiplier = 0.28;
    else if (selectedSKUCategory === 'Logistics & Delivery') catMultiplier = 0.22;
    else if (selectedSKUCategory === 'Returns & Exchanges') catMultiplier = 0.18;
    else if (selectedSKUCategory === 'Installation & Commissioning') catMultiplier = 0.15;
    else if (selectedSKUCategory === 'Product Application') catMultiplier = 0.12;
    else if (selectedSKUCategory === 'Maintenance') catMultiplier = 0.08;
    else if (selectedSKUCategory === 'Repurchase & Replacement') catMultiplier = 0.04;

    const totalVal = Math.round(8000 * multiplier * catMultiplier);
    const ecommerceVal = Math.round(2800 * multiplier * catMultiplier);
    const socialVal = Math.round(429 * multiplier * catMultiplier);
    const internalVal = 0; // always 0 in requirements

    return [
      {
        id: 'total',
        title: 'Total Mentions',
        value: totalVal >= 1000 ? `${(totalVal / 1000).toFixed(1)}K` : `${totalVal}`,
        changeValue: '3.5%',
        changeType: 'up',
        realValue: totalVal
      },
      {
        id: 'ecommerce',
        title: 'E-commerce Mentions',
        value: ecommerceVal >= 1000 ? `${(ecommerceVal / 1000).toFixed(1)}K` : `${ecommerceVal}`,
        changeValue: '3.5%',
        changeType: 'down',
        realValue: ecommerceVal
      },
      {
        id: 'social',
        title: 'Social Media Mentions',
        value: `${socialVal}`,
        changeValue: '3.5%',
        changeType: 'up',
        realValue: socialVal
      },
      {
        id: 'internal',
        title: 'Internal Data Mentions',
        value: `${internalVal}`,
        changeValue: '0%',
        changeType: 'flat',
        realValue: internalVal
      }
    ];
  }, [filterState, selectedSKUCategory]);

  // 2. Issues Data (top 100 filtered by tag or search)
  const [activeIssuesTag, setActiveIssuesTag] = useState<string>('All Categories');
  const filteredProductIssues = useMemo(() => {
    const categoryIssuesMap: Record<string, string[]> = {
      'Brand Awareness': ['Compliance of Product, Service & Promotion Policies', 'National Subsidy Policy'],
      'Purchase Interaction': ['Sales Price Fluctuation', 'Billing Policy', 'Overselling'],
      'Logistics & Delivery': ['Product Delivery Timeliness', 'Overselling', 'Return Lead Time'],
      'Returns & Exchanges': ['Return Lead Time', 'Compliance of Product, Service & Promotion Policies'],
      'Installation & Commissioning': ['Installation Specification', 'Billing Policy', 'Accessory Issues'],
      'Product Application': ['Switch Equipment Issues', 'Accessory Issues'],
      'Maintenance': ['Installation Specification'],
      'Repurchase & Replacement': ['Compliance of Product, Service & Promotion Policies']
    };

    return initialProductIssues.filter(item => {
      // Category tag filtering
      if (activeIssuesTag !== 'All Categories') {
        const allowedTypes = categoryIssuesMap[activeIssuesTag] || [];
        if (!allowedTypes.includes(item.issueType)) {
          return false;
        }
      }
      // Text Search
      if (productIssueSearch) {
        const query = productIssueSearch.toLowerCase();
        return (
          item.issueType.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeIssuesTag, productIssueSearch]);

  const [activeReqTag, setActiveReqTag] = useState<string>('All Categories');
  const filteredPotentialReqs = useMemo(() => {
    const categoryReqsMap: Record<string, string[]> = {
      'Brand Awareness': ['Policy Implementation', 'Audio Quality'],
      'Purchase Interaction': ['Sales Price Fluctuation', 'Order Modification'],
      'Logistics & Delivery': ['Delivery Timeliness', 'Last-mile Delivery Standard', 'Policy Implementation'],
      'Returns & Exchanges': ['Size Issue', 'Order Modification', 'Policy Implementation'],
      'Installation & Commissioning': ['Installation Standardization', 'Accessory Issues', 'Platform Service'],
      'Product Application': ['Audio Quality', 'Platform Service'],
      'Maintenance': ['Platform Service'],
      'Repurchase & Replacement': ['Policy Implementation']
    };

    return initialPotentialRequirements.filter(item => {
      // Category tag filtering
      if (activeReqTag !== 'All Categories') {
        const allowedTypes = categoryReqsMap[activeReqTag] || [];
        if (!allowedTypes.includes(item.issueType)) {
          return false;
        }
      }

      // Text search
      if (potentialReqSearch) {
        const query = potentialReqSearch.toLowerCase();
        return (
          item.issueType.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [activeReqTag, potentialReqSearch]);

  // Proportional dynamic Child (L2, L3) Concerns based on active category
  const activeLv2Concerns = useMemo(() => {
    const parentCategory = selectedL1Concern || selectedSKUCategory || 'All Categories';
    if (parentCategory === 'All Categories') {
      return lv2Concerns;
    }
    const map: Record<string, typeof lv2Concerns> = {
      'Brand Awareness': [
        { name: 'Advertised Specs', positive: 50, negative: 40, total: 90 },
        { name: 'Brand Reputation', positive: 45, negative: 35, total: 80 },
        { name: 'Product Visibility', positive: 30, negative: 40, total: 70 },
      ],
      'Purchase Interaction': [
        { name: 'Payment Flow', positive: 40, negative: 45, total: 85 },
        { name: 'Price Match Policy', positive: 35, negative: 35, total: 70 },
        { name: 'Discount Voucher Code', positive: 25, negative: 20, total: 45 },
      ],
      'Logistics & Delivery': [
        { name: 'Shipping Delay', positive: 20, negative: 50, total: 70 },
        { name: 'Package Damage', positive: 15, negative: 40, total: 55 },
        { name: 'Carrier Coordination', positive: 15, negative: 30, total: 45 },
      ],
      'Returns & Exchanges': [
        { name: 'Refund Wait Time', positive: 15, negative: 45, total: 60 },
        { name: 'Return Authorization', positive: 20, negative: 35, total: 55 },
        { name: 'Restocking Fee', positive: 10, negative: 25, total: 35 },
      ],
      'Installation & Commissioning': [
        { name: 'Technician Skill', positive: 35, negative: 45, total: 80 },
        { name: 'Wall Mount Incompatibility', positive: 20, negative: 35, total: 55 },
        { name: 'Scheduling Flex', positive: 15, negative: 25, total: 40 },
      ],
      'Product Application': [
        { name: 'Screen Brightness', positive: 65, negative: 25, total: 90 },
        { name: 'Sound Quality', positive: 55, negative: 30, total: 85 },
        { name: 'UI Responsiveness', positive: 40, negative: 35, total: 75 },
      ],
      'Maintenance': [
        { name: 'Technical Support', positive: 25, negative: 45, total: 70 },
        { name: 'Spare Parts Availability', positive: 15, negative: 35, total: 50 },
        { name: 'Extended Warranty Policy', positive: 20, negative: 20, total: 40 },
      ],
      'Repurchase & Replacement': [
        { name: 'Trade-in Subsidy', positive: 45, negative: 35, total: 80 },
        { name: 'Loyalty Points Credit', positive: 35, negative: 25, total: 60 },
        { name: 'Upgrade Notifications', positive: 20, negative: 20, total: 40 },
      ]
    };
    return map[parentCategory] || lv2Concerns;
  }, [selectedSKUCategory, selectedL1Concern]);

  const activeLv3Concerns = useMemo(() => {
    // Computed based on selected L2 concern, selected L1 concern, or category
    const parentCategory = selectedL1Concern || selectedSKUCategory || 'All Categories';
    const l2 = selectedL2Concern;

    if (l2) {
      return [
        { name: `${l2} Compatibility`, positive: 65, negative: 30, total: 95 },
        { name: `${l2} Efficiency`, positive: 45, negative: 35, total: 80 },
        { name: `${l2} Config Options`, positive: 35, negative: 25, total: 60 },
        { name: `${l2} Responsiveness`, positive: 30, negative: 20, total: 50 },
        { name: `${l2} User Tuning`, positive: 20, negative: 15, total: 35 }
      ];
    }

    if (parentCategory === 'All Categories') {
      return [
        { name: 'Hardware Connection', positive: 55, negative: 30, total: 85 },
        { name: 'Sound Settings UI', positive: 45, negative: 35, total: 80 },
        { name: 'Mount Rigidity', positive: 40, negative: 25, total: 65 },
        { name: 'Packaging Inspection', positive: 35, negative: 20, total: 55 },
        { name: 'App Control', positive: 25, negative: 15, total: 40 }
      ];
    }

    return [
      { name: `${parentCategory} Subsystem A`, positive: 50, negative: 35, total: 85 },
      { name: `${parentCategory} Subsystem B`, positive: 45, negative: 30, total: 75 },
      { name: `${parentCategory} Subsystem C`, positive: 35, negative: 25, total: 60 },
      { name: `${parentCategory} Subsystem D`, positive: 25, negative: 20, total: 45 }
    ];
  }, [selectedL2Concern, selectedL1Concern, selectedSKUCategory]);

  // Lv4 Concerns Filtered list based on selected Lv1/Lv2/Lv3 concerns or searches
  const filteredLv4Concerns = useMemo(() => {
    // 1. Gather active selection context
    const activeL1 = selectedL1Concern || selectedSKUCategory || 'All Categories';
    const activeL2 = selectedL2Concern || 'General';
    const activeL3 = selectedL3Concern || 'Standard Subsystem';

    // 2. Filter sentiment selection
    const sentimentsToUse = selectedSentiments.length > 0 ? selectedSentiments : ['Negative Sentiment', 'Positive Sentiment'];

    // 3. Generate a gorgeous, context-relevant, extensive list if any selection is active to ensure 15 highly custom rows
    if (selectedL1Concern || selectedL2Concern || selectedL3Concern || selectedSKUCategory !== 'All Categories') {
      const generated: typeof lv4ConcernsList = [];
      const issuesPool = [
        `Users expect cleaner integration for ${activeL1} in their daily home setup.`,
        `Fitted components under ${activeL2} sometimes exhibit tiny gaps or alignment issues during unboxing.`,
        `The software menu for ${activeL3} does not respond quickly enough during initial configuration.`,
        `Customers praise the incredible reliability of ${activeL1} compared to previous year models.`,
        `Minor instruction errors for ${activeL2} led to minor confusion during installation process.`,
        `The product interface and accessibility settings for ${activeL3} feel extremely polished.`,
        `Remote control binding is slow when setting up ${activeL2} with regional TV presets.`,
        `Unboxing feedback indicates protective films for ${activeL3} are sometimes hard to peel cleanly.`,
        `Excellent packaging preserves all parts of ${activeL1} securely during international delivery.`,
        `Some customers requested detailed video tutorials specifically for ${activeL3} operations.`,
        `Power consumption in standby mode for ${activeL2} matches national efficiency criteria.`,
        `Heat dissipation around the back vents for ${activeL1} remains under optimal threshold.`,
        `Color accuracy and calibration profiles under ${activeL3} received highly favorable comments.`,
        `The built-in system speakers provide clear, spatial sound immersion for ${activeL2} presets.`,
        `Warranty activation cards under ${activeL1} should include scannable QR codes for faster registrations.`,
        `The user manual contains detailed dimensions for coordinating custom wall setups under ${activeL3}.`
      ];

      for (let i = 0; i < 15; i++) {
        const sentiment = sentimentsToUse[i % sentimentsToUse.length];
        const isUp = i % 2 === 0;
        
        let l4Name = '';
        if (i % 3 === 0) l4Name = `${activeL1.substring(0, 8)}-Spec`;
        else if (i % 3 === 1) l4Name = `${activeL2.substring(0, 10)}-General`;
        else l4Name = `${activeL3.substring(0, 12)}-Subsystem`;

        let description = issuesPool[i];
        if (lv4Search) {
          const query = lv4Search.toLowerCase();
          if (!description.toLowerCase().includes(query)) {
            description = `[Ref Search: ${lv4Search}] - ` + description;
          }
        }

        generated.push({
          no: i + 1,
          sentiment: sentiment,
          lv4Name: l4Name,
          issueType: description,
          percentage: parseFloat((8.5 - i * 0.4).toFixed(1)) || 0.8,
          sampleCount: Math.round(200 - i * 11),
          momChange: `${isUp ? '+' : '-'}${Math.round(15 + i * 8)}%`,
          isUp: isUp
        });
      }
      return generated;
    }

    // Default list from data.ts
    const list = lv4ConcernsList.filter(item => {
      if (!selectedSentiments.includes(item.sentiment)) return false;
      if (lv4Search) {
        const query = lv4Search.toLowerCase();
        return (
          item.lv4Name.toLowerCase().includes(query) ||
          item.issueType.toLowerCase().includes(query)
        );
      }
      return true;
    });

    if (list.length < 12) {
      const padded = [...list];
      let idx = 1;
      while (padded.length < 12) {
        const sentiment = sentimentsToUse[idx % sentimentsToUse.length];
        padded.push({
          no: padded.length + 1,
          sentiment: sentiment,
          lv4Name: 'General-Optimisation',
          issueType: `Internal parameter customization and audio sync testing relative to general user sentiments (${idx}).`,
          percentage: 1.5,
          sampleCount: 42 + idx,
          momChange: '+3.1%',
          isUp: true
        });
        idx++;
      }
      return padded;
    }

    return list;
  }, [selectedL1Concern, selectedL2Concern, selectedL3Concern, selectedSKUCategory, selectedSentiments, lv4Search]);

  // Pie chart calculations (to handle clicked hiding of sectors)
  const pieSectors = useMemo(() => {
    const rawSectors = [
      { name: 'Recessed Wall Mount', value: 35.5, color: '#0D8582' },
      { name: 'Demo Display & Teardown', value: 20.0, color: '#00AAA6' },
      { name: 'Standard Wall Mount', value: 16.5, color: '#F76560' },
      { name: 'Non-Recessed Wall Mount', value: 11.6, color: '#33D1CC' },
      { name: 'Tabletop/Stand Mount', value: 6.9, color: '#FF7D00' },
      { name: 'Other Methods', value: 9.5, color: '#8C8C8C' }
    ];
    return rawSectors.filter(s => !hiddenInstallationSectors.includes(s.name));
  }, [hiddenInstallationSectors]);

  const totalPieValue = useMemo(() => {
    return pieSectors.reduce((acc, curr) => acc + curr.value, 0);
  }, [pieSectors]);

  // Toggle installation segment
  const handleToggleInstallationSector = (name: string) => {
    setHiddenInstallationSectors(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      } else {
        // Make sure we don't hide everything
        if (prev.length >= 5) return prev;
        return [...prev, name];
      }
    });
  };

  return (
    <div className="min-h-screen text-[#333333] font-sans antialiased flex flex-col bg-[#F5F7FA]">
      
      {/* 1、顶部导航栏的样式参考代码调整 */}
      <div className="bg-white border-b border-[#e5e6eb] flex items-center justify-between py-[8px] px-3 md:px-6 h-[52px] shrink-0 relative z-50 shadow-xs" data-name="Topmenu">
        {/* Mobile hamburger button */}
        <button
          className="lg:hidden flex items-center justify-center size-[36px] rounded-md hover:bg-gray-100 mr-1 shrink-0"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-[#4e5969]" />
        </button>

        {/* LOGO AREA */}
        <div className="content-stretch flex gap-[8px] items-center px-2 md:px-4 relative shrink-0" data-name="logo">
          <div className="relative rounded-[4px] shrink-0" data-name="icon-wrapper">
            <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-center justify-center relative size-full">
                <div className="overflow-clip relative shrink-0 size-[24px]" data-name="voc-logo 186*186">
                  {/* Left logo backrect and voc indicator */}
                  <div className="absolute inset-0 bg-[#00AAA6] rounded-[4px] flex items-center justify-center text-white font-bold text-[10px]" data-name="矩形">
                    VOC
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="[word-break:break-word] font-sans font-medium leading-[24px] relative shrink-0 text-[#1c2633] text-[22px] whitespace-nowrap">VocInsight</p>
        </div>

        {/* RIGHT AREA: FRAME1 & FRAME */}
        <div className="content-stretch flex items-center justify-end px-4 relative shrink-0">
          <div className="content-stretch flex items-center justify-end relative shrink-0 gap-2">
            {/* Lang Dropdown */}
            <div className="content-stretch flex items-center pl-[8px] relative shrink-0" data-name="Topmenu-icon">
              <div className="content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[20px] shrink-0 size-[32px] hover:bg-slate-50 cursor-pointer" data-name="Topmenu-icon-item" onClick={toggleLanguage}>
                <p className="[word-break:break-word] font-sans leading-[12px] not-italic relative shrink-0 text-[#00aaa6] text-[12px] whitespace-nowrap">{language}</p>
              </div>
            </div>

            {/* Notification bell */}
            <div 
              className="content-stretch flex items-center pl-[8px] relative shrink-0 cursor-pointer" 
              data-name="Topmenu-icon" 
              onClick={() => triggerNotification('31 Real-time high urgency system warnings triggered')}
            >
              <div className="relative rounded-[20px] shrink-0 hover:bg-gray-100" data-name="Topmenu-icon-item">
                <div className="content-stretch flex items-start p-[8px] relative size-full">
                  <div className="relative shrink-0 text-[#4E5969]" data-name="icon-wrapper">
                    <Bell size={16} />
                  </div>
                  <div className="-translate-x-1/2 absolute bg-[#f53f3f] h-[14px] left-[calc(50%+13px)] rounded-[16px] top-[2px] px-1" data-name="Bage">
                    <div className="flex flex-row items-center justify-center size-full">
                      <div className="content-stretch flex items-center justify-center relative size-full">
                        <div className="[word-break:break-word] flex flex-col font-sans justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
                          <p className="leading-[12px]">31</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* UserAvatar & UserInfo */}
            <div className="content-stretch flex items-center pl-[16px] relative shrink-0" data-name="User-info">
              <div className="bg-[#e3e7ff] content-stretch flex flex-col items-center justify-center relative rounded-[23.333px] shrink-0 size-[32px]" data-name="User-avatar">
                <p className="[word-break:break-word] font-sans font-medium leading-[22px] relative shrink-0 text-[#5a4ded] text-[14px] uppercase whitespace-nowrap">
                  H
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main body wrapper layout */}
      <div className="flex-grow flex flex-row min-h-0 relative w-full h-[calc(100vh-52px)]">
        
        {/* Toast Alert Notice */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 right-8 z-[200] bg-zinc-900 text-white text-xs px-4 py-3 rounded shadow-xl flex items-center gap-2 border border-zinc-700"
            >
              <span className="w-2 h-2 rounded-full bg-[#00AAA6] animate-pulse"></span>
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile sidebar backdrop */}
        {isMobileSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR PANEL (Width fixed, expandable) */}
        <aside
          id="side_layout_nav"
          className={`bg-[#f7f8fa] flex flex-col shrink-0 transition-all duration-300 z-40 ${
            isSidebarExpanded ? 'w-[220px]' : 'w-[56px]'
          } ${
            // Mobile: fixed overlay, hidden by default
            'fixed inset-y-0 left-0 lg:relative lg:flex'
          } ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* LOGO AREA Collapsed to simple header */}

        {/* SIDE BAR CONTENT */}
        <div className="bg-[#f7f8fa] flex-1 min-h-px relative w-full overflow-y-auto" data-name="Side menuA">
          {/* Mobile close button */}
          <button
            className="lg:hidden absolute top-3 right-3 z-10 p-1.5 rounded-md hover:bg-gray-200 text-[#4e5969]"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X size={18} />
          </button>
          <div className={`content-stretch flex flex-col gap-[4px] items-start pb-[20px] pt-[8px] relative size-full ${isSidebarExpanded ? 'px-[12px]' : 'px-[4px]'}`}>
            
            {/* GROUP 1: Product Insight */}
            <div className="relative shrink-0 w-full" data-name="Sidemenu-A-main">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative size-full">
                <div 
                  onClick={() => isSidebarExpanded && setIsProductInsightExpanded(!isProductInsightExpanded)}
                  className="bg-[#f7f8fa] hover:bg-[#ebedf0] h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer" 
                  data-name="Sidemenu-A-main"
                >
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                    <div className="content-stretch flex gap-[4px] items-center px-[12px] py-[7px] relative size-full">
                      
                      {/* MenuItem */}
                      <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="Menu-item">
                        <div className="relative shrink-0 size-[20px] flex items-center justify-center" data-name="icon-wrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-pie w-5 h-5 shrink-0 text-slate-500" aria-hidden="true"><path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path></svg>
                        </div>
                        {isSidebarExpanded && (
                          <p className="[word-break:break-word] flex-[1_0_0] font-sans font-medium leading-[22px] min-w-px overflow-hidden relative text-[#4e5969] text-[14px] text-ellipsis whitespace-nowrap">
                            {t('Product Insight')}
                          </p>
                        )}
                      </div>

                      {isSidebarExpanded && (
                        <div className="relative shrink-0 flex items-center justify-center p-0.5" data-name="icon-wrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down w-4 h-4 transition-transform text-[#4e5969] ${isProductInsightExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Submenu List */}
                {isSidebarExpanded && isProductInsightExpanded && (
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Submenu">
                    
                    <div
                      onClick={() => openTab('single_sku')}
                      className={`h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-150 ${
                        activeTab === 'single_sku' ? 'bg-[#e5f6f6]' : 'bg-[#f7f8fa] hover:bg-gray-200/50'
                      }`}
                      data-name="Sidemenu-A-sub"
                    >
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center pl-[34px] pr-[12px] py-[7px] relative size-full">
                          <p className={`[word-break:break-word] flex-[1_0_0] font-sans leading-[22px] min-w-px not-italic overflow-hidden relative text-ellipsis whitespace-nowrap text-[14px] ${
                            activeTab === 'single_sku' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'
                          }`}>
                            {t('Single SKU Analysis')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => openTab('comparative')}
                      className={`h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-150 ${
                        activeTab === 'comparative' ? 'bg-[#e5f6f6]' : 'bg-[#f7f8fa] hover:bg-gray-200/50'
                      }`}
                      data-name="Sidemenu-A-sub"
                    >
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center pl-[34px] pr-[12px] py-[7px] relative size-full">
                          <p className={`[word-break:break-word] flex-[1_0_0] font-sans leading-[22px] min-w-px not-italic overflow-hidden relative text-ellipsis whitespace-nowrap text-[14px] ${
                            activeTab === 'comparative' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'
                          }`}>
                            {t('Comparative Analysis')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => openTab('self_service')}
                      className={`h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-150 ${
                        activeTab === 'self_service' ? 'bg-[#e5f6f6]' : 'bg-[#f7f8fa] hover:bg-gray-200/50'
                      }`}
                      data-name="Sidemenu-A-sub"
                    >
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center pl-[34px] pr-[12px] py-[7px] relative size-full">
                          <p className={`[word-break:break-word] flex-[1_0_0] font-sans leading-[22px] min-w-px not-italic overflow-hidden relative text-ellipsis whitespace-nowrap text-[14px] ${
                            activeTab === 'self_service' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'
                          }`}>
                            {t('Self-service analytics')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        openTab('core_kpi');
                        setActiveTab('core_kpi');
                        setActiveMenu('Core KPI Dashboard');
                      }}
                      className={`h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-150 ${
                        activeTab === 'core_kpi' ? 'bg-[#e5f6f6]' : 'bg-[#f7f8fa] hover:bg-gray-200/50'
                      }`}
                      data-name="Sidemenu-A-sub"
                    >
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center pl-[34px] pr-[12px] py-[7px] relative size-full">
                          <p className={`[word-break:break-word] flex-[1_0_0] font-sans leading-[22px] min-w-px overflow-hidden relative text-[14px] text-ellipsis whitespace-nowrap ${
                            activeTab === 'core_kpi' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'
                          }`}>
                            {t('Core KPI Dashboard')}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* GROUP 2: Voice Closed-Loop */}
            <div className="relative shrink-0 w-full mt-2" data-name="Sidemenu-A-main">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative size-full">
                <div 
                  onClick={() => isSidebarExpanded && setIsVoiceClosedLoopExpanded(!isVoiceClosedLoopExpanded)}
                  className="bg-[#f7f8fa] hover:bg-[#ebedf0] h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer" 
                  data-name="Sidemenu-A-main"
                >
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                    <div className="content-stretch flex gap-[4px] items-center px-[12px] py-[7px] relative size-full">
                      
                      {/* MenuItem1 */}
                      <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-w-px relative" data-name="Menu-item">
                        <div className="relative shrink-0 size-[20px] flex items-center justify-center" data-name="icon-wrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-pie w-5 h-5 shrink-0 text-slate-500" aria-hidden="true"><path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path></svg>
                        </div>
                        {isSidebarExpanded && (
                          <p className="[word-break:break-word] flex-[1_0_0] font-sans font-medium leading-[22px] min-w-px overflow-hidden relative text-[#4e5969] text-[14px] text-ellipsis whitespace-nowrap">
                            {t('Voice Closed-Loop')}
                          </p>
                        )}
                      </div>

                      {isSidebarExpanded && (
                        <div className="relative shrink-0 flex items-center justify-center p-0.5" data-name="icon-wrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down w-4 h-4 transition-transform text-[#4e5969] ${isVoiceClosedLoopExpanded ? 'rotate-180' : ''}`} aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </div>
                      )}

                    </div>
                  </div>
                </div>

                {/* Submenu1 List */}
                {isSidebarExpanded && isVoiceClosedLoopExpanded && (
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Submenu">
                    <div
                      onClick={() => triggerNotification(t('Stay tuned'))}
                      className="bg-[#f7f8fa] hover:bg-gray-200/50 h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-150"
                      data-name="Sidemenu-A-sub"
                    >
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center pl-[34px] pr-[12px] py-[7px] relative size-full">
                          <p className="[word-break:break-word] flex-[1_0_0] font-sans font-normal leading-[22px] min-w-px overflow-hidden relative text-[#C9CDD4] text-[14px] text-ellipsis whitespace-nowrap">
                            {t('Public Sentiment Closed-Loop')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => triggerNotification(t('Stay tuned'))}
                      className="bg-[#f7f8fa] hover:bg-gray-200/50 h-[36px] relative rounded-[4px] shrink-0 w-full cursor-pointer transition-all duration-150"
                      data-name="Sidemenu-A-sub"
                    >
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex items-center pl-[34px] pr-[12px] py-[7px] relative size-full">
                          <p className="[word-break:break-word] flex-[1_0_0] font-sans font-normal leading-[22px] min-w-px overflow-hidden relative text-[#C9CDD4] text-[14px] text-ellipsis whitespace-nowrap">
                            {t('Issue & Demand Closed-Loop')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* SHRINK BUTTON FOOTER AREA */}
        <div className="bg-[#f7f8fa] relative shrink-0 w-full border-t border-[#e5e6eb]" data-name="Menu-shrink">
          <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex flex-col items-start justify-center px-[12px] py-[10px] relative size-full">
              
              {/* MenuShrinkGroup */}
              <div
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="content-stretch flex items-center p-[4px] relative shrink-0 cursor-pointer hover:bg-gray-200/50 rounded"
                data-name="Menu-shrink-group"
              >
                <div className="bg-[#f2f3f5] relative rounded-[4px] shrink-0 size-[24px]" data-name="Sidemenu-icon-unfold">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2" data-name="icon-wrapper">
                    <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
                      <div className="content-stretch flex flex-col items-center justify-center relative size-full">
                        <div className="overflow-clip relative shrink-0 size-[16px]" data-name="direction/menu-fold">
                          <div className="absolute flex inset-[18.75%_12.5%] items-center justify-center">
                            <div className="flex-none h-full w-full relative">
                              <div className="relative size-full pt-1" data-name="Vector">
                                {isSidebarExpanded ? (
                                  <svg className="absolute block inset-0 size-full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M912 560h-512c-25.6 0-44.8-22.4-44.8-48s19.2-48 44.8-48h508.8c25.6 0 44.8 22.4 44.8 48s-19.2 48-41.6 48zM908.8 227.2H128c-25.6 0-48-19.2-51.2-44.8 0-25.6 22.4-51.2 48-51.2h780.8c25.6 0 48 19.2 51.2 44.8 0 28.8-22.4 51.2-48 51.2z" fill="#4E5969"></path>
                                    <path d="M76.8 668.8v-320l224 160-224 160z" fill="#4E5969"></path>
                                    <path d="M124.8 787.2h780.8c25.6 0 48 19.2 51.2 48 0 28.8-19.2 48-48 48H128c-25.6 0-48-19.2-51.2-48-3.2-25.6 19.2-48 48-48z" fill="#4E5969"></path>
                                  </svg>
                                ) : (
                                  <svg className="absolute block inset-0 size-full" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M810.667 725.333a42.667 42.667 0 1 1 0 85.334H213.333a42.667 42.667 0 1 1 0-85.334h597.334z m3.84-318.08a25.6 25.6 0 0 1 38.826 21.974v165.546a25.6 25.6 0 0 1-38.826 21.974l-137.899-82.774a25.6 25.6 0 0 1 0-43.946zM512 469.333a42.667 42.667 0 1 1 0 85.334H213.333a42.667 42.667 0 1 1 0-85.334H512z m298.667-256a42.667 42.667 0 1 1 0 85.334H213.333a42.667 42.667 0 1 1 0-85.334h597.334z" fill="#4E5969"></path>
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTAINER: TOP NAV + INNER CONTENT */}
      <div ref={listRef} className="flex-grow flex flex-col min-w-0 h-full overflow-y-auto bg-white">

        {/* 2、页签的位置在main的顶部，样式参考代码调整 */}
        <div className="bg-[#f7f8fa] content-stretch flex items-end sticky top-0 z-40 w-full h-[36px] pt-[8px] pr-2 md:pr-6 overflow-x-auto no-scrollbar" data-name="Tabbar-wrapper">
          <div className="content-stretch flex items-end relative shrink-0 gap-1 h-[28px]" data-name="画框">
            {openTabs.includes('single_sku') && (
              <div 
                onClick={() => openTab('single_sku')}
                className={`h-[28px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 transition-all duration-150 cursor-pointer ${
                  activeTab === 'single_sku'
                    ? 'bg-white text-[#00aaa6] font-medium z-10'
                    : 'bg-[#f7f8fa] text-[#4e5969] hover:bg-slate-100'
                }`} 
                data-name="Tabbar-page-component"
              >
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                  <div className="content-stretch flex items-center px-[12px] py-[5px] relative size-full gap-1.5">
                    <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0" data-name="title">
                      <div className="[word-break:break-word] flex flex-col font-sans justify-center leading-[0] relative shrink-0 text-[12px] whitespace-nowrap">
                        <p className={`leading-[20px] ${activeTab === 'single_sku' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'}`}>Single SKU Analysis</p>
                      </div>
                    </div>
                    {openTabs.length > 1 && activeTab === 'single_sku' && (
                      <div 
                        onClick={(e) => closeTab('single_sku', e)}
                        className="relative shrink-0 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer" 
                        data-name="icon-wrapper"
                      >
                        <X size={10} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {openTabs.includes('comparative') && (
              <div 
                onClick={() => openTab('comparative')}
                className={`h-[28px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 transition-all duration-150 cursor-pointer ${
                  activeTab === 'comparative'
                    ? 'bg-white text-[#00aaa6] font-medium z-10'
                    : 'bg-[#f7f8fa] text-[#4e5969] hover:bg-slate-100'
                }`} 
                data-name="Tabbar-page-component"
              >
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                  <div className="content-stretch flex items-center px-[12px] py-[5px] relative size-full gap-1.5">
                    <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0" data-name="title">
                      <div className="[word-break:break-word] flex flex-col font-sans justify-center leading-[0] relative shrink-0 text-[12px] whitespace-nowrap">
                        <p className={`leading-[20px] ${activeTab === 'comparative' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'}`}>Comparative Analysis</p>
                      </div>
                    </div>
                    {openTabs.length > 1 && activeTab === 'comparative' && (
                      <div 
                        onClick={(e) => closeTab('comparative', e)}
                        className="relative shrink-0 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer" 
                        data-name="icon-wrapper"
                      >
                        <X size={10} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {openTabs.includes('self_service') && (
              <div 
                onClick={() => openTab('self_service')}
                className={`h-[28px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 transition-all duration-150 cursor-pointer ${
                  activeTab === 'self_service'
                    ? 'bg-white text-[#00aaa6] font-medium z-10'
                    : 'bg-[#f7f8fa] text-[#4e5969] hover:bg-slate-100'
                }`} 
                data-name="Tabbar-page-component"
              >
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                  <div className="content-stretch flex items-center px-[12px] py-[5px] relative size-full gap-1.5">
                    <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0" data-name="title">
                      <div className="[word-break:break-word] flex flex-col font-sans justify-center leading-[0] relative shrink-0 text-[12px] whitespace-nowrap">
                        <p className={`leading-[20px] ${activeTab === 'self_service' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'}`}>Self-service analytics</p>
                      </div>
                    </div>
                    {openTabs.length > 1 && activeTab === 'self_service' && (
                      <div 
                        onClick={(e) => closeTab('self_service', e)}
                        className="relative shrink-0 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer" 
                        data-name="icon-wrapper"
                      >
                        <X size={10} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {openTabs.includes('core_kpi') && (
              <div 
                onClick={() => {
                  setActiveTab('core_kpi');
                  setActiveMenu('Core KPI Dashboard');
                }}
                className={`h-[28px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 transition-all duration-150 cursor-pointer ${
                  activeTab === 'core_kpi'
                    ? 'bg-white text-[#00aaa6] font-medium z-10'
                    : 'bg-[#f7f8fa] text-[#4e5969] hover:bg-slate-100'
                }`} 
                data-name="Tabbar-page-component"
              >
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                  <div className="content-stretch flex items-center px-[12px] py-[5px] relative size-full gap-1.5">
                    <div className="content-stretch flex items-center justify-center px-[4px] relative shrink-0" data-name="title">
                      <div className="[word-break:break-word] flex flex-col font-sans justify-center leading-[0] relative shrink-0 text-[12px] whitespace-nowrap">
                        <p className={`leading-[20px] ${activeTab === 'core_kpi' ? 'text-[#00aaa6] font-medium' : 'text-[#4e5969] font-normal'}`}>{t('Core KPI Dashboard')}</p>
                      </div>
                    </div>
                    {openTabs.length > 1 && activeTab === 'core_kpi' && (
                      <div 
                        onClick={(e) => closeTab('core_kpi', e)}
                        className="relative shrink-0 p-0.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 cursor-pointer" 
                        data-name="icon-wrapper"
                      >
                        <X size={10} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ROUTED CONTENT VIEW */}
        <main className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* PAGE SUBTITLE */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-[#1F2937]">
                {activeTab === 'single_sku' && t('Single SKU Analysis')}
                {activeTab === 'comparative' && t('Comparative Analysis')}
                {activeTab === 'self_service' && t('Self-service analytics')}
                {activeTab === 'core_kpi' && t('Core KPI Dashboard')}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {activeTab === 'single_sku' && t('Complete VocInsight user voice intelligence workspace for deep SKU sentiment profiles and operational alerts.')}
                {activeTab === 'comparative' && t('Compare competitive products to benchmark pain points, latent needs, experiences and usage scenarios.')}
                {activeTab === 'self_service' && t('Explore self-service multi-dimensional analytical workbenches and user segmentations.')}
                {activeTab === 'core_kpi' && t('Monitor key performance indicators and sentiment trends across regions and brands.')}
              </p>
            </div>
          </div>
          
          {/* SECTION 1: TOP FILTERS BAR (区块1：顶部筛选栏) */}
              <section id="unified_filters_bar">
                <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch">
                  
                  {/* Left filter inputs layout */}
                  <div className="w-full flex-grow grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-3 text-xs content-start">
                    
                    {/* 1. Time Select Options & Date Inputs */}
                    <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                      <div className="relative h-full w-[84px] shrink-0 rounded-l-[4px] group bg-white cursor-pointer select-none">
                        <select
                          value={draftFilters.period}
                          onChange={(e) => setDraftFilters({ ...draftFilters, period: e.target.value as any })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        >
                          <option value="Daily">{t('Daily')}</option>
                          <option value="Weekly">{t('Weekly')}</option>
                          <option value="Monthly">{t('Monthly')}</option>
                          <option value="Yearly">{t('Yearly')}</option>
                          <option value="Period Summary">{t('Period')}</option>
                        </select>
                        <div className="absolute inset-0 flex gap-[4px] items-center justify-center px-[12px] py-[5px] relative rounded-bl-[4px] rounded-tl-[4px] size-full transition-all group-hover:bg-slate-50 pointer-events-none z-10" data-name="title">
                          <p className="[word-break:break-word] font-normal leading-[22px] relative shrink-0 text-[#1d2129] text-[13px] text-right whitespace-nowrap truncate">
                            {t(draftFilters.period === 'Period Summary' ? 'Period' : draftFilters.period)}
                          </p>
                          <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4e5969]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 h-full flex items-center pl-[6px] pr-2 border-l border-[#e5e6eb] bg-white gap-1 rounded-r-[4px]">
                        <input
                          type="text"
                          value={draftFilters.timeRange[0]}
                          onChange={(e) => setDraftFilters({ ...draftFilters, timeRange: [e.target.value, draftFilters.timeRange[1]] })}
                          className="w-full text-center font-mono text-[13px] bg-transparent focus:outline-none text-[#1d2129]"
                        />
                        <span className="text-[#86909c] text-[13px]">-</span>
                        <input
                          type="text"
                          value={draftFilters.timeRange[1]}
                          onChange={(e) => setDraftFilters({ ...draftFilters, timeRange: [draftFilters.timeRange[0], e.target.value] })}
                          className="w-full text-center font-mono text-[13px] bg-transparent focus:outline-none text-[#1d2129]"
                        />
                        <div className="size-[16px] flex items-center justify-center shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 size-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                      </div>
                    </div>

                    {/* 2. Dropdown: Data Source */}
                    <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                      <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                        {t('Data Source')}
                      </div>
                      <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                        <select
                          value={draftFilters.dataSource}
                          onChange={(e) => setDraftFilters({ ...draftFilters, dataSource: e.target.value })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        >
                          <option value="All">{t('All Sources')}</option>
                          <option value="E-commerce">{t('E-commerce')}</option>
                          <option value="Social Media">{t('Social Media')}</option>
                          <option value="Internal Data">{t('Internal Data')}</option>
                        </select>
                        <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                          <span className="truncate">
                            {t(draftFilters.dataSource === 'All' ? 'All Sources' : draftFilters.dataSource)}
                          </span>
                          <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Dropdown: Category */}
                    <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                      <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                        {t('Category')}
                      </div>
                      <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                        <select
                          value={draftFilters.category}
                          onChange={(e) => setDraftFilters({ ...draftFilters, category: e.target.value })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        >
                          <option value="All">{t('All Categories')}</option>
                          <option value="TV">{t('TV')}</option>
                          <option value="Soundbar">{t('Soundbar')}</option>
                          <option value="Home Theater">{t('Home Theater')}</option>
                        </select>
                        <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                          <span className="truncate">{t(draftFilters.category === 'All' ? 'All Categories' : draftFilters.category)}</span>
                          <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Dropdown: E-commerce Source */}
                    <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                      <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                        {t('E-commerce Source')}
                      </div>
                      <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                        <select
                          value={draftFilters.ecommerceSource}
                          onChange={(e) => setDraftFilters({ ...draftFilters, ecommerceSource: e.target.value })}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        >
                          <option value="All">{t('All E-Commerce')}</option>
                          <option value="Walmart">{t('Walmart')}</option>
                          <option value="Amazon">{t('Amazon US')}</option>
                          <option value="JD.com">{t('JD.com (CN)')}</option>
                          <option value="Best Buy">{t('Best Buy')}</option>
                        </select>
                        <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                          <span className="truncate">{t(draftFilters.ecommerceSource === 'All' ? 'All E-Commerce' : draftFilters.ecommerceSource)}</span>
                          <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Extra collapsible filters section */}
                    {/* 5. Brand */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Brand')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                            <select
                              value={draftFilters.brand}
                              onChange={(e) => setDraftFilters({ ...draftFilters, brand: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="All">{t('All Brands')}</option>
                              <option value="Hisense">{t('Hisense')}</option>
                              <option value="Samsung">{t('Samsung')}</option>
                              <option value="Sony">{t('Sony')}</option>
                              <option value="TCL">{t('TCL')}</option>
                            </select>
                            <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                              <span className="truncate">{t(draftFilters.brand === 'All' ? 'All Brands' : draftFilters.brand)}</span>
                              <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 6. Product Country */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Product Country')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                            <select
                              value={draftFilters.productCountry}
                              onChange={(e) => setDraftFilters({ ...draftFilters, productCountry: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="All">{t('All Countries')}</option>
                              <option value="US">{t('US')}</option>
                              <option value="CN">{t('CN')}</option>
                              <option value="DE">{t('DE')}</option>
                            </select>
                            <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                              <span className="truncate">{t(draftFilters.productCountry === 'All' ? 'All Countries' : draftFilters.productCountry)}</span>
                              <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 7. Product Series */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700 flex-none">{t('Product Series')}</div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                            <select
                              value={draftFilters.productSeries}
                              onChange={(e) => setDraftFilters({ ...draftFilters, productSeries: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="All">{t('All Series')}</option>
                              <option value="U7K">{t('U7K')}</option>
                              <option value="U8K">{t('U8K')}</option>
                              <option value="8K-X">{t('U8K Series')}</option>
                            </select>
                            <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                              <span className="truncate">{t(draftFilters.productSeries === 'All' ? 'All Series' : draftFilters.productSeries === '8K-X' ? 'U8K Series' : draftFilters.productSeries)}</span>
                              <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 8. Product Name */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Product Name')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb]">
                            <input
                              type="text"
                              value={draftFilters.productName}
                              onChange={(e) => setDraftFilters({ ...draftFilters, productName: e.target.value })}
                              className="absolute inset-0 w-full h-full px-3 py-1 font-sans text-[13px] text-[#1d2129] focus:outline-none bg-transparent"
                              placeholder={t('e.g. 100U7K-US')}
                            />
                          </div>
                        </div>

                        {/* 9. Size */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Size')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                            <select
                              value={draftFilters.size}
                              onChange={(e) => setDraftFilters({ ...draftFilters, size: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="All">{t('All Sizes')}</option>
                              <option value="100">{t('100')}</option>
                              <option value="85">{t('85')}</option>
                              <option value="75">{t('75')}</option>
                            </select>
                            <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                              <span className="truncate">{t(draftFilters.size === 'All' ? 'All Sizes' : draftFilters.size)}</span>
                              <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                    {!isFiltersCollapsed && (
                      <>
                        {/* 10. Is Vertical Review */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Is Vertical Review')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                            <select
                              value={draftFilters.isVerticalReview}
                              onChange={(e) => setDraftFilters({ ...draftFilters, isVerticalReview: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="All">{t('All Ratings')}</option>
                              <option value="True">{t('True')}</option>
                              <option value="False">{t('False')}</option>
                            </select>
                            <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                              <span className="truncate">{t(draftFilters.isVerticalReview === 'All' ? 'All Ratings' : draftFilters.isVerticalReview)}</span>
                              <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 11. Star Rating */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Star Rating')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                            <select
                              value={draftFilters.starRating}
                              onChange={(e) => setDraftFilters({ ...draftFilters, starRating: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="All">{t('All Star Ratings')}</option>
                              <option value="5">{t('5 Star reviews')}</option>
                              <option value="4">{t('4 Star reviews')}</option>
                              <option value="3">{t('3 Star reviews')}</option>
                              <option value="2">{t('2 Star reviews')}</option>
                              <option value="1">{t('1 Star reviews')}</option>
                            </select>
                            <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                              <span className="truncate">{t(draftFilters.starRating === 'All' ? 'All Star Ratings' : `${draftFilters.starRating} Star reviews`)}</span>
                              <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 12. Show Duplicate Reviews */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129]">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Show Duplicate Review')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb] group">
                            <select
                              value={draftFilters.showDuplicateReview}
                              onChange={(e) => setDraftFilters({ ...draftFilters, showDuplicateReview: e.target.value })}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            >
                              <option value="Yes">{t('Yes')}</option>
                              <option value="No">{t('No')}</option>
                            </select>
                            <div className="absolute inset-0 px-3 py-1 flex items-center justify-between pointer-events-none group-hover:bg-slate-50/80 transition-colors">
                              <span className="truncate">{t(draftFilters.showDuplicateReview)}</span>
                              <div className="size-[14px] flex items-center justify-center shrink-0 text-[#4E5969]">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down block size-full" aria-hidden="true">
                                  <path d="m6 9 6 6 6-6" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 13. Keyword Query */}
                        <div className="relative flex items-center h-[32px] rounded-[4px] border border-[#e5e6eb] bg-white text-[13px] text-[#1d2129] md:col-span-2">
                          <div className="px-3 h-full flex items-center shrink-0 font-sans text-gray-700">
                            {t('Keyword Query')}
                          </div>
                          <div className="flex-1 h-full relative border-l border-[#e5e6eb]">
                            <input
                              type="text"
                              value={draftFilters.keywordQuery}
                              onChange={(e) => setDraftFilters({ ...draftFilters, keywordQuery: e.target.value })}
                              className="absolute inset-0 w-full h-full px-3 py-1 font-sans text-[13px] text-[#1d2129] focus:outline-none bg-transparent"
                              placeholder={t('Search keywords...')}
                            />
                          </div>
                        </div>
                      </>
                    )}

                  </div>

                  {/* Divider line */}
                  <div className="hidden xl:block w-px bg-[#e5e6eb] h-auto shrink-0 self-stretch" />

                  {/* Right side buttons panel */}
                  <div className="content-stretch flex flex-row xl:flex-col gap-[8px] md:gap-[12px] items-start relative shrink-0 w-full xl:w-[99px] pt-2 xl:pt-0">
                    
                    {/* Search button */}
                    <div
                      onClick={handleApplyFilters}
                      className="bg-[#00aaa6] hover:bg-[#008c89] h-[32px] relative rounded-[4px] shrink-0 flex-1 xl:flex-initial xl:w-full cursor-pointer flex items-center justify-center text-white text-[13px] gap-[6px]"
                    >
                      <div className="size-[14px] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
                      </div>
                      <span className="font-sans font-normal leading-[1]">Search</span>
                    </div>

                    {/* Reset button */}
                    <div
                      onClick={handleResetFilters}
                      className="bg-[#f2f3f5] hover:bg-gray-250 h-[32px] relative rounded-[4px] shrink-0 flex-1 xl:flex-initial xl:w-full cursor-pointer flex items-center justify-center text-[#4e5969] text-[13px] gap-[6px]"
                    >
                      <div className="size-[14px] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw w-4 h-4" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>
                      </div>
                      <span className="font-sans font-normal leading-[1]">Reset</span>
                    </div>

                    {/* Collapse/Expand button */}
                    <div
                      onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                      className="bg-white hover:bg-gray-50 border border-[#e5e6eb] h-[32px] relative rounded-[4px] shrink-0 flex-1 xl:flex-initial xl:w-full cursor-pointer flex items-center justify-center text-[#4e5969] text-[13px] gap-[8px]"
                    >
                      <span className="font-sans font-normal leading-[1]">{isFiltersCollapsed ? 'Expand' : 'Collapse'}</span>
                      <div className={`size-[12px] flex items-center justify-center transition-transform ${isFiltersCollapsed ? '' : 'rotate-180'}`}>
                        <svg className="block size-full" fill="none" viewBox="0 0 12 12">
                          <path d={svgPaths.p36c0b82} fill="#4E5969" />
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* RENDER BODY CONTENT CONDITIONALLY BY TAB */}
              {activeTab === 'comparative' ? (
                <ComparativeView />
              ) : activeTab === 'self_service' ? (
                <SelfServiceView />
              ) : activeTab === 'core_kpi' ? (
                <CoreKPIDashboard />
              ) : (
                <>
                  {/* SINGLE SKU TABS */}
                  <div className="bg-white sticky top-[36px] z-30 border-b border-[#e5e6eb] h-[38px] flex items-end mb-[20px]">
                    <div className="flex gap-[32px] items-center h-full">
                      {[
                        { id: 'metrics_sec', label: t('Key Metrics') },
                        { id: 'issues_sec', label: t('Issue Types') },
                        { id: 'potential_sec', label: t('Potential Requirements') },
                        { id: 'concern_sec', label: t('User Priorities') },
                        { id: 'scenario_sec', label: t('Usage Scenarios') }
                      ].map((sec) => (
                        <div 
                          key={sec.id}
                          onClick={() => {
                            setActiveSKUTab(sec.id);
                            const el = document.getElementById(sec.id);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className="bg-white relative shrink-0 cursor-pointer h-full flex flex-col justify-center"
                        >
                          <div className={`content-stretch flex items-center relative shrink-0 transition-colors pb-[5px] pt-[5px] ${
                            activeSKUTab === sec.id ? 'text-[#00aaa6]' : 'text-[#4e5969] hover:text-gray-900'
                          }`}>
                            <div className={`[word-break:break-word] flex flex-col justify-center leading-[0] relative shrink-0 text-[14px] whitespace-nowrap ${
                              activeSKUTab === sec.id ? 'font-medium' : 'font-normal'
                            }`}>
                              <p className="leading-[22px]">{sec.label}</p>
                            </div>
                          </div>
                          {activeSKUTab === sec.id && (
                            <div className="bg-[#00aaa6] h-[2px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 2: KEY METRICS 4-CARDS (区块2：Key Metrics 4等分指标卡片) */}
                  <div id="metrics_sec" className="scroll-mt-[100px]">
                  <section id="metrics_cards_grid" className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4">
                {metrics.map((card) => {
                  let statusBg = '';
                  let statusText = '';
                  let ArrowIcon: any = HelpCircle;

                  if (card.changeType === 'up') {
                    statusBg = 'bg-[#FFECE8]';
                    statusText = 'text-[#F53F3F]';
                    ArrowIcon = TrendingUp;
                  } else if (card.changeType === 'down') {
                    statusBg = 'bg-[#E5F6F6]';
                    statusText = 'text-[#00AAA6]';
                    ArrowIcon = TrendingDown;
                  } else {
                    statusBg = 'bg-gray-100';
                    statusText = 'text-gray-500';
                    ArrowIcon = ChevronRight;
                  }

                  let sourceIcon: any = MessageSquare;
                  let iconBg = 'bg-[#E5F6F6] text-[#00AAA6]';
                  if (card.id === 'total') {
                    sourceIcon = Globe;
                    iconBg = 'bg-[#E5F9FF] text-[#00AAA6]';
                  } else if (card.id === 'ecommerce') {
                    sourceIcon = ShoppingBag;
                    iconBg = 'bg-[#E5F6F6] text-[#00AAA6]';
                  } else if (card.id === 'social') {
                    sourceIcon = MessageSquare;
                    iconBg = 'bg-violet-50 text-violet-600';
                  } else if (card.id === 'internal') {
                    sourceIcon = HardDrive;
                    iconBg = 'bg-stone-100 text-stone-600';
                  }

                  return (
                    <div
                      key={card.id}
                      className="relative rounded-lg p-5 border select-none transition-all duration-200 overflow-hidden"
                      style={{
                        background: 'linear-gradient(100deg, #EFFEFF 100%, #E5F9FF 0%)',
                        borderColor: '#D7F8FF',
                        borderRadius: '6px'
                      }}
                    >
                      {/* Top icon and metadata */}
                      <div className="flex justify-between items-start">
                        <span className="text-gray-500 text-xs font-semibold tracking-tight">{t(card.title)}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
                          {React.createElement(sourceIcon, { size: 16 })}
                        </div>
                      </div>

                      {/* Giant Number representation */}
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-[#1F2937] tracking-tight">{card.value}</span>
                        
                        {/* Ring ratio indicator bubble */}
                        <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold ${statusBg} ${statusText}`}>
                          <ArrowIcon size={12} />
                          <span>{card.changeValue}</span>
                        </div>
                      </div>

                      {/* Tiny feedback on click function */}
                      <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                        <span>MoM Compare</span>
                      </div>
                    </div>
                  );
                })}
              </section>
              </div>

              {/* SECTION 3: TOP 100 PRODUCT ISSUES TABLE (区块3：Top 100 Product Issues 产品问题TOP100表格) */}
              <div id="issues_sec" className="scroll-mt-[100px] mb-10">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Top 100 Product Issues</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <input
                      placeholder="Search what you want to know"
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-full text-sm outline-none"
                      type="text"
                      value={productIssueSearch}
                      onChange={(e) => setProductIssueSearch(e.target.value)}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs cursor-pointer select-none"
                      onClick={() => setProductIssueSearch('')}
                    >
                      ×
                    </span>
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 gap-[8px]">
                    <div className="bg-[#f7f8fa] relative rounded-[4px] shrink-0">
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex gap-[3px] items-center p-[3px] relative size-full">
                          <button
                            onClick={() => setProductIssueTier('LV3')}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              productIssueTier === 'LV3'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            LV3
                          </button>
                          <button
                            onClick={() => setProductIssueTier('LV4')}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              productIssueTier === 'LV4'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            LV4
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#f7f8fa] relative rounded-[4px] shrink-0">
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex gap-[3px] items-center p-[3px] relative size-full">
                          <button
                            onClick={() => setProductIssueMode('Ranking')}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              productIssueMode === 'Ranking'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            Ranking List
                          </button>
                          <button
                            onClick={() => {
                              setProductIssueMode('Surge');
                            }}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              productIssueMode === 'Surge'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            Surge Chart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <TableCategoryTabs 
                  categories={[
                    'All Categories',
                    'Brand Awareness',
                    'Purchase Interaction',
                    'Logistics & Delivery',
                    'Returns & Exchanges',
                    'Installation & Commissioning',
                    'Product Application',
                    'Maintenance',
                    'Repurchase & Replacement'
                  ]}
                  activeCategory={activeIssuesTag}
                  onSelectCategory={(cat) => {
                    setActiveIssuesTag(cat);
                    setSelectedSKUCategory(cat);
                    setActiveReqTag(cat);
                    setSelectedL1Concern(cat === 'All Categories' ? null : cat);
                  }}
                />
                <div className="w-full text-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
                  <div className="overflow-x-auto -mx-3 md:mx-0">
                  <div className="grid grid-cols-[50px_1fr_2fr_150px_100px_80px] py-3 bg-gray-50 text-gray-600 font-medium border-b border-gray-200 min-w-[700px]">
                    <div className="pl-4">No.</div>
                    <div>Issue Type</div>
                    <div>Detailed Description</div>
                    <div>Percentage</div>
                    <div>MoM Change</div>
                    <div>Operation</div>
                  </div>
                  {filteredProductIssues.map((row) => (
                    <div
                      key={row.no}
                      className="grid grid-cols-[50px_1fr_2fr_150px_100px_80px] py-4 border-b border-gray-100 hover:bg-gray-50/50 items-center text-xs min-w-[700px]"
                    >
                      <div className="pl-4 text-gray-500">{row.no}</div>
                      <div className="text-gray-800 pr-4 font-normal">{row.issueType}</div>
                      <div className="text-gray-600 pr-4 line-clamp-2 leading-relaxed">{row.description}</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${row.percentage}%` }}></div>
                        </div>
                        <span className="text-gray-600 text-xs font-mono">{row.percentage.toFixed(1)}%({row.sampleCount})</span>
                      </div>
                      <div className={`text-xs flex items-center font-mono ${row.isUp !== false ? 'text-red-500' : 'text-gray-600'}`}>
                        {row.momChange}
                        {row.isUp !== false ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-3 h-3 ml-0.5" aria-hidden="true">
                            <path d="M7 7h10v10"></path>
                            <path d="M7 17 17 7"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-right w-3 h-3 ml-0.5 text-blue-500" aria-hidden="true">
                            <path d="m7 7 10 10"></path>
                            <path d="M17 7v10H7"></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            triggerReviewPopup(row.no, 'product_issue', row.issueType);
                          }}
                          className="text-teal-600 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                  {filteredProductIssues.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      No matching product issues found. Try widening your filters.
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {/* SECTION 4: TOP 100 POTENTIAL REQUIREMENTS TABLE (区块4：Top 100 Potential Requirements 潜在需求TOP100表格) */}
              <div id="potential_sec" className="scroll-mt-[100px] mb-10">
                <h2 className="text-lg font-bold text-gray-800 mb-4 mt-[20px]">Top 100 Potential Requirements</h2>
                <TableCategoryTabs 
                  categories={[
                    'All Categories',
                    'Brand Awareness',
                    'Purchase Interaction',
                    'Logistics & Delivery',
                    'Returns & Exchanges',
                    'Installation & Commissioning',
                    'Product Application',
                    'Maintenance',
                    'Repurchase & Replacement'
                  ]}
                  activeCategory={activeReqTag}
                  onSelectCategory={(cat) => {
                    setActiveReqTag(cat);
                    setSelectedSKUCategory(cat);
                    setActiveIssuesTag(cat);
                    setSelectedL1Concern(cat === 'All Categories' ? null : cat);
                  }}
                />
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <input
                      placeholder="Search what you want to know"
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm outline-none"
                      type="text"
                      value={potentialReqSearch}
                      onChange={(e) => setPotentialReqSearch(e.target.value)}
                    />
                    {potentialReqSearch && (
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs cursor-pointer select-none"
                        onClick={() => setPotentialReqSearch('')}
                      >
                        ×
                      </span>
                    )}
                  </div>
                  <div className="content-stretch flex items-center relative shrink-0 gap-[8px]">
                    <div className="bg-[#f7f8fa] relative rounded-[4px] shrink-0">
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex gap-[3px] items-center p-[3px] relative size-full">
                          <button
                            onClick={() => setPotentialReqTier('LV3')}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              potentialReqTier === 'LV3'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            LV3
                          </button>
                          <button
                            onClick={() => setPotentialReqTier('LV4')}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              potentialReqTier === 'LV4'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            LV4
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#f7f8fa] relative rounded-[4px] shrink-0">
                      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                        <div className="content-stretch flex gap-[3px] items-center p-[3px] relative size-full">
                          <button
                            onClick={() => setPotentialReqMode('Ranking')}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              potentialReqMode === 'Ranking'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            Ranking List
                          </button>
                          <button
                            onClick={() => {
                              setPotentialReqMode('Surge');
                            }}
                            className={`flex flex-col items-center justify-center relative size-full px-[12px] py-[2px] rounded-[2px] whitespace-nowrap text-[13px] transition-all ${
                              potentialReqMode === 'Surge'
                                ? 'bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.07),0px_0.5px_1px_0px_rgba(0,0,0,0.05),0px_0px_0px_0.5px_rgba(213,219,227,0.7)] text-[#00aaa6] font-medium'
                                : 'text-[#4e5969] font-normal hover:text-gray-900'
                            }`}
                          >
                            Surge Chart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full text-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
                  <div className="overflow-x-auto -mx-3 md:mx-0">
                  <div className="grid grid-cols-[50px_1fr_2fr_150px_100px_80px] py-3 bg-gray-50 text-gray-600 font-medium border-b border-gray-200 min-w-[700px]">
                    <div className="pl-4">No.</div>
                    <div>Issue Type</div>
                    <div>Detailed Description</div>
                    <div>Percentage</div>
                    <div>MoM Change</div>
                    <div>Operation</div>
                  </div>
                  {filteredPotentialReqs.map((row) => (
                    <div
                      key={row.no}
                      className="grid grid-cols-[50px_1fr_2fr_150px_100px_80px] py-4 border-b border-gray-100 hover:bg-gray-50/50 items-center text-xs min-w-[700px]"
                    >
                      <div className="pl-4 text-gray-500">{row.no}</div>
                      <div className="text-gray-800 pr-4 font-normal">{row.issueType}</div>
                      <div className="text-gray-600 pr-4 line-clamp-2 leading-relaxed">{row.description}</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${row.percentage * 8}%` }}></div>
                        </div>
                        <span className="text-gray-600 text-xs font-mono">{row.percentage.toFixed(1)}%({row.sampleCount})</span>
                      </div>
                      <div className="text-xs text-gray-600 flex items-center font-mono">
                        {row.momChange}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right w-3 h-3 ml-0.5 text-red-500" aria-hidden="true">
                          <path d="M7 7h10v10"></path>
                          <path d="M7 17 17 7"></path>
                        </svg>
                      </div>
                      <div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            triggerReviewPopup(row.no, 'potential_requirement', row.issueType);
                          }}
                          className="text-teal-600 hover:underline font-medium"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                  {filteredPotentialReqs.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      No matching requirements found. Try widening your filters.
                    </div>
                  )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: USER CONCERN CHART AND TABLES (区块5：User Concern 用户诉求分层图表区) */}
              <section id="concern_sec" className="scroll-mt-[100px] space-y-6">
                
                <div className="mb-[16px]">
                  <div className="[word-break:break-word] content-stretch flex gap-[8px] items-center relative size-full whitespace-nowrap">
                    <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[26px] relative shrink-0 text-[#1d2129] text-[18px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                      User Concern
                    </p>
                    <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[#4e5969] text-[14px]" style={{ fontVariationSettings: '"wdth" 100' }}>
                      Select the primary concern to trigger linked switching of secondary, tertiary and quaternary concerns.
                    </p>
                  </div>
                </div>

                {/* Sub-block 1: Lv1 Concern (横向情感条形图) */}
                <ConcernBarChart
                  title="Lv1 Concern"
                  data={lv1Concerns}
                  selectedItem={selectedL1Concern}
                  onItemClick={(name) => {
                    const nextVal = selectedL1Concern === name ? null : name;
                    setSelectedL1Concern(nextVal);
                    setSelectedL2Concern(null);
                    setSelectedL3Concern(null);
                    triggerNotification(nextVal ? `Linked filter by: ${name}` : 'Reset concern filter.');
                  }}
                  ticks={['0%', '20%', '40%', '60%', '80%', '100%']}
                />

                {/* Sub-block 2: Lv2 & Lv3 Concerns Dual Columns (左右双栏并列) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Left Column: Lv2 Concern */}
                  <ConcernBarChart
                    title="Lv2 Concern"
                    data={activeLv2Concerns}
                    selectedItem={selectedL2Concern}
                    onItemClick={(name) => {
                      const nextVal = selectedL2Concern === name ? null : name;
                      setSelectedL2Concern(nextVal);
                      setSelectedL3Concern(null);
                      triggerNotification(nextVal ? `Lv2 filter set to: ${name}` : 'Reset Lv2 filter.');
                    }}
                    ticks={['0%', '20%', '40%', '60%', '80%', '100%']}
                  />

                  {/* Right Column: Lv3 Concern */}
                  <ConcernBarChart
                    title="Lv3 Concern"
                    data={activeLv3Concerns}
                    selectedItem={selectedL3Concern}
                    onItemClick={(name) => {
                      const nextVal = selectedL3Concern === name ? null : name;
                      setSelectedL3Concern(nextVal);
                      triggerNotification(nextVal ? `Lv3 filter set to: ${name}` : 'Reset Lv3 filter.');
                    }}
                    ticks={['0%', '20%', '40%', '60%', '80%', '100%']}
                  />
                </div>

                {/* Sub-block 3: Lv4 Concern Table (Lv4四级细分诉求表格) */}
                <div className="bg-white rounded-[4px] border border-[#e5e6eb] shadow-xs overflow-hidden">
                  <div className="px-[20px] py-[16px] border-b border-[#e5e6eb] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gray-50/50">
                    <div className="flex items-center gap-[8px]">
                      <Layers size={16} className="text-[#00AAA6]" />
                      <p className="font-sans font-medium text-[#1d2129] text-[16px]">Lv4 Concern</p>
                    </div>

                    {/* Filter and search bar */}
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2 text-[#86909c]" size={14} />
                        <input
                          type="text"
                          value={lv4Search}
                          onChange={(e) => setLv4Search(e.target.value)}
                          placeholder="Search Lv4 sub-concerns..."
                          className="bg-white border border-[#e5e6eb] rounded-[4px] pl-8 pr-3 py-1.5 text-[13px] text-[#1d2129] focus:ring-1 focus:ring-[#00AAA6] w-56 focus:outline-none"
                        />
                      </div>
                      
                      {(selectedL1Concern || selectedL2Concern || selectedL3Concern) && (
                        <button
                          onClick={() => {
                            setSelectedL1Concern(null);
                            setSelectedL2Concern(null);
                            setSelectedL3Concern(null);
                            triggerNotification('Cleared all drill-down filters.');
                          }}
                          className="bg-[#f2f3f5] hover:bg-[#e5e6eb] text-[#4e5969] text-[12px] font-medium px-3 py-1.5 rounded-[4px] inline-flex items-center gap-1.5 cursor-pointer transition-colors border border-gray-200"
                        >
                          <span>Clear Filters ({[selectedL1Concern, selectedL2Concern, selectedL3Concern].filter(Boolean).join(' → ')})</span>
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[640px] -mx-3 md:mx-0">
                    <table className="w-full text-left text-xs border-collapse min-w-[900px] md:min-w-0">
                      <thead className="bg-[#f7f8fa] text-[#1d2129] font-medium sticky top-0 z-10">
                        <tr className="border-b border-[#e5e6eb]">
                          <th className="p-3 w-12 text-center text-[#1d2129] font-medium text-[13px]">No.</th>
                          <th className="p-3 w-64 text-[#1d2129] font-medium text-[13px] relative select-none">
                            <div className="flex items-center gap-1.5">
                              <span>Lv4 Concern</span>
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSentimentMenuOpen(!sentimentMenuOpen);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer focus:outline-none transition-colors inline-flex items-center"
                                  title="Filter sentiment"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={selectedSentiments.length === 1 ? "text-[#00AAA6]" : "text-gray-400"}>
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                                  </svg>
                                </button>
                                
                                {sentimentMenuOpen && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-30" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSentimentMenuOpen(false);
                                      }} 
                                    />
                                    <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40 focus:outline-none py-1.5 px-2.5 normal-case font-normal text-left">
                                      <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider px-1 pb-1 mb-1 border-b border-gray-100">
                                        Filter Sentiment
                                      </div>
                                      <label className="flex items-center gap-2 py-1.5 px-1 hover:bg-slate-50 rounded cursor-pointer text-xs font-normal text-[#1d2129]">
                                        <input
                                          type="checkbox"
                                          checked={selectedSentiments.includes('Positive Sentiment')}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedSentiments([...selectedSentiments, 'Positive Sentiment']);
                                            } else {
                                              if (selectedSentiments.includes('Negative Sentiment')) {
                                                setSelectedSentiments(selectedSentiments.filter(s => s !== 'Positive Sentiment'));
                                              }
                                            }
                                          }}
                                          className="rounded border-[#e5e6eb] text-[#00AAA6] focus:ring-[#00AAA6] size-3.5"
                                        />
                                        <div className="flex items-center gap-1.5 flex-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#F53F3F]"></span>
                                          <span>Positive Sentiment</span>
                                        </div>
                                      </label>
                                      <label className="flex items-center gap-2 py-1.5 px-1 hover:bg-slate-50 rounded cursor-pointer text-xs font-normal text-[#1d2129]">
                                        <input
                                          type="checkbox"
                                          checked={selectedSentiments.includes('Negative Sentiment')}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSelectedSentiments([...selectedSentiments, 'Negative Sentiment']);
                                            } else {
                                              if (selectedSentiments.includes('Positive Sentiment')) {
                                                setSelectedSentiments(selectedSentiments.filter(s => s !== 'Negative Sentiment'));
                                              }
                                            }
                                          }}
                                          className="rounded border-[#e5e6eb] text-[#00AAA6] focus:ring-[#00AAA6] size-3.5"
                                        />
                                        <div className="flex items-center gap-1.5 flex-1">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#4080FF]"></span>
                                          <span>Negative Sentiment</span>
                                        </div>
                                      </label>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </th>
                          <th className="p-3 min-w-[300px] text-[#1d2129] font-medium text-[13px]">Issue Type</th>
                          <th className="p-3 w-52 text-[#1d2129] font-medium text-[13px]">Percentage</th>
                          {showMomChangeColumn && <th className="p-3 w-28 text-[#1d2129] font-medium text-[13px]">MoM Change</th>}
                          <th className="p-3 w-24 text-center text-[#1d2129] font-medium text-[13px]">Operation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e6eb]">
                        {filteredLv4Concerns.map((row, idx) => (
                          <tr
                            key={row.no}
                            className={`hover:bg-gray-50/50 transition-colors ${idx % 2 === 1 ? 'bg-[#fafbfc]' : 'bg-white'}`}
                          >
                            <td className="p-3 font-mono text-center text-gray-400">{idx + 1}</td>
                            <td className="p-3 text-[13px] text-[#1d2129] font-medium">
                              <div className="flex items-center gap-2">
                                <span 
                                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                                  style={{ backgroundColor: row.sentiment === 'Positive Sentiment' ? '#F53F3F' : '#4080FF' }}
                                />
                                <span className="text-[#1d2129] font-sans font-semibold">{row.lv4Name}</span>
                              </div>
                            </td>
                            <td className="p-3 leading-relaxed font-normal text-[#4e5969] text-[13px]">
                              {row.issueType}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-[8px]">
                                <div className="bg-[#f2f3f5] h-[4px] relative rounded-[20px] shrink-0 w-[80px]">
                                  <div
                                    style={{ width: `${Math.min(row.percentage * 8, 80)}px` }}
                                    className="absolute bg-[#00aaa6] h-[4px] left-0 rounded-[20px] top-0"
                                  />
                                </div>
                                <p className="font-sans font-normal text-[#1d2129] text-[13px] whitespace-nowrap">
                                  {row.percentage}% <span className="text-gray-400 text-[11px]">({row.sampleCount})</span>
                                </p>
                              </div>
                            </td>
                            {showMomChangeColumn && (
                              <td className="p-3 text-[13px]">
                                <div className={`flex items-center gap-1 font-semibold ${row.isUp !== false ? 'text-[#F76560]' : 'text-[#165DFF]'}`}>
                                  {row.isUp !== false ? (
                                    <svg className="size-[12px]" fill="none" viewBox="0 0 12 9">
                                      <path clipRule="evenodd" d="M 6,1.5 L 11,8 L 1,8 Z" fill="#F76560" fillRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="size-[12px]" fill="none" viewBox="0 0 12 9">
                                      <path clipRule="evenodd" d="M 6,7.5 L 11,1 L 1,1 Z" fill="#165DFF" fillRule="evenodd" />
                                    </svg>
                                  )}
                                  <span>{row.momChange}</span>
                                </div>
                              </td>
                            )}
                            <td className="p-3 text-center">
                              <button
                                onClick={() => triggerReviewPopup(row.no, 'lv4_concern', row.lv4Name)}
                                className="text-[#00AAA6] font-medium text-[13px] inline-flex items-center gap-0.5 bg-[#E5F6F6] hover:bg-[#d5eeee] px-3 py-1 rounded-[2px] cursor-pointer transition-colors"
                              >
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* SECTION 6: USER USAGE SCENARIOS VISUALIZATIONS (区块6：User Usage Scenario 使用场景可视化图表区) */}
              <section id="scenario_sec" className="scroll-mt-[100px] space-y-6">
                
                <div className="content-stretch flex items-center relative size-full mb-4">
                  <p className="[word-break:break-word] font-['Roboto:Medium',sans-serif] font-medium leading-[26px] relative shrink-0 text-[#1d2129] text-[18px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
                    {t('User Usage Scenario')}
                  </p>
                </div>

                {/* ROW 1: Usage scenario + Placement location + Installation method */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  
                  {/* Vertical bar: Usage Scenario */}
                  <div className="bg-white rounded-lg p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Usage Scenario</h4>
                      
                      <div className="space-y-2.5">
                        {usageScenarioData.map((item) => {
                          const isTarget = selectedScenarioFilter === item.name;
                          return (
                            <div
                              key={item.name}
                              onClick={() => {
                                setSelectedScenarioFilter(selectedScenarioFilter === item.name ? null : item.name);
                                triggerNotification(selectedScenarioFilter === item.name ? 'Reset scenario filter.' : `Filtering by: ${item.name}`);
                              }}
                              className={`flex items-center gap-2 group cursor-pointer p-0.5 rounded ${isTarget ? 'bg-[#E5F6F6]' : 'hover:bg-slate-50'}`}
                            >
                              <span className="w-24 text-[11px] font-semibold text-gray-600 truncate">{item.name}</span>
                              <div className="flex-grow bg-[#E6F7FF] rounded-sm h-6 overflow-hidden relative">
                                <div
                                  style={{ width: `${item.percentage}%` }}
                                  className="bg-[#00AAA6] h-full rounded-sm transition-all duration-300 hover:opacity-90"
                                ></div>
                              </div>
                              <span className="w-10 text-[11px] font-bold text-gray-700 text-right">{item.percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between text-[11px] text-[#8C8C8C]">
                      <span>Click bar to lock filter link</span>
                      <span>Scale indices: 0 - 180</span>
                    </div>
                  </div>

                  {/* Vertical bar: Placement Location */}
                  <div className="bg-white rounded-lg p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Placement Location</h4>
                      
                      <div className="space-y-3.5">
                        {placementLocationData.map((item) => {
                          const isTarget = selectedPlacementFilter === item.name;
                          return (
                            <div
                              key={item.name}
                              onClick={() => {
                                setSelectedPlacementFilter(selectedPlacementFilter === item.name ? null : item.name);
                                triggerNotification(selectedPlacementFilter === item.name ? 'Reset placement filter.' : `Filtering by: ${item.name}`);
                              }}
                              className={`flex items-center gap-2 group cursor-pointer p-0.5 rounded ${isTarget ? 'bg-[#E5F6F6]' : 'hover:bg-slate-50'}`}
                            >
                              <span className="w-24 text-[11px] font-semibold text-gray-600 truncate">{item.name}</span>
                              <div className="flex-grow bg-[#E6F7FF] rounded-sm h-6 overflow-hidden relative">
                                <div
                                  style={{ width: `${item.percentage}%` }}
                                  className="bg-[#00AAA6] h-full rounded-sm transition-all duration-300"
                                ></div>
                              </div>
                              <span className="w-10 text-[11px] font-bold text-gray-700 text-right">{item.percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-5 flex justify-between text-[11px] text-[#8C8C8C]">
                      <span>Primary TV environment placements</span>
                      <span>0 - 180 Index</span>
                    </div>
                  </div>

                  {/* Circular Pie/Donut: Installation Method (multi-color circular chart) */}
                  <div className="bg-white rounded-lg p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Installation Method</h4>
                      
                      {/* Donut Draw representation using SVG paths */}
                      <div className="flex justify-center items-center py-4 relative">
                        <svg width="180" height="180" viewBox="0 0 100 100" className="transform -rotate-90">
                          {/* We draw the sectors dynamically according to pieSectors list */}
                          {(() => {
                            let accumulatedPercent = 0;
                            return pieSectors.map((sector) => {
                              const percent = (sector.value / totalPieValue) * 100;
                              
                              // Calculate polar coords
                              const startAngle = (accumulatedPercent / 100) * 360;
                              const endAngle = ((accumulatedPercent + percent) / 100) * 360;
                              accumulatedPercent += percent;

                              // SVG arc calculation constants for point outputs
                              const x1 = 50 + 35 * Math.cos((startAngle * Math.PI) / 180);
                              const y1 = 50 + 35 * Math.sin((startAngle * Math.PI) / 180);
                              const x2 = 50 + 35 * Math.cos((endAngle * Math.PI) / 180);
                              const y2 = 50 + 35 * Math.sin((endAngle * Math.PI) / 180);

                              const largeArcFlag = percent > 50 ? 1 : 0;

                              return (
                                <path
                                  key={sector.name}
                                  d={`M ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`}
                                  fill="none"
                                  stroke={sector.color}
                                  strokeWidth="10"
                                  className="transition-all duration-300 hover:stroke-[13] cursor-pointer"
                                  title={`${sector.name}: ${sector.value}%`}
                                />
                              );
                            });
                          })()}
                          <circle cx="50" cy="50" r="28" fill="#FFFFFF" />
                        </svg>

                        {/* Middle text overlay */}
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider">Method</span>
                          <span className="text-sm font-extrabold text-[#1F2937]">Profile</span>
                        </div>
                      </div>

                      {/* Interactive Legend block to hide/reveal */}
                      <div className="space-y-1.5 mt-2">
                        <p className="text-[10px] text-[#8C8C8C] mb-1 text-center">Click labels to hide/show sectors</p>
                        
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          {[
                            { name: 'Recessed Wall Mount', color: '#0D8582', valStr: '35.5%' },
                            { name: 'Demo Display & Teardown', color: '#00AAA6', valStr: '20.0%' },
                            { name: 'Standard Wall Mount', color: '#F76560', valStr: '16.5%' },
                            { name: 'Non-Recessed Wall Mount', color: '#33D1CC', valStr: '11.6%' },
                            { name: 'Tabletop/Stand Mount', color: '#FF7D00', valStr: '6.9%' },
                            { name: 'Other Methods', color: '#8C8C8C', valStr: '9.5%' }
                          ].map((item) => {
                            const isHidden = hiddenInstallationSectors.includes(item.name);
                            return (
                              <div
                                key={item.name}
                                onClick={() => handleToggleInstallationSector(item.name)}
                                className={`flex items-center gap-1 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors ${
                                  isHidden ? 'opacity-30 line-through' : ''
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                                <span className="truncate flex-grow text-[#666666]">{item.name}</span>
                                <span className="font-bold text-gray-800 shrink-0">{item.valStr}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 2: External Device Connected + External Device Name */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  
                  {/* Left block: External Device Connected (Doughnut with center % text) */}
                  <div className="bg-white rounded-lg p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">External Device Connected</h4>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
                        
                        {/* Concentric Doughnut Progress chart (using SVG strokeDasharray) */}
                        <div className="relative w-44 h-44 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Empty track */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E6F7FF" strokeWidth="8" />
                            {/* Filled active tracking arc */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="transparent"
                              stroke="#00AAA6"
                              strokeWidth="8"
                              strokeDasharray="251.2"
                              strokeDashoffset={251.2 * (1 - 0.62)} // 62.0%
                            />
                          </svg>

                          {/* Center Text overlays */}
                          <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-extrabold text-[#1F2937] tracking-tight">62.0%</span>
                            <span className="text-[9px] text-[#8C8C8C] uppercase font-semibold max-w-[90px] leading-tight">
                              No Devices Connected
                            </span>
                          </div>
                        </div>

                        {/* Context data list */}
                        <div className="space-y-4 text-xs">
                          <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100">
                            <p className="text-[#8C8C8C] text-[10px]">Total Sample Size</p>
                            <p className="text-lg font-bold text-gray-800">5,827 units</p>
                          </div>
                          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                            <p className="text-[#8C8C8C] text-[10px]">Connected Interface Devices</p>
                            <p className="text-lg font-bold text-gray-800">2,214 units</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-4 text-[11px] text-[#8C8C8C] flex justify-between">
                      <span className="font-semibold text-[#00AAA6]">Primary Audio/Video connection states</span>
                      <span>Confidence score: 99.4%</span>
                    </div>
                  </div>

                  {/* Right block: External Device Name (Horizontal bar chart) */}
                  <div className="bg-white rounded-lg p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">External Device Name</h4>
                      
                      <div className="space-y-4 py-2">
                        {externalDeviceNameData.map((item) => (
                          <div key={item.name} className="space-y-1 text-xs">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-semibold text-gray-700">{item.name}</span>
                              <span className="font-medium text-gray-500">{item.percentage}%</span>
                            </div>
                            <div className="w-full bg-[#E6F7FF] rounded-full h-2.5 overflow-hidden">
                              <div
                                style={{ width: `${item.percentage}%` }}
                                className="bg-[#00AAA6] h-full rounded-full transition-all duration-300"
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between text-[11px] text-[#8C8C8C]">
                      <span>Source: Automated HDMI EDID Query logs</span>
                      <span>Scale count: 0 ~ 6</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* FOOTER METRICS INFO AND COMPLIANCE */}
              <footer className="text-center text-xs text-[#8C8C8C] pt-12 pb-6 border-t border-[#E5E7EB] space-y-2">
                <p>VocInsight BI 用户声量分析平台 — Single SKU Analysis (100% High Fidelity Page Layout)</p>
                <div className="flex justify-center gap-4 text-[11px]">
                  <span>Environment Instance Check: Standard Sandbox</span>
                  <span>|</span>
                  <span>Contact support for raw database export</span>
                  <span>|</span>
                  <span>Port Ingress Inquire</span>
                </div>
              </footer>
            </>
          )}
        </main>
      </div>

    </div> {/* closes Main body wrapper layout */}

      {/* ====== MOBILE BOTTOM TAB NAVIGATION ====== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e6eb] flex items-stretch z-50 safe-bottom">
        {[
          { key: 'single_sku', label: t('Single SKU Analysis'), icon: '🔍' },
          { key: 'comparative', label: t('Comparative Analysis'), icon: '⚖️' },
          { key: 'self_service', label: t('Self-service analytics'), icon: '🤖' },
          { key: 'core_kpi', label: t('Core KPI Dashboard'), icon: '📊' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActiveTab(item.key as any);
              if (item.key === 'single_sku') setActiveMenu('Single SKU Analysis');
              else if (item.key === 'comparative') setActiveMenu('Comparative Analysis');
              else if (item.key === 'self_service') setActiveMenu('Self-service analytics');
              else setActiveMenu('Core KPI Dashboard');
              if (!openTabs.includes(item.key as any)) {
                setOpenTabs(prev => [...prev, item.key as any]);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 text-[10px] font-medium transition-colors ${
              activeTab === item.key ? 'text-[#00aaa6]' : 'text-[#86909c]'
            }`}
          >
            <span className="text-lg leading-none mb-0.5">{item.icon}</span>
            <span className="truncate max-w-full leading-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-16" />

      {/* REACTION POPUP DIALOG MODAL (弹窗规范: 居中模态弹窗，带遮罩层、右上角关闭按钮，展示用户原始评论明细) */}
      <AnimatePresence>
        {dialogOpen && selectedReviewPopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            
            {/* Backdrop Shading overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDialogOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            ></motion.div>

            {/* Main Modal body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-xl w-full overflow-hidden relative z-10 flex flex-col"
            >
              
              {/* Header block color */}
              <div className="bg-slate-50 border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00AAA6]"></span>
                  <p className="font-bold text-[#1F2937] text-sm">Raw User Comment Detail</p>
                </div>
                
                {/* Close Button top-right */}
                <button
                  onClick={() => setDialogOpen(false)}
                  className="text-gray-400 hover:text-gray-700 bg-white shadow-xs hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Inner details */}
              <div className="p-6 space-y-4 text-xs text-[#333333]">
                
                {/* Key metadata badges line */}
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-wider">User Account / Profile</label>
                    <p className="font-semibold text-gray-800 text-xs mt-0.5">{selectedReviewPopup.user}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-400 uppercase tracking-wider">Purchase Channel / Date</label>
                    <p className="font-semibold text-gray-800 text-xs mt-0.5">{selectedReviewPopup.source} ({selectedReviewPopup.date})</p>
                  </div>
                </div>

                {/* Category classification */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <div className="bg-[#E5F6F6] text-[#00AAA6] px-2.5 py-1 rounded text-[11px] font-semibold">
                    Concern Class: {selectedReviewPopup.category}
                  </div>
                  <div className="bg-[#FFECE8] text-[#F53F3F] px-2.5 py-1 rounded text-[11px] font-semibold">
                    Sentiment: Negative Alert
                  </div>
                  <div className="bg-amber-50 text-amber-600 px-2.5 py-1 rounded text-[11px] font-semibold">
                    Rating: {selectedReviewPopup.rating} Stars
                  </div>
                </div>

                {/* Raw feedback commentary */}
                <div className="space-y-1.5 pt-2">
                  <span className="block text-[10px] text-[#8C8C8C] uppercase font-bold tracking-wider">Original Raw User Voice Speech Text:</span>
                  <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-lg text-gray-800 leading-relaxed font-medium text-xs font-serif italic">
                    "{selectedReviewPopup.commentText}"
                  </div>
                </div>

                {/* AI suggested action loop item */}
                <div className="p-3.5 bg-teal-50 border border-teal-100 rounded-lg space-y-1">
                  <p className="text-[10px] text-teal-800 font-bold uppercase tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00AAA6] animate-ping"></span>
                    VOC-Insight Action Engine Proposal
                  </p>
                  <p className="text-teal-900 leading-relaxed scale-95 origin-left">
                    Automatically tag this ticket and route to Hisense Service Team US for priority bracket customization on model series U7K-100. Resolve callback resolution time limit within 48 hours.
                  </p>
                </div>
              </div>

              {/* Action buttons bottom footer */}
              <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => {
                    triggerNotification('Voice ticket registered successfully to ticket store.');
                    setDialogOpen(false);
                  }}
                  className="bg-[#00AAA6] hover:bg-[#009491] text-white font-semibold py-2 px-4 rounded transition-colors cursor-pointer"
                >
                  Forward to Action Loop
                </button>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-2 px-4 rounded transition-colors cursor-pointer"
                >
                  Close Detail
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
