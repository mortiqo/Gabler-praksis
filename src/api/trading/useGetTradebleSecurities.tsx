import { useReducer } from "react";
import { gql, useQuery } from "@apollo/client";
import { Option } from "../../components/Select/Select";
import { getFetchPolicyOptions } from "../utils";

const TRADABLE_SECURITIES_QUERY = gql`
  query GetTradableSecurities($countryCode: String, $securityType: String) {
    securities(
      tags: "Tradeable"
      countryCode: $countryCode
      securityType: $securityType
    ) {
      id
      name
      isinCode
      url
      url2
      country {
        id
        name
        code
      }
      type {
        id
        name
        code
      }
      currency {
        id
        securityCode
      }
    }
  }
`;

export interface TradableSecurity {
  id: number;
  name: string;
  isinCode: string;
  url: string;
  url2: string;
  currency: {
    securityCode: string;
  };
  country?: {
    code: string;
    name: string;
  };
  type?: {
    code: string;
    name: string;
  };
}

export interface TradableSecuritiesQuery {
  securities: TradableSecurity[];
}

interface TradableSecuritiesFilters {
  country: Option;
  type: Option;
}

const filtersReducer = (
  filters: TradableSecuritiesFilters,
  newFilters: Partial<TradableSecuritiesFilters>
) => ({ ...filters, ...newFilters });

const noFilterOption = {
  id: null,
  label: "-",
};

const initialFilters = {
  country: noFilterOption,
  type: noFilterOption,
};

// filters are temporary hardcoded, in future will be provided by API
const filtersOptions = {
  country: [
    noFilterOption,
    {
      id: "US",
      label: "USA",
    },
    {
      id: "SE",
      label: "Sweden",
    },
    {
      id: "FI",
      label: "Finland",
    },
  ],
  type: [
    noFilterOption,
    {
      label: "Collective investment vehicles",
      id: "C",
    },
    {
      label: "Fund",
      id: "FUND",
    },
    {
      label: "Stock",
      id: "STOCK",
    },
    {
      label: "Private Equity",
      id: "PE",
    },
    {
      label: "ETF",
      id: "ETFs",
    },
    {
      label: "Bond",
      id: "BOND",
    },
  ],
};

export const useGetTradebleSecurities = () => {
  const [filters, setFilters] = useReducer(filtersReducer, initialFilters);

  const { loading, error, data } = useQuery<TradableSecuritiesQuery>(
    TRADABLE_SECURITIES_QUERY,
    {
      variables: {
        countryCode: filters.country.id,
        securityType: filters.type.id,
      },
      ...getFetchPolicyOptions(
        `useGetTradebleSecurities.${filters.country.id}.${filters.type.id}`
      ),
    }
  );

  return {
    loading,
    error,
    data: data?.securities,
    filters,
    setFilters,
    filtersOptions,
  };
};
