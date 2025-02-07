"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { FC, useEffect, useRef, useState } from "react";

interface IExpandableBox {
  title: string;
  children: React.ReactElement;
}

export const ExpandableBox: FC<IExpandableBox> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded && contentRef.current) {
      // Calculate the height of the content
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  return (
    <div className="flex flex-col w-full items-center">
      <div
        onClick={() => setExpanded((prev) => !prev)}
        className="bg-fwOrange text-black rounded-xl p-4 text-lg flex justify-between font-medium w-full"
      >
        <span>{title}</span>
        <span>
          {!expanded ? (
            <ArrowDownIcon className="h-6 w-6" />
          ) : (
            <ArrowUpIcon className="h-6 w-6" />
          )}
        </span>
      </div>

      <div
        ref={contentRef}
        style={{ maxHeight: `${height}px` }}
        className="overflow-hidden transition-all duration-300 ease-in-out w-[80%]"
      >
        <div className="w-full h-full rounded-b-md bg-[rgba(255,255,255,.12)] text-white p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
