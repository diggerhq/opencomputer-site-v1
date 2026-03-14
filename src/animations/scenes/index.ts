import type { Scene } from "../schema";
import { ephemeralSessionsScene } from "./ephemeral-sessions";
import { hybridSessionsScene } from "./hybrid-sessions";
import { longRunningSessionsScene } from "./long-running-sessions";
import { singleContainerScene } from "./single-container";

export const scenes: Scene[] = [ephemeralSessionsScene, longRunningSessionsScene, hybridSessionsScene, singleContainerScene];

export const sceneMap = Object.fromEntries(scenes.map((scene) => [scene.meta.id, scene]));

export function getScene(sceneId: string | null | undefined) {
  if (!sceneId) {
    return scenes[0];
  }

  return sceneMap[sceneId] ?? scenes[0];
}
