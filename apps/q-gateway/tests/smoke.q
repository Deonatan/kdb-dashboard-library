/ Lightweight smoke test for routing without opening the websocket listener.
system "l src/load.q";

.kdb.registry.clear[];
.kdb.boot.loadEndpoints[];

health:.kdb.router.handle "{\"id\":\"smoke-1\",\"func\":\"health.check\"}";
if[not health`ok; '"health.check smoke test failed"];

echo:.kdb.router.handle "{\"id\":\"smoke-2\",\"func\":\"debug.echo\",\"params\":{\"book\":\"macro\",\"limit\":5}}";
if[not echo`ok; '"debug.echo smoke test failed"];

snapshot:.kdb.router.handle "{\"id\":\"smoke-3\",\"func\":\"dashboard.snapshot\"}";
if[not snapshot`ok; '"dashboard.snapshot smoke test failed"];

show health;
show echo;
show snapshot;
