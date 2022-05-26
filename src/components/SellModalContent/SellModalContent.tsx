import { HTMLAttributes, MutableRefObject, ReactNode, useState } from "react";
import { useGetPortfolioHoldingDetails } from "api/holdings/useGetPortfolioHoldingDetails";
import { useGetContactInfo } from "api/initial/useGetContactInfo";
import classNames from "classnames";
import {
  PortfolioSelect,
  DownloadableDocument,
  Button,
  Input,
  HorizontalRadio,
} from "components/index";
import { useGetPortfolioOptions } from "hooks/useGetPortfolioOptions";
import { useModifiedTranslation } from "hooks/useModifiedTranslation";
import { useParams } from "react-router-dom";
import { Slide, toast } from "react-toastify";
import { useTradeAmountInput } from "./useTradeAmountInput";

export interface SellModalInitialData {
  holdingId?: string;
  securityName?: string;
  url2?: string;
}

interface SellModalProps extends SellModalInitialData {
  modalInitialFocusRef: MutableRefObject<null>;
}

const SELL_MODAL_ERROR_TOAST_ID = "SELL_MODAL_ERROR_TOAST_ID";

export const SellModalContent = ({
  holdingId,
  securityName,
  url2,
  modalInitialFocusRef,
}: SellModalProps) => {
  const { t } = useModifiedTranslation();
  const { portfolioId: urlPortfolioId } = useParams();
  const portfolioOptions = useGetPortfolioOptions(false);
  const [portfolioId, setPortfolioId] = useState(
    urlPortfolioId ? parseInt(urlPortfolioId, 10) : portfolioOptions[0].id
  );

  const { data: { portfoliosCurrency: currency = "EUR" } = {} } =
    useGetContactInfo();
  const {
    loading,
    error,
    data: { marketValue = 0 } = {},
  } = useGetPortfolioHoldingDetails(portfolioId.toString(), holdingId);

  const {
    inputValue,
    setInputState,
    inputModesOptions,
    inputMode,
    isTradeAmountCorrect,
    tradeAmount,
    setTradeAmountToAll,
    setTradeAmountToHalf,
    onInputModeChange,
  } = useTradeAmountInput(marketValue, currency);

  if (error) {
    toast.error(t("tradingModal.queryErrorWarning"), {
      toastId: SELL_MODAL_ERROR_TOAST_ID,
      position: toast.POSITION.BOTTOM_CENTER,
      hideProgressBar: true,
      theme: "colored",
      transition: Slide,
      autoClose: false,
    });
  }

  return (
    <div className="grid gap-2 min-w-[min(84vw,_375px)]">
      <LabeledDiv
        label={t("tradingModal.securityName")}
        className="text-2xl font-semibold"
      >
        {securityName}
      </LabeledDiv>
      {url2 && (
        <div className="w-fit">
          <DownloadableDocument url={url2} label={t("tradingModal.kiid")} />
        </div>
      )}
      <PortfolioSelect
        portfolioId={portfolioId}
        onChange={(newPortfolio) => setPortfolioId(newPortfolio.id)}
        includeTotal={false}
        label={t("tradingModal.portfolio")}
      />
      <LabeledDiv
        label={t("tradingModal.currentMarketValue")}
        className="text-xl font-semibold text-gray-700"
      >
        {currency &&
          t("numberWithCurrency", {
            value: marketValue,
            currency: currency,
          })}
      </LabeledDiv>
      <Input
        ref={modalInitialFocusRef}
        value={inputValue || ""}
        onChange={(event) => {
          setInputState((previousState) => ({
            ...previousState,
            inputValue: Number(event.currentTarget.value),
          }));
        }}
        label={t("tradingModal.tradeAmountInputLabel", {
          currency: inputMode.label,
        })}
        type="number"
        error={
          !isTradeAmountCorrect && !loading
            ? t("tradingModal.tradeAmountInputError")
            : undefined
        }
      />
      <div className="flex justify-between">
        <div className="flex gap-1 items-center">
          <Button size="xs" variant="Secondary" onClick={setTradeAmountToAll}>
            Sell all
          </Button>
          <Button size="xs" variant="Secondary" onClick={setTradeAmountToHalf}>
            Sell half
          </Button>
        </div>
        <HorizontalRadio
          options={inputModesOptions}
          value={inputMode}
          onChange={onInputModeChange}
        />
      </div>
      <hr className="my-2" />
      <div className="flex flex-col gap-4 items-stretch ">
        <div className="text-3xl font-semibold text-center">
          <div className="text-base font-normal">
            {t("tradingModal.tradeAmount")}
          </div>
          {t("numberWithCurrency", {
            value: isTradeAmountCorrect ? tradeAmount : 0,
            currency,
          })}
        </div>
        <Button
          disabled={tradeAmount === 0 || loading || !isTradeAmountCorrect}
        >
          {t("tradingModal.sellModalHeader")}
        </Button>
      </div>
    </div>
  );
};

interface LabeledDivProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  children: ReactNode;
}

const LabeledDiv = ({
  label,
  children,
  className,
  ...rest
}: LabeledDivProps) => (
  <div className={classNames(className, "leading-7")} {...rest}>
    <div className="text-sm font-normal">{label}</div>
    {children}
  </div>
);
