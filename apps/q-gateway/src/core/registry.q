.kdb.registry.handlers:`symbol$()!();
.kdb.registry.meta:`symbol$()!();

.kdb.registry.clear:{
  .kdb.registry.handlers::`symbol$()!();
  .kdb.registry.meta::`symbol$()!();
  `registryCleared
 };

.kdb.registry.register:{[name; fn; descriptor]
  sym:.kdb.util.asSymbol[name];
  .kdb.registry.handlers:.kdb.registry.handlers,enlist[sym]!enlist fn;
  .kdb.registry.meta:.kdb.registry.meta,enlist[sym]!enlist descriptor;
  sym
 };

.kdb.registry.has:{[name]
  .kdb.util.asSymbol[name] in key .kdb.registry.handlers
 };

.kdb.registry.get:{[name]
  sym:.kdb.util.asSymbol[name];
  if[not .kdb.registry.has[sym]; '"unknown function"];
  .kdb.registry.handlers sym
 };

.kdb.registry.list:{
  .kdb.registry.meta
 };
