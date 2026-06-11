/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IssueData, ConcernData, ScenarioData, CommentDetail } from './types';

// Let's seed all items from Top 100 Product Issues (first 10 items)
export const initialProductIssues: IssueData[] = [
  {
    no: 1,
    issueType: 'Sales Price Fluctuation',
    description: 'Price surges sharply; order price differs from listed price; price protection refund unavailable after price cut',
    percentage: 9.2,
    sampleCount: 258,
    momChange: '116.7%',
    isUp: true
  },
  {
    no: 2,
    issueType: 'Installation Specification',
    description: 'On-site installer lacks professional knowledge; no response from manufacturer',
    percentage: 4.3,
    sampleCount: 121,
    momChange: '27.3%',
    isUp: true
  },
  {
    no: 3,
    issueType: 'Compliance of Product, Service & Promotion Policies',
    description: 'Product price inconsistent at checkout; payment amount varies due to price fluctuation',
    percentage: 4.2,
    sampleCount: 118,
    momChange: '76.1%',
    isUp: true
  },
  {
    no: 4,
    issueType: 'Overselling',
    description: 'Delayed shipment & excessive waiting time; no shipment option on order; delayed delivery with invisible logistics tracking info',
    percentage: 4.2,
    sampleCount: 116,
    momChange: '11.5%',
    isUp: true
  },
  {
    no: 5,
    issueType: 'Accessory Issues',
    description: 'Missing lamp & wall mount accessories; mismatched high hole position on TV bracket prevents installation',
    percentage: 4.0,
    sampleCount: 111,
    momChange: '6.2%',
    isUp: true
  },
  {
    no: 6,
    issueType: 'Return Lead Time',
    description: 'Unclear refund arrival timeline; uncertainty on whether maintenance fee is refunded together with returned goods',
    percentage: 3.2,
    sampleCount: 90,
    momChange: '59.3%',
    isUp: true
  },
  {
    no: 7,
    issueType: 'Product Delivery Timeliness',
    description: 'Unspecified product schedule; unable to reach customer servic',
    percentage: 3.2,
    sampleCount: 89,
    momChange: '40.4%',
    isUp: true
  },
  {
    no: 8,
    issueType: 'Billing Policy',
    description: 'Out-of-pocket bracket requires extra payment; additional charge for bracket installation',
    percentage: 2.7,
    sampleCount: 76,
    momChange: '53.0%',
    isUp: true
  },
  {
    no: 9,
    issueType: 'National Subsidy Policy',
    description: 'National subsidy coupon fails to deduct at checkout; subsidy status marked as used without actual redemption',
    percentage: 2.5,
    sampleCount: 70,
    momChange: '470.1%',
    isUp: true
  },
  {
    no: 10,
    issueType: 'Switch Equipment Issues',
    description: 'TV powers on automatically when unattended',
    percentage: 2.4,
    sampleCount: 68,
    momChange: '180.0%',
    isUp: true
  }
];

