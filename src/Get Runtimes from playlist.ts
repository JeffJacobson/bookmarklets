/**
 * Gets the runtimes for all videos listed on a page
 * and returns their total runtime.
 */

type SingularDurationUnit = `${"Hour" | "Minute" | "Second"}`;
type PluralDurationUnit = `${SingularDurationUnit}${"s"}`;
type DurationUnit = SingularDurationUnit | PluralDurationUnit;

type SingularDurationString = `1 ${SingularDurationUnit}`;
type DurationString =
  | `1 ${SingularDurationString}`
  | `${number} ${PluralDurationUnit}`;
type DurationListString =
  | `${DurationString}`
  | `${DurationString}, ${DurationString}`
  | `${DurationString}, ${DurationString}, ${DurationString}`;

function pluralize(item: string): `${string}s` {
  if (!item.endsWith("s")) {
    item += "s";
  }
  return item as `${string}s`;
}

class Duration {
  hours = 0;
  minutes = 0;
  seconds = 0;
  // totalSeconds = 0;

  public get totalSeconds(): number {
    return this.hours * 60 * 60 + this.minutes * 60 + this.seconds;
  }

  constructor(s: DurationListString) {
    function convertElements(item: string, i: number): string | number {
      // The first item is the integer duration value.
      if (i === 0) {
        return parseInt(item);
      }
      // Get the unit string.
      // Pluralize singular unit label
      item = pluralize(item);
      return item;
    }

    const convertToNumberUnitPairs = (part: DurationString) => {
      type NumberUnitTuple = [number, DurationUnit];

      const [n, unit] = part
        .split(" ", 2)
        .map(convertElements) as NumberUnitTuple;

      (this as any)[unit] = n;
      return [unit, n];
    };

    (s.split(", ") as DurationString[]).forEach(convertToNumberUnitPairs);
  }
}

const durationElementSelector =
  ".ytd-thumbnail-overlay-time-status-renderer[aria-label]";
  
function* GetVideoDurations(
  nodes: NodeListOf<Element> = document.body.querySelectorAll(
    durationElementSelector
  )
) {
  for (const node of nodes) {
    // Get duration aria-label attribute value.
    // These will be strings such as "14 minutes, 7 seconds"
    const ariaLabel = node.getAttribute("aria-label");
    // Skip current node if it does not have an aria-label.
    if (!ariaLabel) {
      console.warn(`Aria label not found in element`, node);
      continue;
    }
    try {
      const duration = new Duration(ariaLabel as DurationListString);
      yield duration;
    } catch (ex) {
      console.warn(
        `Could not parse ${ariaLabel} into a ${Duration.name} object.`
      );
    }
  }
}

function getTotalDurationOfAllVideos(durations: Iterable<Duration>) {
  // Initialize sum.
  let sumSeconds = 0;

  for (const d of durations) {
    sumSeconds += d.totalSeconds;
  }
}

const totalDuration = getTotalDurationOfAllVideos(GetVideoDurations());
console.log(totalDuration);
