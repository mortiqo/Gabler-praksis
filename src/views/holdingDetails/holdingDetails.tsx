import { HoldingPosition, SecurityDetailsPosition } from "api/holdings/types";
import { useGetContactInfo } from "api/initial/useGetContactInfo";
import {
  BackNavigationButton,
  Card,
  GainLoseColoring,
  Heading,
} from "components";
import { PageLayout } from "layouts/PageLayout/PageLayout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNameFromBackendTranslations } from "utils/transactions";
import { addProtocolToUrl } from "utils/url";
import { DataRow } from "./components/DataRow";
import { DocumentRow } from "./components/DocumentRow";
import { HoldingHeader } from "./components/HoldingHeader";
import { HoldingHistoryDataChart } from "./components/HoldingHistoryDataChart";
import { LineChartHeader } from "./components/LineChartHeader";

interface HoldingDetailsProps {
  data: Omit<HoldingPosition, "security"> & {
    security: SecurityDetailsPosition;
  };
}

export const HoldingDetails = ({
  data: {
    amount,
    purchaseTradeAmount,
    accruedInterest,
    marketValue,
    valueChangeRelative,
    valueChangeAbsolute,
    security: {
      name,
      isinCode,
      type: { namesAsMap, code: typeCode },
      latestMarketData,
      currency: { securityCode: currency },
      url,
      url2,
    },
  },
}: HoldingDetailsProps) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { data: { portfoliosCurrency } = { portfoliosCurrency: "EUR" } } =
    useGetContactInfo();

  return (
    <div className="flex overflow-hidden flex-col h-full">
      <Heading>
        <BackNavigationButton onClick={() => navigate(-1)} />
        {name ?? ""}
      </Heading>
      <div className="overflow-y-auto grow-1">
        <PageLayout>
          <div className="grid gap-4 md:grid-cols-[300px_auto] lg:grid-cols-[400px_auto] xl:grid-cols-[500px_auto]">
            <div className="md:col-start-2 md:row-start-1 lg:row-end-3">
              <Card
                header={
                  <LineChartHeader
                    price={latestMarketData?.price}
                    date={latestMarketData?.date}
                    currency={currency}
                  />
                }
              >
                <HoldingHistoryDataChart />
              </Card>
            </div>
            <Card
              header={
                <HoldingHeader
                  currency={portfoliosCurrency}
                  marketValue={marketValue}
                />
              }
            >
              <div className="flex flex-col px-2 my-1 divide-y">
                <DataRow
                  label={t("holdingsPage.units")}
                  value={t("number", { value: amount })}
                />
                <DataRow
                  label={t("holdingsPage.purchaseValue")}
                  value={t("numberWithCurrency", {
                    value: purchaseTradeAmount,
                    currency: portfoliosCurrency,
                  })}
                />
                {typeCode === "BOND" && (
                  <DataRow
                    label={t("holdingsPage.accruedInterest")}
                    value={t("numberWithCurrency", {
                      value: accruedInterest,
                      currency: portfoliosCurrency,
                    })}
                  />
                )}
                <DataRow
                  label={t("holdingsPage.marketValue")}
                  value={t("numberWithCurrency", {
                    value: marketValue,
                    currency: portfoliosCurrency,
                  })}
                />
                <DataRow
                  label={t("holdingsPage.changePercentage")}
                  value={
                    <GainLoseColoring value={valueChangeRelative}>
                      {`${t("number", {
                        value: valueChangeRelative,
                        formatParams: {
                          value: {
                            signDisplay: "always",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        },
                      })} %`}
                    </GainLoseColoring>
                  }
                />
                <DataRow
                  label={t("holdingsPage.unrealizedProfits")}
                  value={
                    <GainLoseColoring value={valueChangeRelative}>
                      {t("numberWithCurrency", {
                        value: valueChangeAbsolute,
                        currency: portfoliosCurrency,
                        formatParams: {
                          value: {
                            signDisplay: "always",
                          },
                        },
                      })}
                    </GainLoseColoring>
                  }
                />
              </div>
            </Card>
            <Card header={t("holdingsPage.security")}>
              <div className="flex flex-col px-2 my-1 divide-y">
                <DataRow
                  label={t("holdingsPage.type")}
                  value={getNameFromBackendTranslations(
                    namesAsMap,
                    typeCode,
                    i18n.language
                  )}
                />
                <DataRow label={t("holdingsPage.isinCode")} value={isinCode} />
                <DataRow label={t("holdingsPage.currency")} value={currency} />
                {url && (
                  <DocumentRow
                    label={t("holdingsPage.prospectus")}
                    url={addProtocolToUrl(url)}
                  />
                )}
                {url2 && (
                  <DocumentRow
                    label={t("holdingsPage.kiid")}
                    url={addProtocolToUrl(url2)}
                  />
                )}
              </div>
            </Card>
          </div>
        </PageLayout>
      </div>
    </div>
  );
};
