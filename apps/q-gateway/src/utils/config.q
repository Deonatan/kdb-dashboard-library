.kdb.cfg.defaults:`port`endpointRoot`serviceName!("5050";"src/endpoints";"kdb-dashboard-library");

.kdb.cfg.all:{
  cfg:.kdb.cfg.defaults;
  opts:.Q.opt .z.x;
  if[count key opts; cfg[key opts]:value opts];
  cfg
 };

.kdb.cfg.get:{[configKey]
  cfg:.kdb.cfg.all[];
  if[not configKey in key cfg; '"unknown config key"];
  cfg configKey
 };

.kdb.cfg.port:{.kdb.cfg.get[`port]};
.kdb.cfg.endpointRoot:{.kdb.cfg.get[`endpointRoot]};
.kdb.cfg.serviceName:{.kdb.cfg.get[`serviceName]};
