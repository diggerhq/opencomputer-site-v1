import { Route } from "react-router-dom";
import AnimationLab from "@/pages/AnimationLab";
import AnimationRender from "@/pages/AnimationRender";

// Internal routes for building and exporting animation scenes while developing locally.
export const devRoutes = (
  <>
    <Route path="/animation-lab" element={<AnimationLab />} />
    <Route path="/animation-render" element={<AnimationRender />} />
  </>
);
