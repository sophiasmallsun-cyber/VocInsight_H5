import React, { useState, useContext } from 'react';
import { Sparkles } from 'lucide-react';
import { LanguageContext } from '../contexts/LanguageContext';

type SentimentFilter = 'Positive' | 'Negative' | 'Neutral' | 'Total';

const aiAnalysisData = {
  Total: {
    title: "Core Insights Summary",
    insights: [
      { highlight: "Installation Fees", text: "Users inquire whether free installation and wall mounts are included, and ask about potential extra charges." },
      { highlight: "Customer Service Response", text: "Slow or no replies from human support; users are mostly served by chatbots, resulting in poor experience." },
      { highlight: "Delayed Shipment", text: "Multiple complaints mention order delays of one month or longer, disrupting users’ delivery schedules." },
      { highlight: "Price Fluctuations & Subsidies", text: "Discrepancies between checkout prices and page listed prices, including unexpected price hikes, unclear subsidy rules, and missing national subsidy entry interfaces." },
      { highlight: "Unclear Product Information", text: "Users have uncertainties over details such as wall mount inclusion, availability of 85-inch models, and whether orders will be split into two separate shipments." }
    ]
  },
  Positive: {
    title: "Positive Feedback Insights",
    insights: [
      { highlight: "Screen & Audio Effects", text: "Users consistently praise the stunning visual experience, high resolution, and Dolby Atmos audio quality." },
      { highlight: "Service Attitude", text: "Many customers highlight the careful and thorough installation by technicians." },
      { highlight: "Design & Appearance", text: "The large size and beautiful modern look are frequently mentioned as standout features." }
    ]
  },
  Negative: {
    title: "Negative Feedback Insights",
    insights: [
      { highlight: "Delayed Shipment", text: "Multiple complaints mention order delays of one month or longer, disrupting users’ delivery schedules." },
      { highlight: "Price Fluctuations", text: "Unexpected price hikes and discrepancies between listed and checkout prices cause significant frustration." },
      { highlight: "Customer Service Response", text: "Slow or no replies from human support; mostly served by ineffective chatbots." }
    ]
  },
  Neutral: {
    title: "Neutral Feedback & Inquiries",
    insights: [
      { highlight: "Installation Queries", text: "Questions regarding whether installation is free and if wall mounts are provided in the box." },
      { highlight: "Product Specifics", text: "Uncertainties about the exact dimensions of the 85-inch model and refresh rates." },
      { highlight: "Shipping Split", text: "Confusion over whether multi-item orders will be shipped together or split into multiple deliveries." }
    ]
  }
};

