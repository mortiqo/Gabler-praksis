import { useMemo } from "react";
import { ORDER_STATUS } from "api/orders/enums";
import { OrderStatus, TradeOrder } from "api/orders/types";
import { useTranslation } from "react-i18next";

const ORDER_STATUSES_TO_DISPLAY = [
  ORDER_STATUS.Open,
  ORDER_STATUS.Accepted,
  ORDER_STATUS["In execution"],
  ORDER_STATUS.Cancelled,
] as const;

type OrderStatusToDisplayType = typeof ORDER_STATUSES_TO_DISPLAY[number];

const isOrderStatusToDisplayType = (
  status: string
): status is OrderStatusToDisplayType => {
  return (ORDER_STATUSES_TO_DISPLAY as readonly string[]).includes(status);
};

const assertUnreachable = (_x: never): never => {
  throw new Error("Didn't expect to get here");
};

const getOrderStatusLabelKey = (orderStatus: OrderStatusToDisplayType) => {
  switch (orderStatus) {
    case ORDER_STATUS.Open: {
      return "ordersPage.open";
    }
    case ORDER_STATUS["In execution"]: {
      return "ordersPage.inExecution";
    }
    case ORDER_STATUS.Accepted: {
      return "ordersPage.accepted";
    }
    case ORDER_STATUS.Cancelled: {
      return "ordersPage.cancelled";
    }
    default: {
      assertUnreachable(orderStatus);
      return "";
    }
  }
};

export interface TradeOrdersGroup {
  type: OrderStatus;
  label: string;
  tradeOrders: TradeOrder[];
}

export const useGroupedTradeOrdersByStatus = (tradeOrders: TradeOrder[]) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const grouped: TradeOrdersGroup[] = [];
    ORDER_STATUSES_TO_DISPLAY.forEach((orderStatus) => {
      grouped.push({
        type: orderStatus,
        label: t(getOrderStatusLabelKey(orderStatus)),
        tradeOrders: [],
      });
    });

    tradeOrders.forEach((tradeOrder) => {
      const orderStatus = tradeOrder.orderStatus;

      if (isOrderStatusToDisplayType(orderStatus)) {
        const indexOfGrouped = grouped.findIndex(
          (group) => group.type === orderStatus
        );

        grouped[indexOfGrouped].tradeOrders.push(tradeOrder);
      }
    });
    return grouped;
  }, [tradeOrders, t]);
};
