import * as React from 'react';

export default function Hero() {
  return (
    <section
      className="relative -mt-20 flex min-h-[900px] w-full flex-col px-20 py-40 max-md:max-w-full max-md:px-5 max-md:py-24"
      aria-labelledby="hero-title"
    >
      <div className="z-0 flex w-full flex-wrap justify-between max-md:max-w-full">
        <div className="flex h-full min-w-[240px] flex-1 shrink basis-0 items-center justify-between py-20 max-md:max-w-full">
          <div className="my-auto flex w-full min-w-[240px] flex-1 shrink basis-0 items-start gap-10 self-stretch max-md:max-w-full">
            <div className="flex w-full min-w-[240px] flex-1 shrink basis-0 flex-col bg-white bg-opacity-0 px-4 max-md:max-w-full">
              <div className="flex w-full flex-col text-5xl font-bold tracking-tighter max-md:max-w-full max-md:text-4xl">
                <h1
                  id="hero-title"
                  className="leading-[64px] text-white max-md:max-w-full max-md:text-4xl max-md:leading-[60px]"
                >
                  Smart Contract
                  <br />
                  Vulnerability Detection
                </h1>
                <button
                  className="mt-3 flex w-[296px] max-w-full flex-col rounded-[1000px] text-center leading-none text-blue-600 hover:bg-blue-100 focus:bg-blue-100 focus:outline-none max-md:text-4xl"
                  tabIndex={0}
                >
                  <div className="relative flex aspect-[4.111] flex-col rounded-[1000px] px-7 py-1 max-md:px-5 max-md:text-4xl">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/441e1b1fe98db7380ed3acbac2c90714c14eed544501cd79e72dbe5ce4849062?placeholderIfAbsent=true&apiKey=8195f1a9ffb1413790dbaff62dc171be"
                      alt=""
                      className="absolute inset-0 size-full object-cover"
                    />
                    SCO Demo
                  </div>
                </button>
              </div>
              <div className="mt-12 flex flex-col self-start max-md:mt-10">
                <button
                  className="flex flex-col items-center justify-center self-start overflow-hidden bg-white bg-opacity-0 text-center text-base font-bold text-white hover:text-blue-300 focus:text-blue-300 focus:outline-none"
                  tabIndex={0}
                >
                  <div className="gap-1.5 self-stretch bg-white bg-opacity-0 underline decoration-solid decoration-auto underline-offset-auto">
                    <span className="text-white underline">More details</span>
                  </div>
                </button>
                <p className="mt-4 text-lg leading-7 tracking-tight text-neutral-300">
                  This is the quick vulnerability detection for
                  <br />7 types of bug in smart contract.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[771px] w-[704px] min-w-[240px] shrink-0 self-start" />
      </div>
      <div className="absolute bottom-0 right-0 z-0 flex h-[900px] w-[1440px] flex-col px-20 py-28 max-md:max-w-full max-md:px-5 max-md:pt-24">
        <div className="h-[212px] w-px shrink-0" />
        <div className="z-10 mt-0 h-[212px] w-px shrink-0 self-center" />
        <div className="z-10 mt-0 h-[212px] w-px shrink-0 self-end" />
        <div className="ml-80 mt-12 h-[212px] w-px shrink-0 max-md:ml-2.5 max-md:mt-10" />
      </div>
    </section>
  );
}
