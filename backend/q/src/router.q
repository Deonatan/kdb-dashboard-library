\d .kdbdash.router

handle:{[raw]
  parsed:.kdbdash.util.tryParseJson raw;
  if[not parsed[`ok];
    : .kdbdash.response.error[
      ::;
      ::;
      `invalid_json;
      "Unable to parse JSON request";
      parsed[`error]]
  ];

  req:parsed[`data];
  normalized:.kdbdash.request.normalize req;
  if[not normalized[`ok];
    : .kdbdash.response.error[
      normalized[`id];
      normalized[`func];
      normalized[`code];
      normalized[`message];
      normalized[`details]]
  ];

  requestId:normalized[`id];
  func:normalized[`func];

  if[not .kdbdash.registry.exists func;
    : .kdbdash.response.error[
      requestId;
      func;
      `unknown_func;
      "No endpoint is registered for the requested func";
      string func]
  ];

  handler:.kdbdash.registry.get func;
  result:.kdbdash.util.tryCall[handler;req];

  if[not result[`ok];
    : .kdbdash.response.error[
      requestId;
      func;
      `endpoint_error;
      "Endpoint execution failed";
      result[`error]]
  ];

  : .kdbdash.response.success[requestId;func;result[`data]]
 }

publish:{[handle;raw]
  neg[handle] (.j.j .kdbdash.router.handle[raw]);
 }

\d .
