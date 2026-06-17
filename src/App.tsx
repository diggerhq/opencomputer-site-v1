import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { devRoutes } from "@/dev-routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Blog from "./pages/blog/Blog";
import BuildingOpenLovablePart1 from "./pages/blog/BuildingOpenLovablePart1";
import TheAgenticWorkload from "./pages/blog/TheAgenticWorkload";
import WhereShouldTheAgentLive from "./pages/blog/WhereShouldTheAgentLive";
import SandboxFingerprinting from "./pages/blog/SandboxFingerprinting";
import AgentExecutionNewHttpRequest from "./pages/blog/AgentExecutionNewHttpRequest";
import WhatElasticComputeMeans from "./pages/blog/WhatElasticComputeMeans";
import TheRaceToBuildTheNextWordpress from "./pages/blog/TheRaceToBuildTheNextWordpress";
import StopTreatingSandboxesAsCattle from "./pages/blog/StopTreatingSandboxesAsCattle";
import WhatItTakesToRunAiCoworkerImessage from "./pages/blog/WhatItTakesToRunAiCoworkerImessage";
import BackgroundCodingAgent from "./pages/blog/BackgroundCodingAgent";
import EmailSecurityTriageAgent from "./pages/blog/EmailSecurityTriageAgent";
import ScalingOneVmToMillionSandboxes from "./pages/blog/ScalingOneVmToMillionSandboxes";
import BackgroundAgentMaxxing from "./pages/BackgroundAgentMaxxing";
import DesignPartners from "./pages/DesignPartners";
import Clawputer from "./pages/Clawputer";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guides" element={<Blog />} />
          <Route path="/blog/building-open-lovable-part-1" element={<BuildingOpenLovablePart1 />} />
          <Route path="/guides/building-open-lovable-part-1" element={<BuildingOpenLovablePart1 />} />
          <Route path="/blog/the-agentic-workload" element={<TheAgenticWorkload />} />
          <Route path="/guides/the-agentic-workload" element={<TheAgenticWorkload />} />
          <Route path="/blog/where-should-the-agent-live" element={<WhereShouldTheAgentLive />} />
          <Route path="/guides/where-should-the-agent-live" element={<WhereShouldTheAgentLive />} />
          <Route path="/blog/sandbox-fingerprinting" element={<SandboxFingerprinting />} />
          <Route path="/guides/sandbox-fingerprinting" element={<SandboxFingerprinting />} />
          <Route path="/blog/agent-execution-new-http-request" element={<AgentExecutionNewHttpRequest />} />
          <Route path="/guides/agent-execution-new-http-request" element={<AgentExecutionNewHttpRequest />} />
          <Route path="/blog/what-elastic-compute-means" element={<WhatElasticComputeMeans />} />
          <Route path="/guides/what-elastic-compute-means" element={<WhatElasticComputeMeans />} />
          <Route path="/blog/the-race-to-build-the-next-wordpress" element={<TheRaceToBuildTheNextWordpress />} />
          <Route path="/guides/the-race-to-build-the-next-wordpress" element={<TheRaceToBuildTheNextWordpress />} />
          <Route path="/blog/stop-treating-sandboxes-as-cattle" element={<StopTreatingSandboxesAsCattle />} />
          <Route path="/guides/stop-treating-sandboxes-as-cattle" element={<StopTreatingSandboxesAsCattle />} />
          <Route path="/blog/what-it-takes-to-run-an-ai-coworker-on-imessage" element={<WhatItTakesToRunAiCoworkerImessage />} />
          <Route path="/guides/what-it-takes-to-run-an-ai-coworker-on-imessage" element={<WhatItTakesToRunAiCoworkerImessage />} />
          <Route path="/blog/background-coding-agent" element={<BackgroundCodingAgent />} />
          <Route path="/guides/background-coding-agent" element={<BackgroundCodingAgent />} />
          <Route path="/blog/email-security-triage-agent" element={<EmailSecurityTriageAgent />} />
          <Route path="/guides/email-security-triage-agent" element={<EmailSecurityTriageAgent />} />
          <Route path="/blog/scaling-one-vm-to-million-sandboxes" element={<ScalingOneVmToMillionSandboxes />} />
          <Route path="/guides/scaling-one-vm-to-million-sandboxes" element={<ScalingOneVmToMillionSandboxes />} />
          <Route path="/background-agents" element={<BackgroundAgentMaxxing />} />
          <Route path="/backgroundagents" element={<BackgroundAgentMaxxing />} />
          <Route path="/backgroundagentmaxxing" element={<BackgroundAgentMaxxing />} />
          <Route path="/background-agent-maxxing" element={<BackgroundAgentMaxxing />} />
          <Route path="/partners" element={<DesignPartners />} />
          <Route path="/clawputer" element={<Clawputer />} />
          {devRoutes}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
