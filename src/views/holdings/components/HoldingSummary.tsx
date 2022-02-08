import React from "react";
import { AllocationBySecurity } from "api/holdings/types";
import { GainLoseColoring, CountryFlag } from "components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface HoldingProps extends AllocationBySecurity {
  currency: string;
}

export const HoldingSummary = ({
  name,
  code,
  security: { isinCode, countryCode },
  figures: { marketValue, tradeAmount },
  currency,
}: HoldingProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const valueChange = marketValue - tradeAmount;

  return (
    <div className="py-2" onClick={() => navigate(`holdings/${code}`)}>
      <div className="flex gap-4 justify-between items-center text-gray-800">
        <div className="text-lg font-semibold leading-5 text-gray-900">
          <span>{name}</span>
          <CountryFlag
            code={countryCode}
            className="inline ml-1.5 align-baseline w-[20px] h-[14px]"
          />
        </div>
        <div className="text-base font-medium">
          {t("numberWithCurrency", { value: marketValue, currency })}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="text-xs font-light ">{isinCode}</div>
        <div className="text-xs font-medium">
          <GainLoseColoring value={valueChange}>
            {t("numberWithCurrency", {
              value: valueChange,
              currency,
              formatParams: {
                value: { signDisplay: "always" },
              },
            })}
          </GainLoseColoring>
        </div>
      </div>
    </div>
  );
};