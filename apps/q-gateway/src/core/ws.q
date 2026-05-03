.kdb.ws.clients:`int$();

.kdb.ws.onOpen:{[h]
  .kdb.ws.clients,:enlist h;
  0N! "websocket open: ",string h;
  h
 };

.kdb.ws.onClose:{[h]
  .kdb.ws.clients:.kdb.ws.clients except enlist h;
  0N! "websocket close: ",string h;
  h
 };

.kdb.ws.send:{[h; payload]
  neg[h] .kdb.json.stringify[payload]
 };

.kdb.ws.broadcast:{[payload]
  {.kdb.ws.send[x; payload]} each .kdb.ws.clients;
  count .kdb.ws.clients
 };

.kdb.ws.onMessage:{[raw]
  reply:.[.kdb.router.handle; enlist raw; {[err] .kdb.response.fail[""; "transport"; "internal"; err; .kdb.util.emptyDict[]]}];
  .kdb.ws.send[.z.w; reply]
 };

.kdb.ws.install:{
  .z.wo::.kdb.ws.onOpen;
  .z.wc::.kdb.ws.onClose;
  .z.ws::.kdb.ws.onMessage;
  `callbacksInstalled
 };
