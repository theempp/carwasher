import { AfterPin } from "./components/AfterPin";
import { HouseRail } from "./components/HouseRail";
import { ScrollProgress } from "./components/ScrollProgress";
import { CinematicStage } from "./components/experience/CinematicStage";

export default function Home() {
  return (
    <>
      <HouseRail bookHref="#book" />
      <main id="top">
        <CinematicStage />
        <AfterPin />
      </main>
      <ScrollProgress />
    </>
  );
}
