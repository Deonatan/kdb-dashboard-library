\d .kdb.cfg

defaults:`port`endpointRoot`serviceName!("5050";"src/endpoints";"kdb-dashboard-library");

all:{
  cfg:defaults;
  opts:.Q.opt .z.x;
  if[count key opts; cfg[key opts]:value opts];
  cfg
 };

get:{[key]
  cfg:all[];
  if[not key in key cfg; '"unknown config key"];
  cfg key
 };

port:{get `port};
endpointRoot:{get `endpointRoot};
serviceName:{get `serviceName};

\d .
