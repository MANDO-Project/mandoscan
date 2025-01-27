"use client"

import * as React from "react";
import {Button, ButtonGroup} from "@heroui/button";
import {Select, SelectItem} from "@heroui/react";


export const vulnerability = [
  {key: "access_control", label: "mapping_write.sol"},
  {key: "arithmetic", label: "integer_overflow_multitx_onefunc_feasible.sol"},
  {key: "reentrancy", label: "simple_dao.sol"},
  {key: "time_manipulation", label: "ether_lotto.sol"},
];

export default function DetectionForm() {
  return (
    <section
      className="flex justify-between items-center p-20 bg-gray-900 bg-opacity-70 max-md:px-5"
      aria-labelledby="detection-form-title"
    >
      <div className="flex flex-col items-center self-stretch py-10 my-auto min-w-[240px] w-[1280px]">
        {/* <h2
          id="detection-form-title"
          className="text-2xl font-bold tracking-tight text-center text-white max-md:max-w-full"
        >
          Enter the information below to start detection
        </h2> */}
        <form className="flex flex-col mt-6 max-w-full w-[400px]">
          <div className="flex flex-col w-full">
            <div className="flex relative gap-3 items-start w-full text-base">
              <label htmlFor="file-input" className="sr-only">
                Attach file
              </label>
              <div className="flex z-0 flex-col flex-1 shrink w-full basis-8 min-w-[240px] text-zinc-400">
                <div className="flex overflow-hidden gap-2.5 px-4 w-full bg-gray-100 rounded-xl border border-gray-100 border-solid min-h-[56px]">
                  <input
                    type="file"
                    id="file-input"
                    className="flex-1 shrink self-stretch bg-white bg-opacity-0 min-w-[240px] size-full text-ellipsis mt-3"
                    aria-label="Click to attaching a file"
                  />
                </div>
              </div>
              {/* <button
                type="button"
                className="flex overflow-hidden absolute right-0 top-2/4 z-0 flex-col justify-center items-center px-4 h-14 font-bold text-center bg-white rounded-xl border border-solid -translate-y-2/4 border-zinc-200 min-h-[56px] min-w-[120px] text-zinc-950 translate-x-[0%] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                tabIndex={0}
              >
                Attach File
              </button> */}
              <Button className="flex overflow-hidden absolute right-0 top-2/4 z-0 flex-col justify-center items-center px-4 h-14 font-bold text-center bg-blue-600 rounded-xl border border-solid -translate-y-2/4 border-zinc-200 min-h-[56px] min-w-[120px] text-white translate-x-[0%] hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                tabIndex={0} color="primary">Attach File</Button>;
            </div>
            {/* <div className="flex flex-col mt-3 w-full"> */}
              {/* <label htmlFor="type-select" className="sr-only">
                Select type
              </label> */}
              <div className="flex overflow-y-auto gap-2.5 px-4 w-full bg-white rounded-xl border border-gray-100 border-solid min-h-[56px] mt-3">
                {/* <select
                  id="type-select"
                  className="flex-1 shrink self-stretch h-full text-base bg-white bg-opacity-0 min-w-[240px] text-ellipsis text-zinc-400"
                  aria-label="Select Type"
                >
                  <option value="">Select Type</option>
                </select> */}
                <Select
                    // className="max-w-xs"
                    className="flex-1 shrink self-stretch h-full text-base bg-black bg-opacity-0 min-w-[240px] text-ellipsis text-zinc-400"
                    items={vulnerability}
                    // label="Favorite Animal"
                    placeholder="Select a smart contract"
                    >
                      {(vulnerability) => <SelectItem className="bg-gray-700 pl-2">{vulnerability.label}</SelectItem>}
                    </Select>
              {/* </div> */}
              
            </div>
          </div>
          <button
            type="submit"
            className="flex overflow-hidden flex-col justify-center items-center px-4 mt-6 max-w-full text-base font-bold text-center text-white whitespace-nowrap bg-blue-600 rounded-xl min-h-[56px] w-[150px] hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
            tabIndex={0}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
