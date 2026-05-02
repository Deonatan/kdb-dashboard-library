\d .kdb.json

normalize:{[raw]
  $[.kdb.util.isText raw; raw; .kdb.util.isBytes raw; "c"$ raw; '"Unsupported websocket payload type"]
 };

parse:{[raw]
  .j.k normalize raw
 };

stringify:{[payload]
  .j.j payload
 };

\d .
