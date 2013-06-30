#!/usr/bin/env node
var optimist, plv8x, argv, conString, ref$, pgsock, pgrest, join$ = [].join;
optimist = require('optimist');
plv8x = require('plv8x');
argv = optimist.argv;
conString = argv.db || process.env['PLV8XCONN'] || process.env['PLV8XDB'] || process.env.TESTDBNAME || ((ref$ = process.argv) != null ? ref$[2] : void 8);
if (!conString) {
  console.log("ERROR: Please set the PLV8XDB environment variable, or pass in a connection string as an argument");
  process.exit();
}
pgsock = argv.pgsock;
if (pgsock) {
  conString = {
    host: pgsock,
    database: conString
  };
}
pgrest = require('..');
pgrest['new'](conString, {}, function(plx){
  var ref$, mountDefault, withPrefix, port, prefix, host, express, app, cors, gzippo, connectCsv;
  ref$ = pgrest.routes(), mountDefault = ref$.mountDefault, withPrefix = ref$.withPrefix;
  if (argv.boot) {
    process.exit(0);
  }
  port = (ref$ = argv.port) != null ? ref$ : 3000, prefix = (ref$ = argv.prefix) != null ? ref$ : "/collections", host = (ref$ = argv.host) != null ? ref$ : "127.0.0.1";
  express = (function(){
    try {
      return require('express');
    } catch (e$) {}
  }());
  if (!express) {
    throw "express required for starting server";
  }
  app = express();
  cors = require('cors');
  gzippo = require('gzippo');
  connectCsv = require('connect-csv');
  app.use(gzippo.compress());
  app.use(express.json());
  app.use(connectCsv({
    header: 'guess'
  }));
  return mountDefault(plx, argv.schema, withPrefix(prefix, function(){
    return app.all.apply(app, arguments);
  }), function(cols){
    app.listen(port, host);
    console.log("Available collections:\n" + join$.call(cols, ' '));
    return console.log("Serving `" + conString + "` on http://" + host + ":" + port + prefix);
  });
});