import React from "react";

const Divider = ({ text }) => {
  return (
    <div className="relative flex py-5 items-center mb-16 max-w-4xl mx-auto">
      <div className="grow border-t border-gray-300"></div>
      <span className="shrink-0 mx-4 text-gray-400 text-sm uppercase font-bold tracking-widest">
        {text}
      </span>
      <div className="grow border-t border-gray-300"></div>
    </div>
  );
};

export default Divider;
