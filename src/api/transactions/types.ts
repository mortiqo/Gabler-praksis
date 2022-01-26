export interface Transaction {
  id: number;
  transactionDate: string;
  type: {
    typeName: string;
    typeNamesAsMap: Record<string, string>;
    cashFlowEffect: number;
  };
  tradeAmountInPortfolioCurrency: number;
  securityName: string;
  parentPortfolio: {
    name: string;
    currency: {
      securityCode: string;
    };
  };
}

export interface PortfolioTransactionsQuery {
  portfolio: {
    transactions: Transaction[];
  };
}

export interface AllPortfoliosTransactionsQuery {
  contact: {
    transactions: Transaction[];
  };
}

export interface TransactionDetails extends Transaction {
  amount: number;
  security: {
    isinCode: string;
  };
  settlementDate: Date;
  unitPrice: number;
  grossPrice: number;
  totalCost: number;
  tradeAmount: number;
  currencyCode: string;
}

export interface TransactionDetailsQuery {
  transaction: TransactionDetails;
}