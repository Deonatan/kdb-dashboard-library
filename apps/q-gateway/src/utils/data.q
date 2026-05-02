\d .kdb.util

isBytes:{4h=type x};
isDict:{99h=type x};
isSymbol:{-11h=type x};
isText:{10h=type x};

asSymbol:{[x]
  $[isSymbol x; x; `$ asText x]
 };

asText:{[x]
  $[isText x; x; isSymbol x; string x; isBytes x; "c"$ x; string x]
 };

emptyDict:{()!()};

getOr:{[dict; key; fallback]
  $[isDict dict; $[key in key dict; dict key; fallback]; fallback]
 };

asParams:{[value]
  $[isDict value; value; enlist[`value]!enlist value]
 };

\d .
