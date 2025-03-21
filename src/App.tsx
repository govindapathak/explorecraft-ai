
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AnimatedTransition from "./components/AnimatedTransition";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Itinerary from "./pages/Itinerary";
import NotFound from "./pages/NotFound";
import LocationPermission from "./pages/LocationPermission";
import Preferences from "./pages/Preferences";
import Discover from "./pages/Discover";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/location" element={<LocationPermission />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatedTransition>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
