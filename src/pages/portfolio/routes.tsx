import { lazy } from "react";
import { TranslationText } from "components";
import { NavTabPath } from "layouts/NavTabLayout/NavTab/types";
import { NavTabLayout } from "layouts/NavTabLayout/NavTabLayout";
import { PortfolioNavigationHeaderLayout } from "layouts/PortfolioNavigationHeaderLayout/PortfolioNavigationHeaderLayout";
import { Navigate } from "react-router-dom";

const Overview = lazy(() =>
  import("./overview").then((module) => ({ default: module.OverviewPage }))
);
const Holdings = lazy(() =>
  import("./holdings").then((module) => ({ default: module.HoldingsView }))
);
const Holding = lazy(() =>
  import("./holdings/[holdingId]").then((module) => ({
    default: module.HoldingPage,
  }))
);
const HoldingBuy = lazy(() =>
  import("./holdings/[holdingId]/buy").then((module) => ({
    default: module.BuyPage,
  }))
);
const HoldingSell = lazy(() =>
  import("./holdings/[holdingId]/sell").then((module) => ({
    default: module.SellPage,
  }))
);
const Transactions = lazy(() =>
  import("./transactions").then((module) => ({
    default: module.TransactionsPage,
  }))
);
const TransactionDetails = lazy(() =>
  import("./transactions/[transactionId]").then((module) => ({
    default: module.TransactionDetailsPage,
  }))
);
const Orders = lazy(() =>
  import("./orders").then((module) => ({ default: module.OrdersPage }))
);
const OrderDetails = lazy(() =>
  import("./orders/[orderId]").then((module) => ({
    default: module.OrderDetailsPage,
  }))
);
const Documents = lazy(() =>
  import("./documents").then((module) => ({ default: module.DocumentsPage }))
);
const Contact = lazy(() =>
  import("./contact").then((module) => ({ default: module.ContactPage }))
);

export const portfolioTabRoutes: NavTabPath[] = [
  {
    path: "overview",
    tabLabel: <TranslationText translationKey="navTab.tabs.overview" />,
    tabComponent: <Overview />,
    element: null,
  },
  {
    path: "holdings",
    tabLabel: <TranslationText translationKey="navTab.tabs.holdings" />,
    tabComponent: <Holdings />,
    element: null,
  },
  {
    path: "transactions",
    tabLabel: <TranslationText translationKey="navTab.tabs.transactions" />,
    tabComponent: <Transactions />,
    element: null,
  },
  {
    path: "orders",
    tabLabel: <TranslationText translationKey="navTab.tabs.orders" />,
    tabComponent: <Orders />,
    element: null,
  },
  {
    path: "documents",
    tabLabel: <TranslationText translationKey="navTab.tabs.documents" />,
    tabComponent: <Documents />,
    element: null,
  },
  {
    path: "contact",
    tabLabel: <TranslationText translationKey="navTab.tabs.contact" />,
    tabComponent: <Contact />,
    element: null,
  },
];

export const portfolioRoutes = [
  {
    path: "portfolio/:portfolioId",
    children: [
      {
        path: "",
        element: <Navigate to="overview" replace />,
      },
      {
        path: "",
        element: <PortfolioNavigationHeaderLayout />,
        children: [
          {
            path: "",
            element: <NavTabLayout routes={portfolioTabRoutes} />,
            children: portfolioTabRoutes,
          },
        ],
      },
      {
        path: "holdings/:holdingId",
        element: <Holding />,
      },
      {
        path: "holdings/:holdingId/buy",
        element: <HoldingBuy />,
      },
      {
        path: "holdings/:holdingId/sell",
        element: <HoldingSell />,
      },
      {
        path: "transactions/:transactionId",
        element: <TransactionDetails />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetails />,
      },
    ],
  },
];
