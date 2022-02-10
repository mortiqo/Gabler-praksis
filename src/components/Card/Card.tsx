import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  header?: ReactNode;
}

export const Card = ({ children, header }: CardProps) => (
  <div className="overflow-hidden w-full bg-white rounded-lg border shadow-md">
    {header && (
      <div className="p-2 text-2xl font-bold bg-gray-200">{header}</div>
    )}
    {children}
  </div>
);
