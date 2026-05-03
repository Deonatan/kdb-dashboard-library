.kdb.boot.loadEndpoints:{
  root:.kdb.cfg.endpointRoot[];
  dir:hsym `$ root,"/";
  files:key dir;
  if[0h=type files; '"endpoint directory not found"];

  qfiles:asc files where files like "*.q";
  {[root; file] system "l ",root,"/",string file}[root;] each qfiles;
  qfiles
 };

.kdb.boot.listen:{
  port:.kdb.util.asText[.kdb.cfg.port[]];
  cmd:"p ",port;
  system[cmd];
  port
 };

.kdb.boot.start:{
  .kdb.registry.clear[];
  loaded:.kdb.boot.loadEndpoints[];
  .kdb.stream.init[];
  .kdb.ws.install[];
  port:.kdb.boot.listen[];
  0N! .kdb.cfg.serviceName[]," listening on port ",port;
  if[count loaded; 0N! "Loaded endpoints: ",", " sv string each loaded];
  `started
 };
