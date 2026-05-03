.kdb.router.requestId:{[payload]
  .kdb.util.asText[.kdb.util.getOr[payload; `id; ""]]
 };

.kdb.router.requestFunc:{[payload]
  .kdb.util.asText[.kdb.util.getOr[payload; `func; ""]]
 };

.kdb.router.requestParams:{[payload]
  .kdb.util.asParams[.kdb.util.getOr[payload; `params; .kdb.util.emptyDict[]]]
 };

.kdb.router.route:{[payload]
  id:.kdb.router.requestId[payload];
  funcText:.kdb.router.requestFunc[payload];
  if[0=count funcText; : .kdb.response.fail[id; "unknown"; "invalidRequest"; "Request is missing the func field"; .kdb.util.emptyDict[]]];

  funcName:.kdb.util.asSymbol[funcText];
  if[not .kdb.registry.has[funcName]; : .kdb.response.fail[id; funcText; "unknownFunction"; "No endpoint is registered for the requested func"; .kdb.util.emptyDict[]]];

  fn:.kdb.registry.get[funcName];
  params:.kdb.router.requestParams[payload];
  outcome:.[{[callable; arg] `ok`data!(1b; callable[arg])}; (fn; params); {[err] `ok`error!(0b; err)}];

  $[outcome `ok; .kdb.response.ok[id; funcText; outcome `data]; .kdb.response.fail[id; funcText; "runtime"; outcome `error; .kdb.util.emptyDict[]]]
 };

.kdb.router.handle:{[raw]
  decoded:.[{[input] `ok`payload!(1b; .kdb.json.parse[input])}; enlist raw; {[err] `ok`error!(0b; err)}];
  if[not decoded `ok; : .kdb.response.fail[""; "unknown"; "invalidJson"; decoded `error; .kdb.util.emptyDict[]]];

  payload:decoded `payload;
  if[not .kdb.util.isDict[payload]; : .kdb.response.fail[""; "unknown"; "invalidPayload"; "JSON payload must decode to an object"; .kdb.util.emptyDict[]]];

  .kdb.router.route[payload]
 };
