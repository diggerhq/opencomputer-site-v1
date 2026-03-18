import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/guides/Guides";
import BuildingOpenLovablePart1 from "./pages/guides/BuildingOpenLovablePart1";
import TheAgenticWorkload from "./pages/guides/TheAgenticWorkload";
import SandboxFingerprinting from "./pages/guides/SandboxFingerprinting";
import AgentExecutionNewHttpRequest from "./pages/guides/AgentExecutionNewHttpRequest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/guides" element={<Blog />} />
          <Route path="/blog/building-open-lovable-part-1" element={<BuildingOpenLovablePart1 />} />
          <Route path="/guides/building-open-lovable-part-1" element={<BuildingOpenLovablePart1 />} />
          <Route path="/blog/the-agentic-workload" element={<TheAgenticWorkload />} />
          <Route path="/blog/sandbox-fingerprinting" element={<SandboxFingerprinting />} />
          <Route path="/blog/agent-execution-new-http-request" element={<AgentExecutionNewHttpRequest />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
