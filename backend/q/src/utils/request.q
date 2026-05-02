\d .kdbdash.request

normalize:{[req]
  if[99<>type req;
    :`ok`id`func`code`message`details!(
      0b;
      ::;
      ::;
      "invalid_request";
      "Request JSON must deserialize to an object";
      ::)
  ];

  requestId:.kdbdash.util.getOr[req;`id;::];

  if[not .kdbdash.util.hasKey[req;`func];
    :`ok`id`func`code`message`details!(
      0b;
      requestId;
      ::;
      "missing_func";
      "Request must include a func field";
      ::)
  ];

  funcText:.kdbdash.util.toText req[`func];
  if[0=count funcText;
    :`ok`id`func`code`message`details!(
      0b;
      requestId;
      ::;
      "missing_func";
      "Request func field cannot be empty";
      ::)
  ];

  :`ok`id`func`code`message`details!(
    1b;
    requestId;
    .kdbdash.util.toSymbol funcText;
    ::;
    ::;
    ::)
 }

\d .
