// /workspaces/bmwtracing/frontend/src/App.tsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import your pages
import Index from "./pages/Index";
import WorkItemDetail from "./pages/WorkItemDetail";

// Import the Toast system
import { ToastProvider } from "@/hooks/use-toast";
import { ToastContainer } from "@/components/ToastContainer";

// Import other UI providers/components
import { TooltipProvider } from "@/components/ui/tooltip";

// Initialize React Query Client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/work-item/:id" element={<WorkItemDetail />} />
            {/* Add more routes as needed */}
          </Routes>
        </BrowserRouter>
        <ToastContainer /> {/* Render the Toasts */}
      </TooltipProvider>
    </ToastProvider>
  </QueryClientProvider>
);

export default App;
