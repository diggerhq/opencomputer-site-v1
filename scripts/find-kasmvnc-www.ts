#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const r = await sb.exec.run(`bash -lc '
  echo "=== dpkg -L kasmvncserver | grep www ==="
  dpkg -L kasmvncserver | grep -E "www|vnc.html|html|noVNC" | head -30
  echo
  echo "=== find vnc.html anywhere ==="
  sudo find / -name "vnc.html" 2>/dev/null | head -5
  sudo find / -name "kasm-client*" 2>/dev/null | head -5
  echo
  echo "=== find any KasmVNC-related dirs ==="
  ls /usr/share/ | grep -i kasm
  ls /usr/local/share/ | grep -i kasm 2>/dev/null
  ls /opt/ | grep -i kasm 2>/dev/null
'`, { timeout: 30 });
console.log(r.stdout);
