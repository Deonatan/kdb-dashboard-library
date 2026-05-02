\d .kdbdash.response

funcText:{[func]
  $[null func; ""; string func]
 }

meta:{
  `timestamp`service!(
    string .z.P;
    .kdbdash.cfg.serviceName)
 }

success:{[requestId;func;data]
  `ok`id`func`data`meta!(
    1b;
    requestId;
    funcText func;
    data;
    meta[])
 }

error:{[requestId;func;code;message;details]
  `ok`id`func`error`meta!(
    0b;
    requestId;
    funcText func;
    `code`message`details!(
      string code;
      string message;
      details);
    meta[])
 }

\d .
