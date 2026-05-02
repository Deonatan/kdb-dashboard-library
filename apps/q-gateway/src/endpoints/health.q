.kdb.registry.register[
  `health.check;
  {[_]
    `status`service`timestamp!(
      "ok";
      .kdb.cfg.serviceName[];
      string .z.p
    )
  };
  `name`description`group!(
    "health.check";
    "Returns a basic health payload so the frontend can verify connectivity.";
    "system"
  )
];
