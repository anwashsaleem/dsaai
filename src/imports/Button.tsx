import svgPaths from "./svg-0o6n8m8urn";

function Icon() {
  return (
    <div className="relative shrink-0 size-[39.999px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="Icon">
          <path d={svgPaths.p683b800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16659" />
          <path d={svgPaths.p21ce0440} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16659" />
          <path d={svgPaths.p17b01000} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4.16659" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-[#58cc02] relative rounded-[16px] shadow-[0px_6px_0px_0px_#46a302] shrink-0 size-[79.999px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-0 pr-[0.018px] py-0 relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[24.011px] relative shrink-0 w-[42.083px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Nunito:ExtraBold',sans-serif] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] text-nowrap">Stack</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15.989px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_373)" id="Icon">
          <path d={svgPaths.p303ce2c0} fill="var(--fill-0, #FFC800)" id="Vector" stroke="var(--stroke-0, #FFC800)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33239" />
        </g>
        <defs>
          <clipPath id="clip0_6_373">
            <rect fill="white" height="15.9887" width="15.9887" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[19.99px] relative shrink-0 w-[48.003px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Nunito:ExtraBold',sans-serif] leading-[20px] left-0 not-italic text-[#4b4b4b] text-[14px] top-[-1px] w-[49px]">110 XP</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#fff4cc] h-[30.318px] relative rounded-[3.96025e+07px] shrink-0 w-[94.309px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#ffc800] border-[1.18px] border-solid inset-0 pointer-events-none rounded-[3.96025e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[3.983px] items-center pl-[13.167px] pr-[1.18px] py-[1.18px] relative size-full">
        <Icon1 />
        <Text />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex h-[30.318px] items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container1 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[24.011px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Nunito:Regular',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[#777] text-[16px]">Last In First Out (LIFO)</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16.007px] relative shrink-0 w-[47.523px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Nunito:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#777] text-[12px] text-nowrap top-[-1.18px]">Progress</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16.007px] relative shrink-0 w-[18.368px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Nunito:Regular',sans-serif] leading-[16px] left-0 not-italic text-[#777] text-[12px] top-[-1.18px] w-[19px]">0%</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[16.007px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Text1 />
          <Text2 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return <div className="bg-[#58cc02] h-[11.987px] shrink-0 w-full" data-name="Container" />;
}

function Container5() {
  return (
    <div className="bg-[#e5e5e5] h-[11.987px] relative rounded-[3.96025e+07px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pl-0 pr-[483.864px] py-0 relative size-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[3.983px] h-[31.977px] items-start relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container5 />
    </div>
  );
}

function Container7() {
  return (
    <div className="basis-0 grow h-[106.278px] min-h-px min-w-px relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start justify-center relative size-full">
        <Container2 />
        <Paragraph />
        <Container6 />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex gap-[19.99px] h-[106.278px] items-center left-[23.99px] top-[23.99px] w-[583.853px]" data-name="Container">
      <Container />
      <Container7 />
    </div>
  );
}

export default function Button() {
  return (
    <div className="bg-white border-[#e5e5e5] border-[1.18px] border-solid relative rounded-[16px] size-full" data-name="Button">
      <Container8 />
    </div>
  );
}