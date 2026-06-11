import React from 'react';

function Title() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="title">
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#00aaa6] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[22px]">Key Metrics</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0 w-full">
      <div className="bg-[#00aaa6] h-[2px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-full" />
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="title">
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4e5969] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[22px]">Issue Types</p>
      </div>
    </div>
  );
}

function Title2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="title">
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4e5969] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[22px]">Potential Requirements</p>
      </div>
    </div>
  );
}

function Title3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="title">
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4e5969] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[22px]">User Priorities</p>
      </div>
    </div>
  );
}

function Title4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="title">
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4e5969] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[22px]">Usage Scenarios</p>
      </div>
    </div>
  );
}

function Title5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="title">
      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4e5969] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"wdth" 100' }}>
        <p className="leading-[22px]">User Profile Analysis</p>
      </div>
    </div>
  );
}

export default function TabbarMianBWrapper() {
  return (
    <div className="bg-white hover:bg-white relative h-[36px] w-full" data-name="Tabbar-mianB-wrapper">
      <div className="flex flex-col justify-end w-full h-full">
        <div className="content-stretch flex flex-col items-start justify-end relative h-full w-full">
          <div className="relative shrink-0 w-full" data-name="Tabbar-mianB">
            <div className="flex flex-row items-center w-full h-full">
              <div className="content-stretch flex gap-[32px] items-center relative w-full h-full">
                <div className="bg-white relative shrink-0 cursor-pointer" data-name="Tabbar-mianB-components">
                  <div className="flex flex-col justify-center overflow-clip rounded-[inherit] h-full">
                    <div className="content-stretch flex flex-col gap-[2px] items-start justify-center pt-[5px] relative h-full">
                      <Title />
                      <Frame />
                    </div>
                  </div>
                </div>
                <div className="bg-white relative shrink-0 cursor-pointer" data-name="Tabbar-mianB-components">
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                    <div className="content-stretch flex items-center py-[5px] relative h-full">
                      <Title1 />
                    </div>
                  </div>
                </div>
                <div className="bg-white relative shrink-0 cursor-pointer" data-name="Tabbar-mianB-components">
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                    <div className="content-stretch flex items-center py-[5px] relative h-full">
                      <Title2 />
                    </div>
                  </div>
                </div>
                <div className="bg-white relative shrink-0 cursor-pointer" data-name="Tabbar-mianB-components">
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                    <div className="content-stretch flex items-center py-[5px] relative h-full">
                      <Title3 />
                    </div>
                  </div>
                </div>
                <div className="bg-white relative shrink-0 cursor-pointer" data-name="Tabbar-mianB-components">
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                    <div className="content-stretch flex items-center py-[5px] relative h-full">
                      <Title4 />
                    </div>
                  </div>
                </div>
                <div className="bg-white relative shrink-0 cursor-pointer" data-name="Tabbar-mianB-components">
                  <div className="flex flex-row items-center overflow-clip rounded-[inherit] h-full">
                    <div className="content-stretch flex items-center py-[5px] relative h-full">
                      <Title5 />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border-[#e5e6eb] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}
