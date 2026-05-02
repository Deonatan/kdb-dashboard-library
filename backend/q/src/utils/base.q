\d .kdbdash.util

hasKey:{[d;k]
  k in key d
 }

getOr:{[d;k;default]
  $[hasKey[d;k]; d[k]; default]
 }

toText:{
  string x
 }

toSymbol:{
  `$string x
 }

parseJson:{
  if[4=type x;
    '"Binary websocket frames are not supported for JSON routing"
  ];
  .j.k toText x
 }

tryParseJson:{[raw]
  @[
    {`ok`data`error!(1b;parseJson x;::)};
    raw;
    {`ok`data`error!(0b;::;string x)}
  ]
 }

tryCall:{[fn;arg]
  @[
    {`ok`data`error!(1b;fn x;::)};
    arg;
    {`ok`data`error!(0b;::;string x)}
  ]
 }

getArgs:{[req]
  present:.kdbdash.cfg.requestArgKeys where .kdbdash.cfg.requestArgKeys in key req;
  $[0=count present; ()!(); req[first present]]
 }

\d .
