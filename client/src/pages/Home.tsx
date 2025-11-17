import { useState } from "react";
import TrustBar from "@/components/TrustBar";
import Hero from "@/components/Hero";
import TrustBlock from "@/components/TrustBlock";
import Simulator from "@/components/Simulator";
import SimulationResult from "@/components/SimulationResult";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import LeadCapture from "@/components/LeadCapture";
import type { LeadInfo, SimulationData } from "@/types/simulation";

export default function Home() {
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);

  const handleSimulateClick = () => {
    setShowSimulator(true);
    // Scroll suave até o simulador
    setTimeout(() => {
      const element = document.getElementById('simulador');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSimulationComplete = (data: SimulationData) => {
    setSimulationData(data);
    setLeadCaptured(false);
    setLeadInfo(null);
    // Manter simulador visível mas scroll para o topo
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleLeadSubmit = (lead: LeadInfo) => {
    setLeadInfo(lead);
    setLeadCaptured(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleEditSimulation = () => {
    setSimulationData(null);
    setLeadCaptured(false);
    setLeadInfo(null);
    setShowSimulator(true);
    setTimeout(() => {
      document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setSimulationData(null);
    setLeadCaptured(false);
    setLeadInfo(null);
    setShowSimulator(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TrustBar />
      
      <main className="flex-1 pr-0 lg:pr-24 xl:pr-32 2xl:pr-40">
        {!showSimulator && !simulationData && (
          <>
            <Hero onSimulateClick={handleSimulateClick} />
            <TrustBlock />
            <SocialProof />
            <FAQ />
          </>
        )}
        
        {showSimulator && !simulationData && (
          <Simulator onComplete={handleSimulationComplete} />
        )}

        {simulationData && !leadCaptured && (
          <LeadCapture
            simulationData={simulationData}
            onSubmit={handleLeadSubmit}
            onEditSimulation={handleEditSimulation}
          />
        )}

        {simulationData && leadCaptured && (
          <SimulationResult data={simulationData} leadInfo={leadInfo} onReset={handleReset} />
        )}
      </main>

      <Footer />
    </div>
  );
}
