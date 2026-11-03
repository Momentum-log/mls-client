import React, { FC } from "react";

const STEPS = [
  { title: "Get a quote", text: "Addresses and package sizes. Prices in seconds." },
  {
    title: "Book and pay",
    text: "Card or PayU. Then a courier pickup, a drop-off point, or a label to print.",
  },
  {
    title: "Track to the door",
    text: "One MLS tracking number, live from pickup to delivery.",
  },
];

/** Three-step strip under the instant quote. */
const QuoteHowItWorks: FC = () => (
  <section aria-labelledby="how-h" className="flex flex-col gap-5 pt-6">
    <h2 id="how-h" className="m-0 font-satoshi text-2xl font-bold leading-8 text-gray-900">
      How it works
    </h2>
    <ol className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
      {STEPS.map((step, index) => (
        <li key={step.title} className="flex gap-4 rounded-[20px] border border-gray-200 bg-white p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-base font-extrabold text-foreground">
            {index + 1}
          </span>
          <span className="flex flex-col gap-1">
            <strong className="text-base font-bold leading-[22px]">{step.title}</strong>
            <span className="text-sm leading-5 text-gray-600">{step.text}</span>
          </span>
        </li>
      ))}
    </ol>
  </section>
);

export default QuoteHowItWorks;
