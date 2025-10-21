'use client';

import * as React from 'react';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/react';

export const vulnerability = [
  { key: 'access_control', label: 'mapping_write.sol' },
  { key: 'arithmetic', label: 'integer_overflow_multitx_onefunc_feasible.sol' },
  { key: 'reentrancy', label: 'simple_dao.sol' },
  { key: 'time_manipulation', label: 'ether_lotto.sol' },
];

export default function DetectionForm() {
  return (
    <section
      className="flex items-center justify-between bg-gray-900 bg-opacity-70 p-20 max-md:px-5"
      aria-labelledby="detection-form-title"
    >
      <div className="flex w-[1280px] min-w-[240px] flex-col items-center self-stretch py-10">
        <form className="mt-6 flex w-[400px] max-w-full flex-col">
          <div className="flex w-full flex-col">
            <div className="relative flex w-full items-start gap-3 text-base">
              <label htmlFor="file-input" className="sr-only">
                Attach file
              </label>
              <div className="z-0 flex w-full min-w-[240px] flex-1 shrink basis-8 flex-col text-zinc-400">
                <div className="flex min-h-[56px] w-full gap-2.5 overflow-hidden rounded-xl border border-solid border-gray-100 bg-gray-100 px-4">
                  <input
                    type="file"
                    id="file-input"
                    className="mt-3 size-full min-w-[240px] flex-1 shrink self-stretch text-ellipsis bg-white bg-opacity-0"
                    aria-label="Click to attaching a file"
                  />
                </div>
              </div>
              <Button
                className="absolute right-0 top-2/4 z-0 flex h-14 min-h-[56px] min-w-[120px] -translate-y-2/4 translate-x-[0%] flex-col items-center justify-center overflow-hidden rounded-xl border border-solid border-zinc-200 bg-blue-600 px-4 text-center font-bold text-white hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                tabIndex={0}
                color="primary"
              >
                Attach File
              </Button>
            </div>
            <div className="mt-3 flex min-h-[56px] w-full gap-2.5 overflow-y-auto rounded-xl border border-solid border-gray-100 bg-white px-4">
              <Select
                className="h-full min-w-[240px] flex-1 shrink self-stretch text-ellipsis bg-black bg-opacity-0 text-base text-zinc-400"
                items={vulnerability}
                placeholder="Select a smart contract"
              >
                {(vulnerability) => (
                  <SelectItem className="bg-gray-700 pl-2">
                    {vulnerability.label}
                  </SelectItem>
                )}
              </Select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 flex min-h-[56px] w-[150px] max-w-full flex-col items-center justify-center overflow-hidden whitespace-nowrap rounded-xl bg-blue-600 px-4 text-center text-base font-bold text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
            tabIndex={0}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
