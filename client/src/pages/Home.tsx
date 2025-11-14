import { useState } from "react";
import TrustBar from "@/components/TrustBar";
import Hero from "@/components/Hero";
import TrustBlock from "@/components/TrustBlock";
import Simulator from "@/components/Simulator";
import SimulationResult from "@/components/SimulationResult";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

interface SimulationData {
  userType: string;
  organ: string;
  birthDate: string;
  marginType: string;
  marginValue: string;
}

export default function Home() {
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);

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
    // Manter simulador visível mas scroll para o topo
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setSimulationData(null);
    setShowSimulator(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TrustBar />
      
      <main className="flex-1">
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
        
        {simulationData && (
          <SimulationResult data={simulationData} onReset={handleReset} />
        )}
      </main>

      <Footer />
    </div>
  );
}
