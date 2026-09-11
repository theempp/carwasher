import { BookingComposer } from "./BookingComposer";
import { HouseClose } from "./HouseClose";
import { HouseDrive } from "./HouseDrive";
import { HouseFrames } from "./HouseFrames";
import { HouseMotion } from "./HouseMotion";
import { HouseSequence } from "./HouseSequence";
import { HouseStatement } from "./HouseStatement";

export function AfterPin() {
  return (
    <HouseMotion>
      <HouseStatement />
      <HouseDrive />
      <HouseSequence />
      <HouseFrames />
      <BookingComposer />
      <HouseClose />
    </HouseMotion>
  );
}
