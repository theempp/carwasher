import { BeforeAfter } from "./components/BeforeAfter";
import { CtaSection } from "./components/CtaSection";
import { TrustPanel } from "./components/TrustPanel";
import { CinematicStage } from "./components/experience/CinematicStage";

export default function Home() {
  return (
    <main>
      <CinematicStage />
      <TrustPanel />
      <BeforeAfter />
      <CtaSection />
    </main>
  );
}
