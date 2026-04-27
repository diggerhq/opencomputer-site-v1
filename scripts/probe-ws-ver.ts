import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-fc4b0acf");
const r = await sb.exec.run(`bash -lc '
  set -x
  which websockify
  pip show websockify 2>&1 | head -5
  python3 -c "import websockify; print(websockify.__file__, websockify.__version__)" 2>&1
  pip index versions websockify 2>&1 | head -5 || true
'`, { timeout: 30 });
console.log(r.stdout);
if (r.stderr) console.error(r.stderr);
