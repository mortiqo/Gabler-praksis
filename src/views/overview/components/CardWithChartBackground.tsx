import { ReactNode } from "react";
import { ReactComponent as ChartBackground } from "assets/chartVector.svg";
import classNames from "classnames";
import { Card } from "components";

export type ColorScheme = "black" | "gray" | "blue";

interface CardWithChartBackgroundProps {
  children: ReactNode;
  colorScheme?: ColorScheme;
  onClick?: () => void;
}

export const CardWithChartBackground = ({
  children,
  colorScheme = "gray",
  onClick,
}: CardWithChartBackgroundProps) => (
  <Card>
    <div
      className={classNames("relative overflow-hidden cursor-pointer", {
        "bg-gradient-to-br from-gray-500 to-black text-gray-100":
          colorScheme === "black",
        "bg-gray-200": colorScheme === "gray",
        "bg-primary-100": colorScheme === "blue",
      })}
      onClick={onClick}
    >
      <ChartBackground
        preserveAspectRatio="none"
        className={classNames("absolute bottom-0 w-full md:h-3/4", {
          "fill-black": colorScheme === "black",
          "fill-white": ["gray", "blue"].includes(colorScheme),
        })}
      />
      {children}
    </div>
  </Card>
);
