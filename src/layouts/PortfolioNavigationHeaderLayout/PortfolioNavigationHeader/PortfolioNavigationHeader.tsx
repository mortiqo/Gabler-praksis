import { UserMenu, Logo, PortfolioSelect } from "components";
import {
  TOTAL_INVESTMENTS_OPTION_ID,
  useGetPortfolioOptions,
} from "hooks/useGetPortfolioOptions";
import { useGetContractIdData } from "providers/ContractIdProvider";
import { Navigate, useParams } from "react-router-dom";
import { useNavigateToPortfolioTab } from "./useNavigateToPortfolioTab";
import { useRedirectIfOnlyOnePortfolio } from "./useRedirectIfOnlyOnePortfolio";

export interface PortfolioOption {
  id: number;
  urlPrefix: string;
  label: string;
}

export const PortfolioNavigationHeader = () => {
  const portfolioOptions = useGetPortfolioOptions();
  const { portfolioId } = useParams();
  const navigateToPortfolioTab = useNavigateToPortfolioTab();
  useRedirectIfOnlyOnePortfolio();
  const onPortfolioChange = (selectedOption: PortfolioOption) => {
    navigateToPortfolioTab(selectedOption.urlPrefix);
  };
  const { selectedContact } = useGetContractIdData();
 
  const currentPortfolio = portfolioId
    ? parseInt(portfolioId, 10)
    : TOTAL_INVESTMENTS_OPTION_ID;

  // redirect to root when portfolioId does not match available portfolios
  if (
    currentPortfolio !== TOTAL_INVESTMENTS_OPTION_ID &&
    !portfolioOptions.some((option) => option.id === currentPortfolio)
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="z-20 pt-2 bg-white">
      <div className="container flex gap-2 items-center p-2 mx-auto">
        <Logo />
        <div className="flex-1">
          {portfolioOptions.length > 0 ? (
            <div className="sm:min-w-[350px] sm:w-fit">
              <PortfolioSelect
                portfolioOptions={portfolioOptions}
                portfolioId={currentPortfolio}
                onChange={onPortfolioChange}
              />
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="flex justify-end pag-2">
          <span className="self-center ml-4 text-xl font-bold text-gray-400">{selectedContact.initials}</span>
          <div className="px-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
};