// Let's seed all items from Top 100 Potential Requirements (first 10 items)
export const initialPotentialRequirements: IssueData[] = [
  {
    no: 1,
    issueType: 'Delivery Timeliness',
    description: 'Most users expect customizable delivery time, avoiding delivery during unfinished renovation or nighttime. Flexible delivery scheduling options are recommended',
    percentage: 9.2,
    sampleCount: 258,
    momChange: '116.7%',
    isUp: true
  },
  {
    no: 2,
    issueType: 'Sales Price Fluctuation',
    description: 'Recommended purchase price for 85-inch model is CNY 7,000-8,000; prices drop sharply by CNY 500-600 shortly after purchase, overpriced at higher rates',
    percentage: 4.3,
    sampleCount: 121,
    momChange: '27.3%',
    isUp: true
  },
  {
    no: 3,
    issueType: 'Installation Standardization',
    description: 'Is human customer service available? The installer advised me to activate warranty myself after moving in as the house was vacant temporarily during TV installation',
    percentage: 4.2,
    sampleCount: 118,
    momChange: '76.1%',
    isUp: true
  },
  {
    no: 4,
    issueType: 'Accessory Issues',
    description: 'Users report complimentary wall mounts are under-sized and unstable with falling risks; properly sized, sturdier brackets are recommended',
    percentage: 4.2,
    sampleCount: 116,
    momChange: '11.5%',
    isUp: true
  },
  {
    no: 5,
    issueType: 'Last-mile Delivery Standard',
    description: 'On-site inspection with video recording is required upon receipt, otherwise compensation claims tend to be rejected',
    percentage: 4.0,
    sampleCount: 111,
    momChange: '6.2%',
    isUp: true
  },
  {
    no: 6,
    issueType: 'Audio Quality',
    description: 'Most users are satisfied with picture and audio performance; sound effect is excellent',
    percentage: 3.2,
    sampleCount: 90,
    momChange: '59.3%',
    isUp: true
  },
  {
    no: 7,
    issueType: 'Order Modification',
    description: 'My house renovation is incomplete, please postpone delivery. No order-edit option is available on my end, request manual delivery rescheduling support',
    percentage: 3.2,
    sampleCount: 89,
    momChange: '40.4%',
    isUp: true
  },
  {
    no: 8,
    issueType: 'Size Issue',
    description: 'The TV set is too large to fit the space; request exchange for a smaller size',
    percentage: 2.7,
    sampleCount: 76,
    momChange: '53.0%',
    isUp: true
  },
  {
    no: 9,
    issueType: 'Policy Implementation',
    description: 'Collection staff notified that new TV delivery & installation is pending full return of old unit; user requests alternative arrangement',
    percentage: 2.5,
    sampleCount: 70,
    momChange: '470.1%',
    isUp: true
  },
  {
    no: 10,
    issueType: 'Platform Service',
    description: 'Excessive sagging and uneven tilt caused by flimsy supplied wall mount; user blames inadequate bracket quality',
    percentage: 2.4,
    sampleCount: 68,
    momChange: '180.0%',
    isUp: true
  }
];

// Let's seed Lv1 Concern:
export const lv1Concerns: ConcernData[] = [
  { name: 'Brand Awareness', positive: 48, negative: 42, total: 90 },
  { name: 'Purchase Interaction', positive: 35, negative: 45, total: 80 },
  { name: 'Logistics & Delivery', positive: 30, negative: 40, total: 70 },
  { name: 'Returns & Exchanges', positive: 20, negative: 35, total: 55 },
  { name: 'Installation & Commissioning', positive: 10, negative: 20, total: 30 },
  { name: 'Product Application', positive: 12, negative: 18, total: 30 },
  { name: 'Maintenance', positive: 5, negative: 15, total: 20 },
  { name: 'Repurchase & Replacement', positive: 3, negative: 7, total: 10 }
];

// Let's seed Lv2 Concerns and Lv3 concerns (which are side-by-side and have exactly same metrics in screenshots):
export const lv2Concerns: ConcernData[] = [
  { name: 'Picture Quality', positive: 60, negative: 35, total: 95 },
  { name: 'Design', positive: 40, negative: 35, total: 75 },
  { name: 'Configuration', positive: 25, negative: 30, total: 55 },
  { name: 'Software-Operating System', positive: 20, negative: 30, total: 50 },
  { name: 'Usage Scenario', positive: 15, negative: 25, total: 40 },
  { name: 'Remote_Control', positive: 10, negative: 25, total: 35 },
  { name: 'Product_Quality', positive: 18, negative: 32, total: 50 },
  { name: 'Marketing & Sales Related', positive: 15, negative: 25, total: 40 },
  { name: 'Third party Installation', positive: 8, negative: 22, total: 30 },
  { name: 'Energy_Consumption', positive: 5, negative: 15, total: 20 }
];

