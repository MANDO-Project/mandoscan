import * as React from 'react';

const TextLine = ({ children, number }) => {
  return (
    <div className="mt-3 flex w-full items-center gap-2 max-md:max-w-full">
      <div className="my-auto w-10 self-stretch text-black">{number}</div>
      <div className="my-auto self-stretch text-black">{children}</div>
    </div>
  );
};

export default TextLine;
