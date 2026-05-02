\d .kdbdash.endpoint

echo:{[req]
  `args`receivedAt!(
    .kdbdash.util.getArgs req;
    string .z.P)
 }

\d .

.kdbdash.registry.register[`echo;.kdbdash.endpoint.echo];