// Let's seed Lv4 Concern Table data (44 items with both Positive/Negative over 20 items):
export const lv4ConcernsList = [
  // Negative Sentiment (22 items)
  {
    no: 1,
    sentiment: 'Negative Sentiment',
    lv4Name: 'PQ-Colour-General',
    issueType: 'Most users expect customizable delivery time, avoiding delivery during unfinished renovation or nighttime.',
    percentage: 9.2,
    sampleCount: 258,
    momChange: '116.7%',
    isUp: true
  },
  {
    no: 2,
    sentiment: 'Negative Sentiment',
    lv4Name: 'AQ-Surround sound general',
    issueType: 'Recommended purchase price for 85-inch model is CNY 7,000-8,000; prices drop sharply shortly after purchase.',
    percentage: 4.3,
    sampleCount: 121,
    momChange: '27.3%',
    isUp: true
  },
  {
    no: 3,
    sentiment: 'Negative Sentiment',
    lv4Name: 'Dolby Atmos/Dolby Audio',
    issueType: 'Installer advised me to activate warranty myself as the house was vacant temporarily during TV installation.',
    percentage: 4.2,
    sampleCount: 118,
    momChange: '76.1%',
    isUp: true
  },
  {
    no: 4,
    sentiment: 'Negative Sentiment',
    lv4Name: 'Wall Mount/Ceiling Mount',
    issueType: 'Users report complimentary wall mounts are under-sized and unstable with falling risks.',
    percentage: 4.2,
    sampleCount: 116,
    momChange: '11.5%',
    isUp: true
  },
  {
    no: 5,
    sentiment: 'Negative Sentiment',
    lv4Name: 'DES-Cable Management',
    issueType: 'On-site inspection with video recording is required upon receipt, otherwise compensation claims are rejected.',
    percentage: 4.0,
    sampleCount: 111,
    momChange: '6.2%',
    isUp: true
  },
  {
    no: 6,
    sentiment: 'Negative Sentiment',
    lv4Name: 'Arco Design',
    issueType: 'Excessive sagging and uneven tilt caused by flimsy supplied wall mount; user blames inadequate bracket quality.',
    percentage: 3.2,
    sampleCount: 90,
    momChange: '59.3%',
    isUp: true
  },
  {
    no: 7,
    sentiment: 'Negative Sentiment',
    lv4Name: 'Arco Design',
    issueType: 'My house renovation is incomplete, please postpone delivery. Request manual delivery rescheduling support.',
    percentage: 3.2,
    sampleCount: 89,
    momChange: '40.4%',
    isUp: true
  },
  {
    no: 8,
    sentiment: 'Negative Sentiment',
    lv4Name: 'Arco Design',
    issueType: 'The TV set is too large to fit the space; request exchange for a smaller size.',
    percentage: 2.7,
    sampleCount: 76,
    momChange: '53.0%',
    isUp: true
  },
  {
    no: 9,
    sentiment: 'Negative Sentiment',
    lv4Name: 'Arco Design',
    issueType: 'Collection staff notified that new TV delivery & installation is pending full return of old unit.',
    percentage: 2.5,
    sampleCount: 70,
    momChange: '470.1%',
    isUp: true
  },
  {
    no: 10,
    sentiment: 'Negative Sentiment',
    lv4Name: 'Arco Design',
    issueType: 'Excessive setup wait times; no shipment options on peak orders; lack of visibility in logistics tracker.',
    percentage: 2.4,
    sampleCount: 68,
    momChange: '180.0%',
    isUp: true
  },
  {
    no: 11,
    sentiment: 'Negative Sentiment',
    lv4Name: 'UI-App Responsiveness',
    issueType: 'System menus lag significantly when switching input sources or booting up the preinstalled launcher.',
    percentage: 2.3,
    sampleCount: 65,
    momChange: '15.2%',
    isUp: true
  },
  {
    no: 12,
    sentiment: 'Negative Sentiment',
    lv4Name: 'OS-Software Updates',
    issueType: 'Automatic firmware update bricked the wireless card; reboot required to reconnect home network.',
    percentage: 2.1,
    sampleCount: 59,
    momChange: '34.6%',
    isUp: true
  },
  {
    no: 13,
    sentiment: 'Negative Sentiment',
    lv4Name: 'CON-Bluetooth Pairing',
    issueType: 'Headset pairing frequently disconnects when the microwave or home routers are active nearby.',
    percentage: 2.0,
    sampleCount: 55,
    momChange: '-8.5%',
    isUp: false
  },
  {
    no: 14,
    sentiment: 'Negative Sentiment',
    lv4Name: 'OS-Ads on Boot',
    issueType: 'Excessive start-up advertisements cannot be skipped, leading to a frustrating daily user experience.',
    percentage: 1.9,
    sampleCount: 52,
    momChange: '45.0%',
    isUp: true
  },
  {
    no: 15,
    sentiment: 'Negative Sentiment',
    lv4Name: 'PQ-Backlight Bleeding',
    issueType: 'Significant light leakage in dark room settings around the lower left and upper corners of the LCD panel.',
    percentage: 1.8,
    sampleCount: 50,
    momChange: '12.0%',
    isUp: true
  },
  {
    no: 16,
    sentiment: 'Negative Sentiment',
    lv4Name: 'RC-Voice Recognition',
    issueType: 'Voice assistant often fails to recognize local dialects or commands, returning generic error states.',
    percentage: 1.7,
    sampleCount: 47,
    momChange: '22.1%',
    isUp: true
  },
  {
    no: 17,
    sentiment: 'Negative Sentiment',
    lv4Name: 'CON-HDMI Handshake',
    issueType: 'Black screens occur randomly for 2-3 seconds when connected to high-end next-gen consoles at 120Hz.',
    percentage: 1.6,
    sampleCount: 44,
    momChange: '8.0%',
    isUp: true
  },
  {
    no: 18,
    sentiment: 'Negative Sentiment',
    lv4Name: 'PQ-Contrast Ratio',
    issueType: 'Washed-out colors and weak contrast when viewing highly detailed HDR content under bright environment lights.',
    percentage: 1.5,
    sampleCount: 41,
    momChange: '-3.1%',
    isUp: false
  },
  {
    no: 19,
    sentiment: 'Negative Sentiment',
    lv4Name: 'AQ-Dialogue Clarity',
    issueType: 'Human speech in action scenes is muffled by bloated low frequency effects, requiring manual equalizer shifts.',
    percentage: 1.4,
    sampleCount: 38,
    momChange: '14.0%',
    isUp: true
  },
  {
    no: 20,
    sentiment: 'Negative Sentiment',
    lv4Name: 'MKT-Price Protection',
    issueType: 'Refusal to honor price match guarantees after local holiday promotional markdown of CNY 400 within 7 days.',
    percentage: 1.3,
    sampleCount: 35,
    momChange: '120.5%',
    isUp: true
  },
  {
    no: 21,
    sentiment: 'Negative Sentiment',
    lv4Name: 'QA-Quality Standards',
    issueType: 'Small dead pixels discovered on first boot near the center grid, replacement flow was tedious.',
    percentage: 1.2,
    sampleCount: 33,
    momChange: '5.4%',
    isUp: true
  },
  {
    no: 22,
    sentiment: 'Negative Sentiment',
    lv4Name: 'CON-Audio Receiver Delay',
    issueType: 'Noticeable Lip-sync delay of up to 150ms when outputting multi-channel optical feeds to older receivers.',
    percentage: 1.0,
    sampleCount: 28,
    momChange: '-15.2%',
    isUp: false
  },

  // Positive Sentiment (22 items)
  {
    no: 23,
    sentiment: 'Positive Sentiment',
    lv4Name: 'PQ-Color Reproduction',
    issueType: 'Extremely vibrant and lifelike colors, skin tones look natural and deep black levels are truly stunning.',
    percentage: 15.4,
    sampleCount: 420,
    momChange: '45.2%',
    isUp: true
  },
  {
    no: 24,
    sentiment: 'Positive Sentiment',
    lv4Name: 'PQ-Peak Brightness',
    issueType: 'Outstanding HDR highlight performance; the screen easily combats high ambient glare in sunny living rooms.',
    percentage: 12.1,
    sampleCount: 331,
    momChange: '38.0%',
    isUp: true
  },
  {
    no: 25,
    sentiment: 'Positive Sentiment',
    lv4Name: 'AQ-Soundstage Immersion',
    issueType: 'Outstanding built-in multi-channel speaker layout; the surround sound effect mimics a secondary soundbar.',
    percentage: 11.2,
    sampleCount: 305,
    momChange: '54.1%',
    isUp: true
  },
  {
    no: 26,
    sentiment: 'Positive Sentiment',
    lv4Name: 'DES-Bezel Design',
    issueType: 'Ultra-thin bezel-less exterior design looks modern, premium, and sleek on any standard wall mounting board.',
    percentage: 10.5,
    sampleCount: 287,
    momChange: '12.4%',
    isUp: true
  },
  {
    no: 27,
    sentiment: 'Positive Sentiment',
    lv4Name: 'UI-Navigation Smoothness',
    issueType: 'Extremely buttery and responsive home navigation; apps launch instantly with no sluggish frame drops.',
    percentage: 9.8,
    sampleCount: 268,
    momChange: '19.5%',
    isUp: true
  },
  {
    no: 28,
    sentiment: 'Positive Sentiment',
    lv4Name: 'CON-Wireless Stability',
    issueType: 'Supported WiFi 6 chip offers phenomenal throughput, ensuring buffer-free streaming of true 4K HDR streams.',
    percentage: 8.9,
    sampleCount: 243,
    momChange: '6.7%',
    isUp: true
  },
  {
    no: 29,
    sentiment: 'Positive Sentiment',
    lv4Name: 'RC-Ergonomics-Premium',
    issueType: 'The physical remote control has a great weight, excellent key travel, and clear responsive backlighting.',
    percentage: 8.2,
    sampleCount: 224,
    momChange: '31.2%',
    isUp: true
  },
  {
    no: 30,
    sentiment: 'Positive Sentiment',
    lv4Name: 'INS-Installation Efficiency',
    issueType: 'Setup crew arrived exactly on time, behaved professionally, and configured wall brackets in less than 20 minutes.',
    percentage: 7.6,
    sampleCount: 208,
    momChange: '44.0%',
    isUp: true
  },
  {
    no: 31,
    sentiment: 'Positive Sentiment',
    lv4Name: 'PQ-Viewing Angles',
    issueType: 'Wide viewing angle allows clear detail and contrast retention even when seated at side angles.',
    percentage: 7.1,
    sampleCount: 194,
    momChange: '10.8%',
    isUp: true
  },
  {
    no: 32,
    sentiment: 'Positive Sentiment',
    lv4Name: 'AQ-Bass Punch',
    issueType: 'Subwoofer on the back adds highly punchy, deep bass that provides real cinematic rumbling in movie theater presets.',
    percentage: 6.8,
    sampleCount: 186,
    momChange: '25.0%',
    isUp: true
  },
  {
    no: 33,
    sentiment: 'Positive Sentiment',
    lv4Name: 'GAM-Auto Low Latency Mode',
    issueType: 'Instant response with auto game mode; input lag feels lower than professional tier gaming monitors.',
    percentage: 6.2,
    sampleCount: 169,
    momChange: '85.4%',
    isUp: true
  },
  {
    no: 34,
    sentiment: 'Positive Sentiment',
    lv4Name: 'OS-Voice Search Accuracy',
    issueType: 'The AI assistant translates commands perfectly and handles mixed bilingual vocabulary queries with high precision.',
    percentage: 5.9,
    sampleCount: 161,
    momChange: '40.2%',
    isUp: true
  },
  {
    no: 35,
    sentiment: 'Positive Sentiment',
    lv4Name: 'DES-Cable Routing',
    issueType: 'The cable organizer on the back stands and side-tracks hides all messy cords perfectly for a minimal layout.',
    percentage: 5.5,
    sampleCount: 150,
    momChange: '8.4%',
    isUp: true
  },
  {
    no: 36,
    sentiment: 'Positive Sentiment',
    lv4Name: 'MKT-Value for Money',
    issueType: 'Incredible feature density for the cost; competes with higher tier flagship displays at nearly 40% less retail.',
    percentage: 5.1,
    sampleCount: 139,
    momChange: '150.2%',
    isUp: true
  },
  {
    no: 37,
    sentiment: 'Positive Sentiment',
    lv4Name: 'QA-Zero Bright Pixels',
    issueType: 'Pristine raw display panel with absolutely perfect backlight uniformity across all four borders right out of the box.',
    percentage: 4.8,
    sampleCount: 131,
    momChange: '15.0%',
    isUp: true
  },
  {
    no: 38,
    sentiment: 'Positive Sentiment',
    lv4Name: 'OS-App Integration',
    issueType: 'The integrated catalog has all essential local streaming apps, preloaded and running smoothly.',
    percentage: 4.5,
    sampleCount: 123,
    momChange: '20.6%',
    isUp: true
  },
  {
    no: 39,
    sentiment: 'Positive Sentiment',
    lv4Name: 'CON-eARC Setup',
    issueType: 'Seamless Dolby Atmos audio pass-through to existing audio receivers via HDMI eARC without manual troubleshooting.',
    percentage: 4.1,
    sampleCount: 112,
    momChange: '-2.4%',
    isUp: false
  },
  {
    no: 40,
    sentiment: 'Positive Sentiment',
    lv4Name: 'OS-Child Lock Settings',
    issueType: 'Parents are satisfied with the highly intuitive screentime profiles and direct eye safety protection presets.',
    percentage: 3.8,
    sampleCount: 104,
    momChange: '18.3%',
    isUp: true
  },
  {
    no: 41,
    sentiment: 'Positive Sentiment',
    lv4Name: 'CON-Smart Home Sync',
    issueType: 'Integrates beautifully with third-party home ecosystems, allowing commands to adjust dimmers or locks during viewings.',
    percentage: 3.5,
    sampleCount: 95,
    momChange: '55.0%',
    isUp: true
  },
  {
    no: 42,
    sentiment: 'Positive Sentiment',
    lv4Name: 'MKT-Gift Bundle Quality',
    issueType: 'The promotional speaker box bundle offered free during premium SKU purchase has great fidelity and design.',
    percentage: 3.2,
    sampleCount: 87,
    momChange: '75.2%',
    isUp: true
  },
  {
    no: 43,
    sentiment: 'Positive Sentiment',
    lv4Name: 'DES-Ultra Slim Mount',
    issueType: 'Includes a proprietary wall frame that allows the heavy screen to lay completely flush, appearing like a real gallery painting.',
    percentage: 2.9,
    sampleCount: 79,
    momChange: '5.2%',
    isUp: true
  },
  {
    no: 44,
    sentiment: 'Positive Sentiment',
    lv4Name: 'OS-Screen Mirroring',
    issueType: 'Extremely easy one-click casting from both Android and Apple devices with near zero lag and stutter.',
    percentage: 2.5,
    sampleCount: 68,
    momChange: '12.0%',
    isUp: true
  }
];

