#!/usr/bin/env tsx
import { Sandbox } from "@opencomputer/sdk";
const sb = await Sandbox.connect("sb-d8716609");
const script = `#!/bin/bash
set -x
echo "=== kasmvncserver script existence + version ==="
which kasmvncserver vncserver
file /usr/bin/kasmvncserver | head -1
head -5 /usr/bin/kasmvncserver

echo "=== try with strace to find what's missing ==="
sudo apt-get install -y --no-install-recommends strace 2>&1 | tail -1
sudo strace -f -e trace=execve,openat -o /tmp/xvnc.strace timeout 3 /usr/bin/Xvnc :198 -SecurityTypes None -DisableBasicAuth=1 -websocketPort 6198 -rfbport 0 2>&1 | tail -10 || true
echo "=== last execve / openat errors from strace ==="
grep -E "execve|ENOENT" /tmp/xvnc.strace 2>/dev/null | tail -20

echo "=== Xvnc fails identically when wrapped in setsid? ==="
setsid timeout 3 /usr/bin/Xvnc :197 -SecurityTypes None -DisableBasicAuth=1 -websocketPort 6197 -rfbport 0 < /dev/null 2>&1 | tail -10 || echo "setsid exit"
`;
await sb.files.write("/tmp/probe-vncserver.sh", script);
await sb.exec.run("chmod +x /tmp/probe-vncserver.sh", { timeout: 5 });
const r = await sb.exec.run("sudo bash /tmp/probe-vncserver.sh", { timeout: 60 });
console.log(r.stdout);
console.log("--- STDERR ---");
console.log(r.stderr);
