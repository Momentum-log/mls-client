import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container: FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`p-2 w-full md:max-w-7xl mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container;
