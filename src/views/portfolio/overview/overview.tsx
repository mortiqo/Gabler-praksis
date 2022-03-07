import { DetailedPortfolio } from "api/overview/types";
import { useGetPortfolio } from "api/overview/useGetPortfolio";
import { Card, QueryLoadingWrapper } from "components";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PieChart } from "../../../components/PieChart/PieChart";
import { PortfolioInfoCard } from "../../overview/components/PortfolioInfoCard";
import { ListedSecuritiesCard } from "./components/ListedSecuritiesCard";
import { useGetChartData } from "./hooks/useGetChartData";
import { useSecuritiesSummary } from "./hooks/useSecuritiesSummary";

export const OverviewView = () => {
  const { portfolioId } = useParams();
  const queryData = useGetPortfolio(portfolioId);

  return <QueryLoadingWrapper {...queryData} SuccessComponent={Overview} />;
};

interface OverviewProps {
  data: DetailedPortfolio;
}

const Overview = ({ data }: OverviewProps) => {
  const { t } = useTranslation();

  const {
    portfolioReport: {
      portfolio: {
        currency: { securityCode },
      },
    },
  } = data;

  const { topSecurities, worstSecurities } = useSecuritiesSummary(
    data.portfolioReport.securityPositions
  );

  const chartData = useGetChartData(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-2">
      <div>
        <PortfolioInfoCard
          {...data.portfolioReport}
          name={data.name}
          colorScheme="blue"
        />
      </div>
      <ListedSecuritiesCard
        label={t("overviewPage.top3Holdings")}
        securities={topSecurities}
        currency={securityCode}
      />
      <ListedSecuritiesCard
        label={t("overviewPage.worst3Holdings")}
        securities={worstSecurities}
        currency={securityCode}
      />
      <div className="md:col-start-2 md:row-start-1 md:row-end-3 lg:row-end-4">
        <Card header="Security type allocation">
          <div className="pt-4 grow min-h-[300px]">
            <PieChart {...chartData} />
          </div>
        </Card>
      </div>
    </div>
  );
};
