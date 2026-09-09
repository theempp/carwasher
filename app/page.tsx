import { BeforeAfter } from "./components/BeforeAfter";
import { BookingComposer } from "./components/BookingComposer";
import { Navigation } from "./components/Navigation";
import { ScrollProgress } from "./components/ScrollProgress";
import { TrustPanel } from "./components/TrustPanel";
import { CinematicStage } from "./components/experience/CinematicStage";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="top">
        <CinematicStage />
        <div className="relative z-10">
          <TrustPanel />
          <BeforeAfter />
          <BookingComposer />
        </div>
      </main>
      <ScrollProgress />
    </>
  );
}