// Let's seed Usage Scenario Bar chart data
export const usageScenarioData: ScenarioData[] = [
  { name: 'External Device', percentage: 85 },
  { name: 'Video Viewing', percentage: 70 },
  { name: 'Gaming', percentage: 55 },
  { name: 'Sports Watching', percentage: 45 },
  { name: 'Live Streaming', percentage: 35 },
  { name: 'Fitness', percentage: 25 },
  { name: 'Mobile', percentage: 15 },
  { name: 'Video Call', percentage: 5 }
];

// Let's seed Placement Location Bar chart data
export const placementLocationData: ScenarioData[] = [
  { name: 'Living Room', percentage: 70 },
  { name: 'Bedroom', percentage: 55 },
  { name: 'Home Office', percentage: 45 },
  { name: 'Kitchen', percentage: 35 },
  { name: 'Leisure Area', percentage: 25 },
  { name: 'Common Area', percentage: 15 },
  { name: 'Other', percentage: 5 }
];

// Let's seed External Device Name Bar chart data
export const externalDeviceNameData: ScenarioData[] = [
  { name: 'Unknown', percentage: 55 },
  { name: 'Digital Set-Top Box', percentage: 45 },
  { name: 'Game Console', percentage: 35 },
  { name: 'Media Player', percentage: 25 },
  { name: 'Personal Computer', percentage: 15 },
  { name: 'DSC', percentage: 5 }
];

