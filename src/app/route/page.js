"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

// Placeholder route data – replace with API response later
const PLACEHOLDER_ROUTE = {
  totalMinutes: 32,
  stops: 12,
  interchanges: 1,
  lines: ["Green Line", "Purple Line"],
  legs: [
    {
      line: "green",
      stations: [
        { name: "Majestic", type: "start", label: "Starting point" },
        { name: "City Railway Station", type: "stop", minutes: 2 },
        { name: "Magadi Road", type: "stop", minutes: 4 },
        { name: "Vijayanagar", type: "stop", minutes: 6 },
        { name: "Hosahalli", type: "stop", minutes: 8 },
        { name: "Jalahalli", type: "stop", minutes: 10 },
        { name: "Peenya Industry", type: "interchange", label: "Change trains here", fromLine: "Green Line", toLine: "Purple Line", walk: "Platform 2 → Platform 1 (2 min walk)" },
      ],
    },
    {
      line: "purple",
      stations: [
        { name: "Yeshwanthpura", type: "stop", minutes: 17 },
        { name: "Gorguntepalya", type: "stop", minutes: 21 },
        { name: "Jalahalli Cross", type: "stop", minutes: 25 },
        { name: "Dasarahalli", type: "stop", minutes: 28 },
        { name: "Whitefield", type: "end", label: "Your destination" },
      ],
    },
  ],
};

const ALTERNATIVES = [
  { via: "Via Yellow Line", duration: "38 min", detail: "2 interchanges • 15 stops", color: "yellow" },
  { via: "Via Blue Line", duration: "42 min", detail: "1 interchange • 11 stops", color: "blue" },
];

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor" aria-hidden>
      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 448 512" fill="currentColor" aria-hidden>
      <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" aria-hidden>
      <path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" aria-hidden>
      <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 384 512" fill="currentColor" aria-hidden>
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" aria-hidden>
      <path d="M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c53 0 96 43 96 96s-43 96-96 96H139.6c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-53 0-96-43-96-96s43-96 96-96h39.8c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 448 512" fill="currentColor" aria-hidden>
      <path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z" />
    </svg>
  );
}

function flattenRoute(route) {
  const steps = [];
  route.legs.forEach((leg) => {
    leg.stations.forEach((station, i) => {
      const isLastInLeg = i === leg.stations.length - 1;
      steps.push({
        ...station,
        line: leg.line,
        hasLineBelow: true,
        isFirst: steps.length === 0,
        isLast: false,
      });
    });
  });
  if (steps.length) {
    steps[steps.length - 1].isLast = true;
    steps[steps.length - 1].hasLineBelow = false;
  }
  steps.forEach((s, i) => {
    if (i < steps.length - 1) s.hasLineBelow = true;
  });
  return steps;
}

export default function RoutePage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "Majestic";
  const to = searchParams.get("to") || "Whitefield";
  const route = PLACEHOLDER_ROUTE;
  const steps = flattenRoute(route);

  const editHref = `/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <Link href="/" className={styles.iconBtn} aria-label="Back">
          <ArrowLeftIcon />
        </Link>
        <div className={styles.headerRoute}>
          <span className={styles.headerStation}>{from}</span>
          <span className={styles.headerArrow} aria-hidden><ArrowRightIcon /></span>
          <span className={styles.headerStation}>{to}</span>
        </div>
        <Link href={editHref} className={styles.iconBtn} aria-label="Edit route">
          <PenIcon />
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <div>
              <div className={styles.totalTime}>{route.totalMinutes} min</div>
              <div className={styles.totalLabel}>Total travel time</div>
            </div>
            <div className={styles.summaryRight}>
              <div className={styles.stopCount}>{route.stops}</div>
              <div className={styles.stopLabel}>stops</div>
            </div>
          </div>
          <div className={styles.interchangeRow}>
            <RepeatIcon />
            <span>{route.interchanges} interchange{route.interchanges !== 1 ? "s" : ""}</span>
          </div>
          <div className={styles.linesRow}>
            <span className={styles.linesLabel}>Lines:</span>
            {route.lines.map((line) => (
              <span
                key={line}
                className={`${styles.linePill} ${line.includes("Green") ? styles.lineGreen : styles.linePurple}`}
              >
                <span className={styles.lineDot} />
                {line}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.timelineCard}>
          <div className={styles.timeline}>
            {steps.map((station, idx) => {
              const isFirst = station.isFirst;
              const isLast = station.isLast;
              const isInterchange = station.type === "interchange";
              const lineColor = station.line === "green" ? "green" : "purple";

              return (
                <div key={idx} className={styles.timelineItem}>
                  <div className={styles.timelineTrack}>
                    <div
                      className={`${styles.timelineDot} ${isFirst ? styles.dotStart : ""} ${isInterchange ? styles.dotInterchange : ""} ${isLast ? styles.dotEnd : ""} ${!isFirst && !isInterchange && !isLast ? styles[`dot${lineColor.charAt(0).toUpperCase() + lineColor.slice(1)}`] : ""}`}
                    >
                      {isLast && <LocationIcon />}
                      {isFirst && <span className={styles.dotInner} />}
                    </div>
                    {station.hasLineBelow && (
                      <div className={`${styles.timelineLine} ${isInterchange ? styles.lineGradient : ""} ${styles[`line${lineColor.charAt(0).toUpperCase() + lineColor.slice(1)}`]}`} />
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.stationName}>{station.name}</div>
                    {station.label && <div className={styles.stationLabel}>{station.label}</div>}
                    {station.minutes != null && <div className={styles.stationTime}>{station.minutes} min</div>}
                    {isInterchange && (
                      <div className={styles.interchangeBox}>
                        <div className={styles.interchangeTitle}>
                          <RepeatIcon />
                          Change trains here
                        </div>
                        <div className={styles.interchangeText}>
                          From <span className={styles.emerald}>Green Line</span> to <span className={styles.purple}>Purple Line</span>
                        </div>
                        <div className={styles.interchangeWalk}>{station.walk}</div>
                      </div>
                    )}
                    {isFirst && (
                      <span className={`${styles.lineBadge} ${styles.badgeGreen}`}>Green Line</span>
                    )}
                    {isInterchange && (
                      <span className={`${styles.lineBadge} ${styles.badgePurple}`}>Purple Line</span>
                    )}
                    {isLast && (
                      <>
                        <div className={styles.destLabel}>Your destination</div>
                        <div className={styles.arrivalBox}>
                          <div className={styles.arrivalLabel}>Arrival time</div>
                          <div className={styles.arrivalValue}>{route.totalMinutes} minutes from now</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn}>
            <RouteIcon />
            Start Navigation
          </button>
          <button type="button" className={styles.secondaryBtn}>
            <ShareIcon />
            Share Route
          </button>
        </div>

        <section className={styles.alternatives}>
          <div className={styles.alternativesHeader}>
            <h2 className={styles.alternativesTitle}>Alternative Routes</h2>
            <button type="button" className={styles.viewAllBtn}>View all</button>
          </div>
          <div className={styles.alternativesList}>
            {ALTERNATIVES.map((alt) => (
              <div key={alt.via} className={styles.altCard}>
                <div className={styles.altRow}>
                  <div className={styles.altVia}>
                    <span className={`${styles.altDot} ${styles[`altDot${alt.color.charAt(0).toUpperCase() + alt.color.slice(1)}`]}`} />
                    {alt.via}
                  </div>
                  <span className={styles.altDuration}>{alt.duration}</span>
                </div>
                <div className={styles.altDetail}>{alt.detail}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
    </div>
  );
}
