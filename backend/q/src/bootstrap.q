\l backend/q/src/config.q
\l backend/q/src/utils/base.q
\l backend/q/src/utils/request.q
\l backend/q/src/utils/response.q
\l backend/q/src/registry.q
\l backend/q/src/router.q
\l backend/q/src/websocket.q

.kdbdash.boot:{
  .kdbdash.state.startedAt:.z.P;
  .kdbdash.registry.clear[];
  .kdbdash.registry.loadAll .kdbdash.cfg.endpointDir;
  .kdbdash.ws.bind[];

  -1 "kdb dashboard library backend ready";
  -1 "registered endpoints:";
  show .kdbdash.registry.list[];

  :`ready
 }