const userVoicesData = {
  Total: {
    count: "378,980",
    voices: [
      {
        user: "I***Feng",
        platform: "JD.com",
        date: "2026-06-06 23:43",
        text: (
          <>JD Installation Service: The technician was careful and thorough during installation. In terms of appearance & design, the product features a large size, great look, stunning visual experience and high resolution.</>
        ),
        tags: [
          { label: "Service Attitude", type: "Positive" },
          { label: "Image Clarity", type: "Positive" }
        ]
      },
      {
        user: "C***u",
        platform: "Taobao",
        date: "2026-06-07 10:12",
        text: (
          <>The shipping was unacceptably slow. I waited for over a month and the customer support just kept giving me automated responses.</>
        ),
        tags: [
          { label: "Delayed Shipment", type: "Negative" },
          { label: "Customer Service Response", type: "Negative" }
        ]
      },
      {
        user: "W***_12",
        platform: "Weibo",
        date: "2026-06-08 15:30",
        text: (
          <>Overall a great purchase. The color gamut is really outstanding for movie nights. Slightly disappointed with the interface lag initially, but a firmware update fixed it.</>
        ),
        tags: [
          { label: "Color Accuracy", type: "Positive" },
          { label: "Firmware Update", type: "Positive" }
        ]
      },
      {
        user: "Xiao***u",
        platform: "Xiaohongshu",
        date: "2026-06-09 11:20",
        text: (
          <>Love this new TV! It fits my living room aesthetic perfectly. The bezels are super thin. 😍</>
        ),
        tags: [
          { label: "Design & Appearance", type: "Positive" }
        ]
      },
      {
        user: "Call_8829",
        platform: "Call Center",
        date: "2026-06-04 09:12",
        text: (
          <>Customer called to complain about a crack on the top left corner of the screen upon unboxing. Requested immediate replacement.</>
        ),
        tags: [
          { label: "Screen Defect", type: "Negative" },
          { label: "Logistics Damage", type: "Negative" }
        ]
      },
      {
        user: "Srv_User99",
        platform: "Survey",
        date: "2026-06-05 14:10",
        text: (
          <>User rated the installation service 3/5. Stated that the technicians were professional but arrived 2 hours late than the scheduled time.</>
        ),
        tags: [
          { label: "Service Delay", type: "Neutral" },
          { label: "Service Attitude", type: "Neutral" }
        ]
      },
      {
        user: "B***x",
        platform: "JD.com",
        date: "2026-06-08 09:12",
        text: (
          <>Bought it on sale, great value for money and the delivery was surprisingly fast. The 100-inch screen feels like a cinema.</>
        ),
        tags: [
          { label: "Value For Money", type: "Positive" },
          { label: "Fast Delivery", type: "Positive" }
        ]
      },
      {
        user: "H***1",
        platform: "Taobao",
        date: "2026-06-05 18:22",
        text: (
          <>Screen flickering right out of the box... very frustrating, currently waiting for after-sales support to get back to me.</>
        ),
        tags: [
          { label: "Screen Defect", type: "Negative" },
          { label: "After-sales Support", type: "Negative" }
        ]
      }
    ]
  },
  Positive: {
    count: "169,025",
    voices: [
      {
        user: "I***Feng",
        platform: "JD.com",
        date: "2026-06-06 23:43",
        text: (
          <>JD Installation Service: The technician was careful and thorough during installation. In terms of appearance & design, the product features a large size, great look, stunning visual experience and high resolution.</>
        ),
        tags: [
          { label: "Service Attitude", type: "Positive" },
          { label: "Image Clarity", type: "Positive" }
        ]
      },
      {
        user: "A***8",
        platform: "Tmall",
        date: "2026-06-06 14:20",
        text: (
          <>Amazing TV for the price! The color accuracy is fantastic and the built-in speakers are surprisingly good. I love the minimalist border design.</>
        ),
        tags: [
          { label: "Value For Money", type: "Positive" },
          { label: "Color Accuracy", type: "Positive" },
          { label: "Audio Quality", type: "Positive" }
        ]
      },
      {
        user: "Xiao***u",
        platform: "Xiaohongshu",
        date: "2026-06-09 11:20",
        text: (
          <>Love this new TV! It fits my living room aesthetic perfectly. The bezels are super thin. 😍</>
        ),
        tags: [
          { label: "Design & Appearance", type: "Positive" }
        ]
      },
      {
        user: "W***_12",
        platform: "Weibo",
        date: "2026-06-08 15:30",
        text: (
          <>Overall a great purchase. The color gamut is really outstanding for movie nights. Firmware update made it perfect.</>
        ),
        tags: [
          { label: "Color Accuracy", type: "Positive" },
          { label: "Firmware Update", type: "Positive" }
        ]
      },
      {
        user: "Srv_User12",
        platform: "Survey",
        date: "2026-06-01 10:00",
        text: (
          <>User gave a 5/5 score. Highly satisfied with the overall experience, especially the picture mode presets and responsive remote.</>
        ),
        tags: [
          { label: "Overall Satisfaction", type: "Positive" },
          { label: "Remote Control", type: "Positive" }
        ]
      },
      {
        user: "Call_1102",
        platform: "Call Center",
        date: "2026-06-03 16:30",
        text: (
          <>Customer called to express gratitude towards the technician who helped setup the soundbar integration perfectly.</>
        ),
        tags: [
          { label: "Installation Service", type: "Positive" },
          { label: "Audio Setup", type: "Positive" }
        ]
      }
    ]
  },
  Negative: {
    count: "69,871",
    voices: [
      {
        user: "C***u",
        platform: "Taobao",
        date: "2026-06-07 10:12",
        text: (
          <>The shipping was unacceptably slow. I waited for over a month and the customer support just kept giving me automated responses.</>
        ),
        tags: [
          { label: "Delayed Shipment", type: "Negative" },
          { label: "Customer Service Response", type: "Negative" }
        ]
      },
      {
        user: "K***9",
        platform: "JD.com",
        date: "2026-06-05 09:41",
        text: (
          <>Box arrived with severe damage. The TV screen had a crack on the edge. Extremely disappointed with the logistics carrier.</>
        ),
        tags: [
          { label: "Logistics Damage", type: "Negative" },
          { label: "Screen Defect", type: "Negative" }
        ]
      },
      {
        user: "Mad_User",
        platform: "Weibo",
        date: "2026-06-02 21:10",
        text: (
          <>I will never buy from this brand again! The TV keeps resetting itself every 2 hours and customer service is nonexistent. #WorstPurchaseEver</>
        ),
        tags: [
          { label: "System Crash", type: "Negative" },
          { label: "Customer Service Response", type: "Negative" }
        ]
      },
      {
        user: "Call_8829",
        platform: "Call Center",
        date: "2026-06-04 09:12",
        text: (
          <>Customer called to complain about a crack on the top left corner of the screen upon unboxing. Requested immediate replacement.</>
        ),
        tags: [
          { label: "Screen Defect", type: "Negative" },
          { label: "Logistics Damage", type: "Negative" }
        ]
      },
      {
        user: "Srv_User90",
        platform: "Survey",
        date: "2026-06-07 15:45",
        text: (
          <>Rated 1/5. The user claims the advertised 144Hz refresh rate only works in 1080p mode, which was misleading.</>
        ),
        tags: [
          { label: "False Advertising", type: "Negative" },
          { label: "Technical Specs", type: "Negative" }
        ]
      }
    ]
  },
  Neutral: {
    count: "140,084",
    voices: [
      {
        user: "U***7",
        platform: "Tmall",
        date: "2026-06-08 15:30",
        text: (
          <>The product is fine, but I'm not sure if the wall mount is supposed to be included. The installation fee wasn't clearly stated on the checkout page.</>
        ),
        tags: [
          { label: "Installation Fees", type: "Neutral" },
          { label: "Unclear Product Information", type: "Neutral" }
        ]
      },
      {
        user: "W***2",
        platform: "JD.com",
        date: "2026-06-09 11:15",
        text: (
          <>Is there a way to turn off the smart motion smoothing permanently? I couldn't find the option in the settings menu easily.</>
        ),
        tags: [
          { label: "Function Inquiry", type: "Neutral" },
          { label: "UI Experience", type: "Neutral" }
        ]
      },
      {
        user: "Curious_One",
        platform: "Xiaohongshu",
        date: "2026-06-10 12:00",
        text: (
          <>Has anyone tried mounting this specific model on a drywall? Let me know if the VESA holes are standard size or custom.</>
        ),
        tags: [
          { label: "Mounting Inquiry", type: "Neutral" }
        ]
      },
      {
        user: "Srv_User99",
        platform: "Survey",
        date: "2026-06-05 14:10",
        text: (
          <>User rated the installation service 3/5. Stated that the technicians were professional but arrived 2 hours late than the scheduled time.</>
        ),
        tags: [
          { label: "Service Delay", type: "Neutral" },
          { label: "Service Attitude", type: "Neutral" }
        ]
      },
      {
        user: "Call_5033",
        platform: "Call Center",
        date: "2026-06-06 14:10",
        text: (
          <>Customer inquiring about the warranty extension plan. Wanted to know if screen burn-in is fully covered for the next 3 years.</>
        ),
        tags: [
          { label: "Warranty Inquiry", type: "Neutral" }
        ]
      }
    ]
  }
};

