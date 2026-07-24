import { describe, expect, it } from "vitest";
import { buildAgentDeployPrompt } from "./agentDeployPrompt";

describe("AgentDeploy prompt", () => {
  it("uses CLI login and keeps the copied prompt in sync with the rendered source", () => {
    expect(buildAgentDeployPrompt("triage new GitHub issues")).toBe(`Set up OpenComputer and deploy my first agent.

1. Install the CLI:
   curl -fsSL https://raw.githubusercontent.com/diggerhq/opencomputer/main/scripts/install.sh | bash
2. Run \`oc login\`. If it gives me a browser URL or confirmation code,
   show it to me and wait for me to confirm.
3. Run \`oc agent init\`, write prompt.md for an agent that triage new GitHub issues,
   then run \`oc agent deploy\`.
4. Smoke-test it with \`oc agent invoke\` and give me the live agent URL
   and the dashboard link.`);
    expect(buildAgentDeployPrompt("")).toContain("agent that ____________");
    expect(buildAgentDeployPrompt("")).not.toContain("API key");
    expect(buildAgentDeployPrompt("")).not.toContain("app.opencomputer.dev");
  });
});
