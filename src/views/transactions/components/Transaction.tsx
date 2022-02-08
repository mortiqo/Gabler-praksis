import React from "react";
import { Transaction as TransactionType } from "api/transactions/types";
import { Badge } from "components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  getTransactionColor,
  getTransactionTypeName,
} from "utils/transactions";

type TransactionProps = TransactionType;
export const Transaction = ({
  id,
  transactionDate,
  type: { typeName, cashFlowEffect, amountEffect, typeNamesAsMap },
  tradeAmountInPortfolioCurrency,
  securityName,
  parentPortfolio,
}: TransactionProps) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col py-2 cursor-pointer"
      onClick={() => navigate(`/transactions/${id}`)}
    >
      <div className="flex justify-between">
        <div className="text-base font-semibold">{securityName}</div>
        <div className="text-base font-medium">
          {t("numberWithCurrency", {
            value: tradeAmountInPortfolioCurrency,
            currency: parentPortfolio.currency.securityCode,
          })}
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <div className="text-sm font-semibold text-gray-500">{`
        ${t("date", { date: new Date(transactionDate) })} - ${
          parentPortfolio.name
        }`}</div>
        <Badge colorScheme={getTransactionColor(amountEffect, cashFlowEffect)}>
          {getTransactionTypeName(typeNamesAsMap, typeName, i18n.language)}
        </Badge>
      </div>
    </div>
  );
};