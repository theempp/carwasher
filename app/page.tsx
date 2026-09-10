import { AfterPin } from "./components/AfterPin";
import { ScrollProgress } from "./components/ScrollProgress";
import { CinematicStage } from "./components/experience/CinematicStage";

export default function Home() {
  return (
    <>
      <main id="top">
        <CinematicStage />
        <AfterPin />
      </main>
      <ScrollProgress />
    </>
  );
}