const getTagStyles = (type: string) => {
  if (type === 'Positive') return 'bg-[#FDCDC5]/30 text-[#F76560]';
  if (type === 'Negative') return 'bg-[#BEDAFF]/30 text-[#4080FF]';
  if (type === 'Neutral') return 'bg-[#ADEEE4]/30 text-[#22BBB3]';
  return 'bg-[#f2f3f5] text-[#4e5969]';
};

const platformDataOptions: Record<SentimentFilter, { id: string; label: string; countStr: string; pct: string }[]> = {
  Total: [
    { id: 'Total', label: 'Total Mentions', countStr: '1,298,461', pct: '100%' },
    { id: 'E-commerce', label: 'E-commerce Mentions', countStr: '894,320', pct: '68.8%' },
    { id: 'Social Media', label: 'Social Media Mentions', countStr: '298,421', pct: '22.9%' },
    { id: 'Internal Data', label: 'Internal Data Mentions', countStr: '105,720', pct: '8.1%' },
  ],
  Positive: [
    { id: 'Total', label: 'Total Mentions', countStr: '579,915', pct: '100%' },
    { id: 'E-commerce', label: 'E-commerce Mentions', countStr: '399,995', pct: '68.9%' },
    { id: 'Social Media', label: 'Social Media Mentions', countStr: '139,920', pct: '24.1%' },
    { id: 'Internal Data', label: 'Internal Data Mentions', countStr: '40,000', pct: '6.8%' },
  ],
  Negative: [
    { id: 'Total', label: 'Total Mentions', countStr: '239,718', pct: '100%' },
    { id: 'E-commerce', label: 'E-commerce Mentions', countStr: '169,718', pct: '70.7%' },
    { id: 'Social Media', label: 'Social Media Mentions', countStr: '50,000', pct: '20.8%' },
    { id: 'Internal Data', label: 'Internal Data Mentions', countStr: '20,000', pct: '8.3%' },
  ],
  Neutral: [
    { id: 'Total', label: 'Total Mentions', countStr: '478,828', pct: '100%' },
    { id: 'E-commerce', label: 'E-commerce Mentions', countStr: '324,607', pct: '67.7%' },
    { id: 'Social Media', label: 'Social Media Mentions', countStr: '108,501', pct: '22.6%' },
    { id: 'Internal Data', label: 'Internal Data Mentions', countStr: '45,720', pct: '9.5%' },
  ]
};

