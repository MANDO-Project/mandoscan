import * as React from "react";

const TextLine = ({children, number}) => {
  return (
    <div className="flex gap-2 items-center mt-3 w-full max-md:max-w-full">
      <div className="self-stretch my-auto w-10 text-black">{number}</div>
      <div className="self-stretch my-auto text-black">{children}</div>
    </div>
  );
};

export default TextLine;