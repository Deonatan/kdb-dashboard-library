.kdb.registry.register[
  `dashboard.snapshot;
  {[_]
    `overview`allocation`priceSeries`volumeSeries`movers!(
      ([] label:`NetExposure`DayPnL`VaR95`GrossNotional; value:("42.8M";"+1.28M";"3.7M";"88.4M"); tone:`accent`positive`warning`neutral);
      ([] bucket:`Equities`Rates`FX`Commodities; value:44 22 18 16f);
      ([] ts:("09:30";"09:45";"10:00";"10:15";"10:30";"10:45";"11:00";"11:15"); px:193.10 193.42 193.58 193.23 193.81 194.07 193.96 194.22);
      ([] bucket:("09:30";"09:45";"10:00";"10:15";"10:30";"10:45";"11:00";"11:15"); volume:1.1 1.8 1.5 2.3 1.9 2.0 1.4 1.7);
      ([] symbol:`AAPL`MSFT`NVDA`GS`JPM`SPY; last:194.22 421.14 957.61 401.82 201.11 525.34; change:1.42 -0.61 2.83 0.74 -0.12 0.57; pct:0.74 -0.14 0.30 0.18 -0.06 0.11; volume:12.3 9.8 15.6 4.4 5.1 18.2)
    )
  };
  `name`description`group!(
    "dashboard.snapshot";
    "Provides a finance-oriented demo payload for the React dashboard starter.";
    "dashboard"
  )
];
