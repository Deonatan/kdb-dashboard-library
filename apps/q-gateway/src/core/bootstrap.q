\d .kdb.boot

loadEndpoints:{
  root:.kdb.cfg.endpointRoot[];
  dir:hsym `$ root,"/";
  files:key dir;
  if[0h=type files; '"endpoint directory not found"];

  qfiles:asc files where files like "*.q";
  {system "l ",root,"/",string x} each qfiles;
  qfiles
 };

listen:{
  port:string value .kdb.cfg.port[];
  system "p ",port;
  port
 };

start:{
  .kdb.registry.clear[];
  loaded:loadEndpoints[];
  .kdb.ws.install[];
  port:listen[];
  0N! .kdb.cfg.serviceName[]," listening on port ",port;
  if[count loaded; 0N! "Loaded endpoints: ",", " sv string each loaded];
  `started
 };

\d .
