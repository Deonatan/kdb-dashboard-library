\d .kdb.registry

handlers:`symbol$()!();
meta:`symbol$()!();

clear:{
  handlers::`symbol$()!();
  meta::`symbol$()!();
  `registryCleared
 };

register:{[name; fn; descriptor]
  sym:.kdb.util.asSymbol name;
  handlers[sym]:fn;
  meta[sym]:descriptor;
  sym
 };

has:{[name]
  .kdb.util.asSymbol name in key handlers
 };

get:{[name]
  sym:.kdb.util.asSymbol name;
  if[not has sym; '"unknown function"];
  handlers sym
 };

list:{
  meta
 };

\d .
