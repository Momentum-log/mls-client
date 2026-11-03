"use client";

import React, { FC, useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

/** Accordion of questions; one answer open at a time, the first by default. */
const FaqList: FC<{ items: FaqItem[] }> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, index) => {
        const isOpen = index === openIndex;
        const answerId = `faq-answer-${index}`;
        return (
          <div key={item.q} className="rounded-2xl border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="flex min-h-16 w-full items-center justify-between gap-4 bg-transparent px-5 py-4 text-left text-[17px] font-bold leading-6 text-gray-900"
            >
              <span>{item.q}</span>
              <span aria-hidden="true" className="text-2xl font-medium leading-6 text-brand-blue">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p id={answerId} className="m-0 px-5 pb-5 text-base leading-6 text-gray-600">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FaqList;