export default function SelfServiceView() {
  const { t } = useContext(LanguageContext);
  const [activeSentiment, setActiveSentiment] = useState<SentimentFilter>('Total');
  const [activePlatform, setActivePlatform] = useState<string>('Total');
  const [isSkusExpanded, setIsSkusExpanded] = useState<boolean>(false);

  const currentAnalysisBase = aiAnalysisData[activeSentiment];
  const analysisTitle = activePlatform === 'Total' 
    ? t(currentAnalysisBase.title)
    : `${t(currentAnalysisBase.title)} (${t(activePlatform)})`;

  const rawVoices = userVoicesData[activeSentiment].voices;
  let selectedVoicesArr = rawVoices;
  if (activePlatform === 'E-commerce') {
    selectedVoicesArr = rawVoices.filter(v => ['JD.com', 'Taobao', 'Tmall'].includes(v.platform));
  } else if (activePlatform === 'Social Media') {
    // If not found in mock data, fallback to first item
    selectedVoicesArr = rawVoices.filter(v => ['Weibo', 'Xiaohongshu'].includes(v.platform));
    if (selectedVoicesArr.length === 0 && rawVoices.length > 0) selectedVoicesArr = [{...rawVoices[0], platform: 'Weibo'}];
  } else if (activePlatform === 'Internal Data') {
    selectedVoicesArr = rawVoices.filter(v => ['Call Center', 'Survey'].includes(v.platform));
    if (selectedVoicesArr.length === 0 && rawVoices.length > 0) selectedVoicesArr = [{...rawVoices[0], platform: 'Call Center'}];
  }

  const platformsList = platformDataOptions[activeSentiment];
  const currentPlatformObj = platformsList.find(p => p.id === activePlatform) || platformsList[0];
  const displayCountStr = currentPlatformObj.countStr;

  return (
    <div className="flex flex-col xl:flex-row gap-4 md:gap-5 items-start w-full">

      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col gap-4 md:gap-5 w-full min-w-0">
          {/* AI Analysis Banner */}
         <div className="relative bg-[#e6e8fd]/30 rounded-[8px] p-5 border border-[#acb4ff] transition-all">
           <div className="flex items-center gap-[12px] mb-4">
             <div className="size-6 bg-gradient-to-tr from-[#9B6DFF] via-[#7A78FF] to-[#60F0E6] rounded-full flex items-center justify-center">
               <Sparkles className="w-3.5 h-3.5 text-white" />
             </div>
             <p className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#C069FF] via-[#3B91FF] to-[#0D5EFF]">
               {t('AI Analysis')}
             </p>
             <p className="text-base text-[#4e5969] font-normal">{analysisTitle}</p>
           </div>
           
           <div className="space-y-2 text-[14px] text-[#1d2129]">
             {currentAnalysisBase.insights.map((insight, idx) => (
               <ul key={idx} className="list-disc pl-5">
                 <li className="leading-[22px]">
                   <span className="font-medium">{insight.highlight}: </span>
                   {insight.text}
                 </li>
               </ul>
             ))}
           </div>
         </div>

         {/* User Voices */}
         <div className="border border-[#e5e6eb] rounded-[8px] p-5 bg-white transition-all">
           <div className="flex items-center gap-[4px] mb-4 text-[18px] text-[#1d2129]">
             <span className="font-medium">{t('Total Valid User Voices')}</span>
             <span className="font-medium">{displayCountStr}</span>
           </div>

           <div className="space-y-5">
              {selectedVoicesArr.map((voice, idx) => (
                <div key={idx} className="bg-[#fafbfc] rounded-[8px] p-4 space-y-4">
                  <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm whitespace-nowrap overflow-auto no-scrollbar">
                    <div className="flex items-center gap-[8px] font-medium text-[#1d2129]">
                      <div className="flex-shrink-0 w-[24px] h-[24px] rounded-full bg-[#e5e6eb] flex items-center justify-center text-[12px] text-[#4e5969]">
                        {voice.user.charAt(0).toUpperCase()}
                      </div>
                      <span>{voice.user}</span>
                    </div>
                    <div className="w-px h-3 bg-[#e5e6eb]" />
                    <div className="text-[#4e5969]">Source Platform: {voice.platform}</div>
                    <div className="w-px h-3 bg-[#e5e6eb]" />
                    <div className="text-[#4e5969]">{voice.date}</div>
                    <div className="w-px h-3 bg-[#e5e6eb]" />
                    <div className="text-[#00aaa6] cursor-pointer hover:underline">Original Link</div>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#1d2129] leading-[22px] mb-2 font-normal">
                      {voice.text}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {voice.tags.map((tag, i) => (
                        <span key={i} className={`px-2 py-0.5 text-[12px] font-medium rounded ${getTagStyles(tag.type)}`}>
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
           </div>
         </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full xl:w-[275px] shrink-0 border border-[#e5e6eb] rounded-[8px] p-5 bg-white space-y-10">
         
         {/* Sentiment Distribution Grid */}
         <div className="space-y-4">
           <h3 className="text-[18px] font-medium text-[#1d2129] leading-[26px]">{t('Sentiment Distribution')}</h3>
           <div className="grid grid-cols-2 gap-[20px]">
             
             <div className="flex flex-col items-center cursor-pointer transition-opacity" onClick={() => setActiveSentiment('Positive')}>
               <div className="relative w-[89px] h-[89px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 89 89" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Positive' ? '#FFF0ED' : '#f2f3f5'} strokeWidth="8" className="transition-colors duration-300" />
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Positive' || activeSentiment === 'Total' ? '#F76560' : '#FDCDC5'} strokeWidth="8" strokeDasharray="254" strokeDashoffset="140" className="transition-colors duration-300" />
                  </svg>
                  <div className="text-center absolute flex flex-col items-center justify-center w-[50px] h-[50px]">
                    <div className="text-[12px] text-[#86909c] transition-colors">{t('Positive')}</div>
                    <div className={`text-[16px] font-medium leading-[20px] transition-colors ${activeSentiment === 'Positive' || activeSentiment === 'Total' ? 'text-[#1d2129]' : 'text-[#1d2129]/50'}`}>44.6%</div>
                  </div>
               </div>
               <div className={`text-[14px] mt-[4px] leading-[22px] transition-colors ${activeSentiment === 'Positive' || activeSentiment === 'Total' ? 'text-[#86909c]' : 'text-[#86909c]/40'}`}>579,915</div>
             </div>
             
             <div className="flex flex-col items-center cursor-pointer transition-opacity" onClick={() => setActiveSentiment('Negative')}>
               <div className="relative w-[89px] h-[89px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 89 89" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Negative' ? '#E8F3FF' : '#f2f3f5'} strokeWidth="8" className="transition-colors duration-300" />
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Negative' || activeSentiment === 'Total' ? '#4080FF' : '#BEDAFF'} strokeWidth="8" strokeDasharray="254" strokeDashoffset="207" className="transition-colors duration-300" />
                  </svg>
                  <div className="text-center absolute flex flex-col items-center justify-center w-[50px] h-[50px]">
                    <div className="text-[12px] text-[#86909c] transition-colors">{t('Negative')}</div>
                    <div className={`text-[16px] font-medium leading-[20px] transition-colors ${activeSentiment === 'Negative' || activeSentiment === 'Total' ? 'text-[#1d2129]' : 'text-[#1d2129]/50'}`}>18.4%</div>
                  </div>
               </div>
               <div className={`text-[14px] mt-[4px] leading-[22px] transition-colors ${activeSentiment === 'Negative' || activeSentiment === 'Total' ? 'text-[#86909c]' : 'text-[#86909c]/40'}`}>239,718</div>
             </div>

             <div className="flex flex-col items-center cursor-pointer transition-opacity" onClick={() => setActiveSentiment('Neutral')}>
               <div className="relative w-[89px] h-[89px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 89 89" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Neutral' ? '#E5F6F6' : '#f2f3f5'} strokeWidth="8" className="transition-colors duration-300" />
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Neutral' || activeSentiment === 'Total' ? '#22BBB3' : '#ADEEE4'} strokeWidth="8" strokeDasharray="254" strokeDashoffset="160" className="transition-colors duration-300" />
                  </svg>
                  <div className="text-center absolute flex flex-col items-center justify-center w-[50px] h-[50px]">
                    <div className="text-[12px] text-[#86909c] transition-colors">{t('Neutral')}</div>
                    <div className={`text-[16px] font-medium leading-[20px] transition-colors ${activeSentiment === 'Neutral' || activeSentiment === 'Total' ? 'text-[#1d2129]' : 'text-[#1d2129]/50'}`}>36.8%</div>
                  </div>
               </div>
               <div className={`text-[14px] mt-[4px] leading-[22px] transition-colors ${activeSentiment === 'Neutral' || activeSentiment === 'Total' ? 'text-[#86909c]' : 'text-[#86909c]/40'}`}>478,828</div>
             </div>

             <div className="flex flex-col items-center cursor-pointer transition-opacity" onClick={() => setActiveSentiment('Total')}>
               <div className="relative w-[89px] h-[89px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 89 89" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Total' ? '#F2F3F5' : '#f2f3f5'} strokeWidth="8" className="transition-colors duration-300" />
                    <circle cx="44.5" cy="44.5" r="40.5" fill="none" stroke={activeSentiment === 'Total' ? '#e5e6eb' : 'transparent'} strokeWidth="8" strokeDasharray="254" strokeDashoffset="0" className="transition-colors duration-300" />
                  </svg>
                  <div className="text-center absolute flex flex-col items-center justify-center w-[50px] h-[50px]">
                    <div className="text-[12px] text-[#86909c] transition-colors">{t('Total')}</div>
                    <div className={`text-[16px] font-medium leading-[20px] transition-colors ${activeSentiment === 'Total' ? 'text-[#1d2129]' : 'text-[#1d2129]/50'}`}>100%</div>
                  </div>
               </div>
               <div className={`text-[14px] mt-[4px] leading-[22px] transition-colors ${activeSentiment === 'Total' ? 'text-[#86909c]' : 'text-[#86909c]/40'}`}>1,298,461</div>
             </div>

           </div>
         </div>

         {/* Distribution Mentions */}
         <div className="space-y-4">
           <h3 className="text-[18px] font-medium text-[#1d2129]">Sentiment Distribution</h3>
           
           <div className="space-y-2">
             {platformsList.map(p => (
               <div 
                 key={p.id}
                 onClick={() => setActivePlatform(p.id)}
                 className={`content-stretch flex flex-col gap-[2px] items-start px-[8px] py-[6px] relative rounded-[4px] w-full cursor-pointer transition-colors ${activePlatform === p.id ? 'bg-[#f7f8fa]' : 'bg-transparent hover:bg-[#f7f8fa]/50'}`}
               >
                 <div className="[word-break:break-word] content-stretch flex items-center justify-between leading-[0] relative shrink-0 text-[14px] w-full whitespace-nowrap">
                   <div className={`flex flex-col font-medium justify-center relative shrink-0 ${activePlatform === p.id ? 'text-[#4e5969]' : 'text-[#86909c] font-normal'}`} style={{ fontVariationSettings: '"wdth" 100' }}>
                     <p className="leading-[22px]">{p.label}</p>
                   </div>
                   <div className="flex flex-col font-normal justify-center relative shrink-0 text-[#1d2129]" style={{ fontVariationSettings: '"wdth" 100' }}>
                     <p className="leading-[22px]">{p.countStr}</p>
                   </div>
                 </div>
                 <div className="bg-[#f2f3f5] content-stretch flex h-[4px] items-start overflow-clip relative rounded-[8px] shrink-0 w-full mt-1">
                   <div className="bg-[#22bbb3] h-[4px] relative rounded-[8px] shrink-0" style={{ width: p.pct }} />
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Data Statistics */}
         <div className="space-y-[16px]">
           <h3 className="text-[18px] font-medium text-[#1d2129]">{t('Data Statistics')}</h3>
           
           <div className="space-y-[16px] text-[14px] leading-[22px]">
             <div className="flex justify-between items-start">
               <span className="text-[#4e5969] font-medium">{t('Total User Voices')}</span>
               <span className="text-[#1d2129] font-normal">10,396,325</span>
             </div>
             <div className="flex justify-between items-start">
               <span className="text-[#4e5969] font-medium">{t('Valid Rate')}</span>
               <span className="text-[#1d2129] font-normal">9%</span>
             </div>
             <div className="flex justify-between items-start">
               <span className="text-[#4e5969] font-medium">{t('Category')}</span>
               <span className="text-[#1d2129] font-normal">TV</span>
             </div>
             <div className="flex flex-col items-start gap-1">
               <span className="text-[#4e5969] font-medium">{t('Brands')}</span>
               <span className="text-[#1d2129] font-normal leading-relaxed">
                 Hisense | Huawei | Xiaomi | Skyworth | Redmi | Sony | Thunderbird | Vidda | Toshiba | Samsung | Cool TV | TCL
               </span>
             </div>
             <div className="flex flex-col items-start gap-1">
               <div className="flex justify-between w-full">
                 <span className="text-[#4e5969] font-medium">{t('Brands')}</span>
                 <span 
                   className="text-[#00aaa6] font-normal cursor-pointer transition-colors hover:text-[#008c89]" 
                   onClick={() => setIsSkusExpanded(!isSkusExpanded)}
                 >
                   {isSkusExpanded ? t('Collapse') : t('Expand')}
                 </span>
               </div>
               <span className="text-[#1d2129] font-normal leading-relaxed transition-all">
                 {(() => {
                   const fullText = "Hisense M100 | TCL 75C78H | FFALCON 85S68A | Skyworth 55V58F | Toshiba 55Z600NFD | Sony XR-55A80EL | Xiaomi L55M7-ES | Xiaomi L55MB-S | TCL 55T6K | TCL 65V8L PRO | Sony XR-65X91K | Skyworth 100SU8F PRO | Hisense 100A50Q | Hisense 85U69N | Samsung MRA115MR95FXXZ | Xiaomi L85MB-SPL | Toshiba 75C340NFH | Xiaomi L55M7-EA | Coocaa 43P31 | Samsung QA65S85F | Vidda 75V3K-PRO | TCL 43V8H | TCL 65S12 | Hisense 85A57K | FFALCON 75R695C | Skyworth 75A3D | TCL 50T8H | FFALCON 85S585C SLIM | TCL 65Q10G";
                   if (isSkusExpanded) return fullText;
                   const items = fullText.split(" | ");
                   return items.slice(0, 10).join(" | ") + (items.length > 10 ? "..." : "");
                 })()}
               </span>
             </div>
           </div>
         </div>

      </div>
    </div>
  );
}