// Sample user comments for different issues for the popup detail modal:
export const sampleReviews: CommentDetail[] = [
  {
    id: 'rev-1',
    user: 'Amazon Customer - John D.',
    rating: 2,
    source: 'E-commerce Walmart',
    date: '2025-05-18',
    commentText: 'Price surges sharply; I noticed the listed price was CNY 7500 on Friday but changed to CNY 8200 on check-out! Customer support was entirely unhelpful, saying no refund is possible for previous purchases under their current policy. Absolute letdown on customer service.',
    category: 'Sales Price Fluctuation',
    sentiment: 'negative'
  },
  {
    id: 'rev-2',
    user: 'TechEnthusiast_99',
    rating: 3,
    source: 'E-commerce Amazon',
    date: '2025-06-02',
    commentText: 'The on-site installer lacks basic professional knowledge. He spent three hours trying to align the HDMI feed and couldn’t figure out how to configure the eARC settings. I had to consult the manual myself! Manufacturer hasn’t responded to my follow-up complaint.',
    category: 'Installation Specification',
    sentiment: 'negative'
  },
  {
    id: 'rev-3',
    user: 'DisappointedBuyer',
    rating: 2,
    source: 'E-commerce Walmart',
    date: '2025-04-20',
    commentText: 'Inconsistent billing checkout! When I selected the promotion, it displayed 10% off. On checkout, the actual card deduction didn’t reflect the promotional code. The total amount variations caused major confusion on my credit card settlement.',
    category: 'Compliance of Product, Service & Promotion Policies',
    sentiment: 'negative'
  },
  {
    id: 'rev-4',
    user: 'L_ShipperExpress',
    rating: 1,
    source: 'E-commerce JD',
    date: '2025-05-25',
    commentText: 'Delayed shipment and extreme delays! There was no tracking update for nearly two weeks, and delivery status remained invisible in the customer app. The logistics status only updated after I made three phone calls to the depot.',
    category: 'Overselling',
    sentiment: 'negative'
  },
  {
    id: 'rev-5',
    user: 'DaveMiller_US',
    rating: 3,
    source: 'E-commerce BestBuy',
    date: '2025-06-11',
    commentText: 'The supplied wall mount accessory lacks the bracket screws for drywall installation, and the bracket hole height was misaligned by 5 millimeters on the left hook. Had to buy secondary anchors from the local shop or else the TV would hang crookedly.',
    category: 'Accessory Issues',
    sentiment: 'negative'
  },
  {
    id: 'rev-6',
    user: 'Sarah_K7',
    rating: 2,
    source: 'E-commerce Walmart',
    date: '2025-06-10',
    commentText: 'Refund timeline is completely vague. I returned the smaller display two weeks ago but keep getting generic automated messages without a specific bank resolution date. Will think twice before ordering from this app again.',
    category: 'Return Lead Time',
    sentiment: 'negative'
  },
  {
    id: 'rev-7',
    user: 'Alex_Chen',
    rating: 3,
    source: 'E-commerce Walmart',
    date: '2025-06-08',
    commentText: 'The scheduling calendar showed Monday delivery, but no delivery driver arrived, nor could I reach any physical customer servic rep. The helpline kept looping with wait music.',
    category: 'Product Delivery Timeliness',
    sentiment: 'negative'
  },
  {
    id: 'rev-8',
    user: 'GeorgeV',
    rating: 3,
    source: 'E-commerce Amazon',
    date: '2025-05-14',
    commentText: 'Disappointed to find out that the promo code promised free premium brackets, but the setup crew insisted on an out-of-pocket payment of CNY 180 for standard bracket alignment! Avoid if you expect direct and honest zero-fee packages.',
    category: 'Billing Policy',
    sentiment: 'negative'
  }
];
