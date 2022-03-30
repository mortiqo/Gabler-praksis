import { useDownloadDocument } from "api/documents/useDownloadDocument";
import { TransactionDetails as TransactionDetailsType } from "api/transactions/types";
import { ReactComponent as DocumentDownloadIcon } from "assets/document-download.svg";
import { Button, Card, CountryFlag } from "components";
import { useModifiedTranslation } from "hooks/useModifiedTranslation";
import { PageLayout } from "layouts/PageLayout/PageLayout";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { dateFromYYYYMMDD } from "utils/date";
import {
  getTransactionColor,
  getNameFromBackendTranslations,
} from "utils/transactions";
import { InfoCard } from "views/transactionDetails/components/InfoCard";
import { DataRow } from "../../holdingDetails/components/DataRow";
import { TransactionType } from "../transactionDetailsView";
import { ValueInCurrencies } from "./ValueInCurrencies";

interface TransactionDetailsProps {
  data: TransactionDetailsType;
}

export const TransactionDetails = ({
  data: {
    amount,
    security,
    settlementDate,
    unitPriceInSecurityCurrency,
    type: { typeName, typeNamesAsMap, cashFlowEffect, amountEffect },
    transactionDate,
    securityName,
    parentPortfolio: { name: portfolioName },
    costInSecurityCurrency,
    accountFxRate,
    marketPlace,
    documents,
    extInfo,
    account,
    securityCurrencyCode,
    tradeAmountInAccountCurrency,
    tradeAmountInSecurityCurrency,
    grossPriceInSecurityCurrency,
    grossPriceInAccountCurrency,
  },
}: TransactionDetailsProps) => {
  const { t, i18n } = useModifiedTranslation();
  const { downloadDocument, downloading } = useDownloadDocument();
  const transactionType = useGetTransactionType();
  const navigate = useNavigate();
  return (
    <PageLayout>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-start-1 md:row-start-1 md:row-end-2 lg:row-end-3">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-[repeat(auto-fill,_minmax(175px,_1fr))]">
            <InfoCard
              label={t("transactionsPage.type")}
              value={getNameFromBackendTranslations(
                typeNamesAsMap,
                typeName,
                i18n.language
              )}
              colorScheme={getTransactionColor(amountEffect, cashFlowEffect)}
            />
            <InfoCard
              label={t("transactionsPage.total")}
              value={t(
                "numberWithCurrency",
                account
                  ? {
                      value: tradeAmountInAccountCurrency,
                      currency: account.currency.accountCurrencyCode,
                    }
                  : {
                      value: tradeAmountInSecurityCurrency,
                      currency: securityCurrencyCode,
                    }
              )}
            />
            <div className="col-span-2">
              <InfoCard
                label={t("transactionsPage.securityName")}
                value={
                  <div>
                    <span>{securityName}</span>
                    {security && security.country && (
                      <CountryFlag
                        code={security.country.code}
                        className="inline ml-1.5 align-baseline w-[20px] h-[14px]"
                      />
                    )}
                  </div>
                }
                onClick={() =>
                  !!security && navigate(`../holdings/${security.securityCode}`)
                }
              />
            </div>
            <div className="col-span-2">
              <InfoCard
                label={t("transactionsPage.portfolioName")}
                value={portfolioName}
              />
            </div>
            <InfoCard
              label={t("transactionsPage.transactionDate")}
              value={t("date", { date: dateFromYYYYMMDD(transactionDate) })}
            />
            <InfoCard
              label={t("transactionsPage.settlementDate")}
              value={
                settlementDate
                  ? t("date", { date: dateFromYYYYMMDD(settlementDate) })
                  : t("messages.notAvailable")
              }
            />
          </div>
        </div>
        <div className="md:col-start-2 md:row-start-1 md:row-end-3 lg:row-end-4 gap-4">
          <Card header={t("transactionsPage.details")}>
            <div className="flex flex-col px-2 my-1 divide-y">
              <DataRow
                label={t("transactionsPage.units")}
                value={t("number", { value: amount })}
              />
              <DataRow
                label={t("transactionsPage.unitPrice")}
                value={t("numberWithCurrency", {
                  value: unitPriceInSecurityCurrency,
                  currency: securityCurrencyCode,
                  formatParams: {
                    value: {
                      // do not round unit price to two decimals - business requirement
                      maximumFractionDigits: 10,
                    },
                  },
                })}
              />
              <DataRow
                label={t("transactionsPage.grossTradeAmount")}
                value={
                  <ValueInCurrencies
                    valueInSecurityCurrency={grossPriceInSecurityCurrency}
                    securityCurrencyCode={securityCurrencyCode}
                    valueInAccountCurrency={grossPriceInAccountCurrency}
                    accountCurrencyCode={account?.currency.accountCurrencyCode}
                  />
                }
              />
              <DataRow
                label={t("transactionsPage.cost")}
                value={t("numberWithCurrency", {
                  value: costInSecurityCurrency,
                  currency: securityCurrencyCode,
                })}
              />
              <DataRow
                label={t("transactionsPage.netTradeAmount")}
                value={
                  <ValueInCurrencies
                    valueInSecurityCurrency={tradeAmountInSecurityCurrency}
                    securityCurrencyCode={securityCurrencyCode}
                    valueInAccountCurrency={tradeAmountInAccountCurrency}
                    accountCurrencyCode={account?.currency.accountCurrencyCode}
                  />
                }
              />
              <DataRow
                label={t("transactionsPage.fxRate")}
                value={t("number", {
                  value: accountFxRate,
                  formatParams: {
                    value: {
                      minimumFractionDigits: 2,
                    },
                  },
                })}
              />
              <div></div>
            </div>
          </Card>
        </div>
        <div className="lg:col-start-3 lg:row-start-1 lg:row-end-2">
          <Card header={t("transactionsPage.security")}>
            <div className="flex flex-col px-2 my-1 divide-y">
              <DataRow
                label={t("transactionsPage.isin")}
                value={security?.isinCode ?? t("messages.notAvailable")}
              />
              <DataRow
                label={t("transactionsPage.marketplace")}
                value={
                  marketPlace?.name ??
                  security?.exchange?.name ??
                  t("messages.notAvailable")
                }
              />
            </div>
          </Card>
        </div>
        {/* on lg screens below row ends at 5th grid line (other lines ends at 4)
        to make up the height difference resulting from gap added we set mb-4 */}
        <div className="lg:col-start-3 lg:row-start-2 lg:row-end-5 lg:mb-4">
          <Card header={t("transactionsPage.description")}>
            <p className="p-2 text-base font-normal">
              {extInfo || t("messages.notAvailable")}
            </p>
          </Card>
        </div>
        {documents.length > 0 && (
          <div className="md:col-start-1 md:row-start-2 lg:row-start-3">
            <Button
              isFullWidth
              isLoading={downloading}
              LeftIcon={DocumentDownloadIcon}
              onClick={() => downloadDocument(documents[0].identifier)}
            >
              {transactionType === "transaction"
                ? t("transactionsPage.downloadFileButtonLabel")
                : t("ordersPage.downloadFileButtonLabel")}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

const useGetTransactionType = (): TransactionType => {
  const { transactionId } = useParams();

  if (transactionId) {
    return "transaction" as const;
  }
  return "order" as const;
};
