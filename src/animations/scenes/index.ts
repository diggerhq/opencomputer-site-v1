import type { Scene } from "../schema";
import { agentHybridSandboxScene } from "./agent-hybrid-sandbox";
import { agentInsideSandboxScene } from "./agent-inside-sandbox";
import { agentOutsideSandboxScene } from "./agent-outside-sandbox";
import { ephemeralSessionsScene } from "./ephemeral-sessions";
import { hybridSessionsScene } from "./hybrid-sessions";
import { longRunningSessionsScene } from "./long-running-sessions";
import { singleContainerScene } from "./single-container";

export const scenes: Scene[] = [ephemeralSessionsScene, longRunningSessionsScene, hybridSessionsScene, singleContainerScene, agentOutsideSandboxScene, agentInsideSandboxScene, agentHybridSandboxScene];

export const sceneMap = Object.fromEntries(scenes.map((scene) => [scene.meta.id, scene]));

export function getScene(sceneId: string | null | undefined) {
  if (!sceneId) {
    return scenes[0];
  }

  return sceneMap[sceneId] ?? scenes[0];
}
