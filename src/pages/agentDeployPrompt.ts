export const AGENT_DEPLOY_PROMPT_PLACEHOLDER = "____________";

export const AGENT_DEPLOY_PROMPT_BEFORE_TASK = `Set up OpenComputer and deploy my first agent.

1. Install the CLI:
   curl -fsSL https://raw.githubusercontent.com/diggerhq/opencomputer/main/scripts/install.sh | bash
2. Run \`oc login\`. If it gives me a browser URL or confirmation code,
   show it to me and wait for me to confirm.
3. Run \`oc agent init\`, write prompt.md for an agent that `;

export const AGENT_DEPLOY_PROMPT_AFTER_TASK = `,
   then run \`oc agent deploy\`.
4. Smoke-test it with \`oc agent invoke\` and give me the live agent URL
   and the dashboard link.`;

export const buildAgentDeployPrompt = (task: string) =>
  `${AGENT_DEPLOY_PROMPT_BEFORE_TASK}${
    task || AGENT_DEPLOY_PROMPT_PLACEHOLDER
  }${AGENT_DEPLOY_PROMPT_AFTER_TASK}`;
