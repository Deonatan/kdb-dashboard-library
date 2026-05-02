\d .kdbdash.ws

connections:`int$()

onOpen:{
  if[not x in connections;
    connections,:x
  ];

  :x
 }

onClose:{
  connections:connections except enlist x;
  :x
 }

onMessage:{
  .kdbdash.router.publish[.z.w;x]
 }

bind:{
  .z.wo:.kdbdash.ws.onOpen;
  .z.wc:.kdbdash.ws.onClose;
  .z.ws:.kdbdash.ws.onMessage;
  :`bound
 }

connectionCount:{
  count connections
 }

\d .
