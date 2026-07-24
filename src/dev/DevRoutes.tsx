import { Route } from "react-router-dom";
import AnimationLab from "@/pages/AnimationLab";
import AnimationRender from "@/pages/AnimationRender";
import DraftPost from "@/dev/DraftPost";
import DraftsIndex from "@/dev/DraftsIndex";

// Internal routes for building and exporting animation scenes while developing locally.
export const devRoutes = (
  <>
    <Route path="/animation-lab" element={<AnimationLab />} />
    <Route path="/animation-render" element={<AnimationRender />} />
    <Route path="/drafts" element={<DraftsIndex />} />
    <Route path="/drafts/:slug" element={<DraftPost />} />
  </>
);
