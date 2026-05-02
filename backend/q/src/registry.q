\d .kdbdash.registry

handlers:(`symbol$())!()
loadedFiles:`symbol$()

register:{[name;fn]
  endpoint:.kdbdash.util.toSymbol name;
  handlers[endpoint]:fn;
  :endpoint
 }

exists:{[name]
  .kdbdash.util.toSymbol name in key handlers
 }

get:{[name]
  handlers[.kdbdash.util.toSymbol name]
 }

list:{
  key handlers
 }

clear:{
  handlers:(`symbol$())!();
  loadedFiles:`symbol$();
  :`cleared
 }

loadFile:{[path]
  system "l ",path;
  loadedFiles,:`$path;
  :path
 }

loadAll:{[dir]
  files:system "find ",dir," -maxdepth 1 -type f -name '*.q' | sort";
  if[0=count files;
    :()
  ];

  loadFile each files
 }

\d .
