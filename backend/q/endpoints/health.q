\d .kdbdash.endpoint

health:{[req]
  `status`service`startedAt`serverTime`activeConnections`registeredEndpoints!(
    "ok";
    .kdbdash.cfg.serviceName;
    string .kdbdash.state.startedAt;
    string .z.P;
    .kdbdash.ws.connectionCount[];
    string each .kdbdash.registry.list[])
 }

\d .

.kdbdash.registry.register[`health;.kdbdash.endpoint.health];
