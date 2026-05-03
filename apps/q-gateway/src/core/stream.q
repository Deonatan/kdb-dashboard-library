.kdb.stream.intervalMs:1000;
.kdb.stream.maxTicks:12;
.kdb.stream.sequence:0;
.kdb.stream.symbols:("AAPL";"MSFT";"NVDA";"GS";"JPM";"SPY");
.kdb.stream.basePrices:194.10 421.00 957.10 401.55 201.03 525.02f;
.kdb.stream.deltaPattern:0.18 -0.12 0.09 -0.05 0.22 -0.08 0.14 -0.11 0.07f;
.kdb.stream.priceOffsets:0.00 0.14 0.27 0.19 0.36 0.29 0.41 0.33 0.48 0.44 0.39 0.52f;
.kdb.stream.volumePattern:0.8 1.1 1.4 0.9 1.7 2.2 1.5 1.3 1.9 2.4 1.6 1.2f;
.kdb.stream.tapeRows:();
.kdb.stream.tapeSubscribers:`int$();

.kdb.stream.hasHandle:{[handle]
  not handle~0Ni
 };

.kdb.stream.rowAt:{[sequenceNo]
  symbolIndex:sequenceNo mod count .kdb.stream.symbols;
  deltaIndex:sequenceNo mod count .kdb.stream.deltaPattern;
  offsetIndex:sequenceNo mod count .kdb.stream.priceOffsets;
  volumeIndex:sequenceNo mod count .kdb.stream.volumePattern;
  symbol:.kdb.stream.symbols symbolIndex;
  basePrice:.kdb.stream.basePrices symbolIndex;
  lastPrice:basePrice + (.kdb.stream.priceOffsets offsetIndex);
  changeValue:.kdb.stream.deltaPattern deltaIndex;
  volumeValue:.kdb.stream.volumePattern volumeIndex;
  `ts`symbol`price`change`volume!(string .z.T; symbol; lastPrice; changeValue; volumeValue)
 };

.kdb.stream.pushRow:{[row]
  updatedRows:(enlist row),.kdb.stream.tapeRows;
  .kdb.stream.tapeRows::.kdb.stream.maxTicks# updatedRows;
  .kdb.stream.tapeRows
 };

.kdb.stream.eventId:{
  "stream.tape-",string .kdb.stream.sequence
 };

.kdb.stream.tapePayload:{[statusText]
  `channel`status`sequence`lastUpdated`ticks!(
    "stream.tape";
    statusText;
    .kdb.stream.sequence;
    string .z.p;
    .kdb.stream.tapeRows
  )
 };

.kdb.stream.broadcastTape:{
  payload:.kdb.response.ok[.kdb.stream.eventId[]; "stream.tape"; .kdb.stream.tapePayload["streaming"]];
  {.kdb.ws.send[x; payload]} each .kdb.stream.tapeSubscribers;
  count .kdb.stream.tapeSubscribers
 };

.kdb.stream.advance:{
  .kdb.stream.sequence::.kdb.stream.sequence + 1;
  .kdb.stream.pushRow[.kdb.stream.rowAt[.kdb.stream.sequence]]
 };

.kdb.stream.seedTape:{
  seedIndexes:reverse til .kdb.stream.maxTicks;
  .kdb.stream.sequence::0;
  .kdb.stream.tapeRows::();
  {[sequenceNo] .kdb.stream.pushRow[.kdb.stream.rowAt[sequenceNo]]} each seedIndexes;
  .kdb.stream.sequence::.kdb.stream.maxTicks - 1;
  .kdb.stream.tapeRows
 };

.kdb.stream.unsubscribeClient:{[handle]
  .kdb.stream.tapeSubscribers::.kdb.stream.tapeSubscribers except enlist handle;
  count .kdb.stream.tapeSubscribers
 };

.kdb.stream.subscribeCurrentTape:{
  handle:.kdb.ws.current[];
  if[.kdb.stream.hasHandle[handle];
    updatedSubscribers:.kdb.stream.tapeSubscribers,enlist handle;
    .kdb.stream.tapeSubscribers::distinct updatedSubscribers
  ];
  .kdb.stream.tapePayload["subscribed"]
 };

.kdb.stream.unsubscribeCurrentTape:{
  handle:.kdb.ws.current[];
  if[.kdb.stream.hasHandle[handle];
    .kdb.stream.unsubscribeClient[handle]
  ];
  .kdb.stream.tapePayload["stopped"]
 };

.kdb.stream.onTick:{
  .kdb.stream.advance[];
  if[count .kdb.stream.tapeSubscribers;
    .kdb.stream.broadcastTape[]
  ];
  count .kdb.stream.tapeSubscribers
 };

.kdb.stream.init:{
  timerCommand:"t ",string .kdb.stream.intervalMs;
  .kdb.stream.tapeSubscribers::`int$();
  .kdb.stream.seedTape[];
  .z.ts::.kdb.stream.onTick;
  system[timerCommand];
  `streamReady
 };
