'use client';

import * as React from "react";
import { Fragment, useState } from 'react';

import {Select, SelectItem} from "@heroui/react";


const FileSelector = ({ fileNames, selectedFile, onChange }) => {
  useEffect(() => {
    // Predefined list of Solidity files
    setFileNames(['contract_0.sol', 'contract_1.sol', 'contract_2.sol']);
  }, []);

  const handleFileChange = async (event) => {
    const fileName = event.target.value;
    setSelectedFile(fileName);

    // Fetch the source code of the selected file
    const response = await fetch(`/examples/${fileName}`);
    const code = await response.text();
    setSourceCode(code);
  };

  return (
    <div className="flex overflow-y-auto gap-2.5 px-4 w-full bg-white rounded-xl border border-gray-100 border-solid min-h-[56px] mt-3">
      <Select
        className="flex-1 shrink self-stretch h-full text-base bg-black bg-opacity-0 min-w-[240px] text-ellipsis text-zinc-400"
        items={vulnerability}
        placeholder="-- Select a smart contract --"
        onChange={handleFileChange}>
        {(vulnerability) => <SelectItem className="bg-gray-700 pl-2">{vulnerability.label}</SelectItem>}
      </Select>
    s</div>
  );
};

export default FileSelector;
