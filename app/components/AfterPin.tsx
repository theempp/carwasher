import { BookingComposer } from "./BookingComposer";
import { HouseClose } from "./HouseClose";
import { HouseDrive } from "./HouseDrive";
import { HouseFrames } from "./HouseFrames";
import { HouseRail } from "./HouseRail";
import { HouseSequence } from "./HouseSequence";
import { HouseStatement } from "./HouseStatement";

export function AfterPin() {
  return (
    <div className="after-pin relative z-10">
      <HouseRail bookHref="#book" />
      <HouseStatement />
      <HouseDrive />
      <HouseSequence />
      <HouseFrames />
      <BookingComposer />
      <HouseClose />
    </div>
  );
}
