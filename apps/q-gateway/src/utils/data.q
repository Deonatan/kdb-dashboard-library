.kdb.util.isBytes:{4h=type x};
.kdb.util.isDict:{99h=type x};
.kdb.util.isSymbol:{-11h=type x};
.kdb.util.isText:{10h=type x};

.kdb.util.asSymbol:{[x]
  $[.kdb.util.isSymbol[x]; x; `$ .kdb.util.asText[x]]
 };

.kdb.util.asText:{[x]
  $[.kdb.util.isText[x]; x; .kdb.util.isSymbol[x]; string x; .kdb.util.isBytes[x]; "c"$ x; string x]
 };

.kdb.util.emptyDict:{()!()};

.kdb.util.getOr:{[dict; dictKey; fallback]
  $[.kdb.util.isDict[dict]; $[dictKey in key dict; dict dictKey; fallback]; fallback]
 };

.kdb.util.asParams:{[inputValue]
  $[.kdb.util.isDict[inputValue]; inputValue; enlist[`value]!enlist inputValue]
 };
