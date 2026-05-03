.kdb.response.ok:{[id; func; data]
  `id`ok`func`data`server`ts!(
    .kdb.util.asText[id];
    1b;
    .kdb.util.asText[func];
    data;
    .kdb.cfg.serviceName[];
    string .z.p
  )
 };

.kdb.response.fail:{[id; func; code; message; details]
  `id`ok`func`error`server`ts!(
    .kdb.util.asText[id];
    0b;
    .kdb.util.asText[func];
    `code`message`details!(
      .kdb.util.asText[code];
      .kdb.util.asText[message];
      details
    );
    .kdb.cfg.serviceName[];
    string .z.p
  )
 };
