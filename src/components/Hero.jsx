import * as React from "react";

export default function Hero() {
  return (
    <section
      className="flex relative flex-col px-20 py-40 -mt-20 w-full min-h-[900px] max-md:px-5 max-md:py-24 max-md:max-w-full"
      aria-labelledby="hero-title"
    >
      <div className="flex z-0 flex-wrap justify-between w-full max-md:max-w-full">
        <div className="flex flex-1 shrink justify-between items-center py-20 h-full basis-0 min-w-[240px] max-md:max-w-full">
          <div className="flex flex-1 shrink gap-10 items-start self-stretch my-auto w-full basis-0 min-w-[240px] max-md:max-w-full">
            <div className="flex flex-col flex-1 shrink px-4 w-full basis-0 bg-white bg-opacity-0 min-w-[240px] max-md:max-w-full">
              <div className="flex flex-col w-full text-5xl font-bold tracking-tighter max-md:max-w-full max-md:text-4xl">
                <h1
                  id="hero-title"
                  className="text-white leading-[64px] max-md:max-w-full max-md:text-4xl max-md:leading-[60px]"
                >
                  Smart Contract
                  <br />
                  Vulnerability Detection
                </h1>
                <button
                  className="flex flex-col mt-3 max-w-full leading-none text-center text-blue-600 rounded-[1000px] w-[296px] max-md:text-4xl hover:bg-blue-100 focus:bg-blue-100 focus:outline-none"
                  tabIndex={0}
                >
                  <div className="flex relative flex-col px-7 py-1 aspect-[4.111] rounded-[1000px] max-md:px-5 max-md:text-4xl">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/441e1b1fe98db7380ed3acbac2c90714c14eed544501cd79e72dbe5ce4849062?placeholderIfAbsent=true&apiKey=8195f1a9ffb1413790dbaff62dc171be"
                      alt=""
                      className="object-cover absolute inset-0 size-full"
                    />
                    SCO Demo
                  </div>
                </button>
              </div>
              <div className="flex flex-col self-start mt-12 max-md:mt-10">
                <button
                  className="flex overflow-hidden flex-col justify-center items-center self-start text-base font-bold text-center text-white bg-white bg-opacity-0 hover:text-blue-300 focus:text-blue-300 focus:outline-none"
                  tabIndex={0}
                >
                  <div className="gap-1.5 self-stretch underline bg-white bg-opacity-0 decoration-auto decoration-solid underline-offset-auto">
                    <span className="text-white underline">More details</span>
                  </div>
                </button>
                <p className="mt-4 text-lg tracking-tight leading-7 text-neutral-300">
                  This is the quick vulnerability detection for
                  <br />7 types of bug in smart contract.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 self-start h-[771px] min-w-[240px] w-[704px]" />
      </div>
      <div className="flex absolute right-0 bottom-0 z-0 flex-col px-20 py-28 h-[900px] w-[1440px] max-md:px-5 max-md:pt-24 max-md:max-w-full">
        <div className="shrink-0 w-px h-[212px]" />
        <div className="z-10 shrink-0 self-center mt-0 w-px h-[212px]" />
        <div className="z-10 shrink-0 self-end mt-0 w-px h-[212px]" />
        <div className="shrink-0 mt-12 ml-80 w-px h-[212px] max-md:mt-10 max-md:ml-2.5" />
      </div>
    </section>
  );
}
