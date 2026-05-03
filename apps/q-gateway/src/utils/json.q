.kdb.json.normalize:{[raw]
  $[.kdb.util.isText[raw]; raw; .kdb.util.isBytes[raw]; "c"$ raw; '"Unsupported websocket payload type"]
 };

.kdb.json.parse:{[raw]
  .j.k .kdb.json.normalize[raw]
 };

.kdb.json.stringify:{[payload]
  .j.j payload
 };
