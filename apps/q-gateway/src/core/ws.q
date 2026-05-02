\d .kdb.ws

clients:`int$();

onOpen:{[h]
  clients,:enlist h;
  0N! "websocket open: ",string h;
  h
 };

onClose:{[h]
  clients:clients except enlist h;
  0N! "websocket close: ",string h;
  h
 };

send:{[h; payload]
  neg[h] .kdb.json.stringify payload
 };

broadcast:{[payload]
  {send[x; payload]} each clients;
  count clients
 };

onMessage:{[raw]
  reply:.[.kdb.router.handle; enlist raw; {[err] .kdb.response.fail[""; "transport"; "internal"; err; .kdb.util.emptyDict[]]}];
  send[.z.w; reply]
 };

install:{
  .z.wo::.kdb.ws.onOpen;
  .z.wc::.kdb.ws.onClose;
  .z.ws::.kdb.ws.onMessage;
  `callbacksInstalled
 };

\d .
