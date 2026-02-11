"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApiCache } from "@/lib/api-cache";
import styles from "./page.module.css";

// const ALTERNATIVES = [
//   { via: "Via Yellow Line", duration: "38 min", detail: "2 interchanges • 15 stops", color: "yellow" },
//   { via: "Via Blue Line", duration: "42 min", detail: "1 interchange • 11 stops", color: "blue" },
// ];

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
    <svg width="14" height="14" viewBox="0 0 512 512" fill="white" aria-hidden>
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

/**
 * Transform API response to UI format
 */
function transformApiResponse(apiData) {
  if (!apiData || !apiData.path || apiData.path.length === 0) {
    return null;
  }

  const path = apiData.path;
  const steps = [];
  let cumulativeTime = 0;
  const lines = new Set();
  let interchanges = 0;
  let prevLine = null;

  path.forEach((item, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === path.length - 1;
    const currentLine = item.line;
    const nextLine = !isLast ? path[idx + 1].line : null;
    lines.add(currentLine);

    // Detect interchange (line change) - check if NEXT station has different line
    const isInterchange = nextLine && currentLine !== nextLine;
    if (isInterchange) {
      interchanges++;
    }

    // Calculate cumulative time (rough estimate: assume equal time per segment)
    // Since API doesn't provide per-segment time, we'll distribute totalTimeMin evenly
    if (!isFirst) {
      cumulativeTime = Math.round(
        (apiData.totalTimeMin / (path.length - 1)) * idx
      );
    }

    const step = {
      name: item.station,
      stationCode: item.stationCode,
      line: currentLine,
      sequence: item.sequence,
      type: isFirst ? "start" : isLast ? "end" : isInterchange ? "interchange" : "stop",
      minutes: isFirst ? null : cumulativeTime,
      isFirst,
      isLast,
      hasLineBelow: !isLast,
    };

    if (isFirst) {
      step.label = "Starting point";
    } else if (isLast) {
      step.label = "Your destination";
    } else if (isInterchange) {
      step.label = "Change trains here";
      step.fromLine = currentLine.charAt(0).toUpperCase() + currentLine.slice(1) + " Line";
      step.toLine = nextLine.charAt(0).toUpperCase() + nextLine.slice(1) + " Line";
      step.walk = "Platform change required";
    }

    steps.push(step);
    prevLine = currentLine;
  });

  return {
    totalMinutes: apiData.totalTimeMin,
    stops: path.length - 1,
    interchanges,
    lines: Array.from(lines)
      .map((l) => l.charAt(0).toUpperCase() + l.slice(1) + " Line")
      .sort(),
    steps,
  };
}

function RoutePageContent() {
  const searchParams = useSearchParams();
  const { fetchRoute, routesCache, getStationName } = useApiCache();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get station names from cache
  const fromStationName = getStationName(from) || "";
  const toStationName = getStationName(to) || "";

  useEffect(() => {
    if (!from || !to) {
      setError("Missing from or to station codes");
      setLoading(false);
      return;
    }

    const cacheKey = `${from}-${to}`;
    
    // Check cache first
    if (routesCache.has(cacheKey)) {
      const cachedData = routesCache.get(cacheKey);
      const transformed = transformApiResponse(cachedData);
      if (transformed) {
        setRouteData(transformed);
        setLoading(false);
        return;
      }
    }

    async function loadRoute() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchRoute(from, to);
        
        if (data) {
          const transformed = transformApiResponse(data);
          if (!transformed) {
            throw new Error("Invalid route data received");
          }
          setRouteData(transformed);
        }
      } catch (err) {
        setError(err.message || "Failed to load route");
      } finally {
        setLoading(false);
      }
    }

    loadRoute();
  }, [from, to, fetchRoute, routesCache]);

  const editHref = `/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  if (loading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.iconBtn} aria-label="Back">
            <ArrowLeftIcon />
          </Link>
          <div className={styles.headerRoute}>
            <span className={styles.headerStation}>{fromStationName || from || "..."}</span>
            <span className={styles.headerArrow} aria-hidden><ArrowRightIcon /></span>
            <span className={styles.headerStation}>{toStationName || to || "..."}</span>
          </div>
          <Link href={editHref} className={styles.iconBtn} aria-label="Edit route">
            <PenIcon />
          </Link>
        </header>
        <main className={styles.main}>
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
            Loading route...
          </div>
        </main>
      </div>
    );
  }

  if (error || !routeData) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.iconBtn} aria-label="Back">
            <ArrowLeftIcon />
          </Link>
          <div className={styles.headerRoute}>
            <span className={styles.headerStation}>{fromStationName || from || "..."}</span>
            <span className={styles.headerArrow} aria-hidden><ArrowRightIcon /></span>
            <span className={styles.headerStation}>{toStationName || to || "..."}</span>
          </div>
          <Link href={editHref} className={styles.iconBtn} aria-label="Edit route">
            <PenIcon />
          </Link>
        </header>
        <main className={styles.main}>
          <div style={{ textAlign: "center", padding: "3rem", color: "#ef4444" }}>
            <div style={{ marginBottom: "1rem", fontWeight: 600 }}>Error</div>
            <div>{error || "Failed to load route"}</div>
            <Link href="/" style={{ display: "inline-block", marginTop: "1rem", color: "#34d399", textDecoration: "underline" }}>
              Go back to search
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const steps = routeData.steps;

  return (
    <div className={styles.page}>

      <header className={styles.header}>
        <Link href="/" className={styles.iconBtn} aria-label="Back">
          <ArrowLeftIcon />
        </Link>
        <div className={styles.headerRoute}>
          <span className={styles.headerStation}>{fromStationName || from}</span>
          <span className={styles.headerArrow} aria-hidden><ArrowRightIcon /></span>
          <span className={styles.headerStation}>{toStationName || to}</span>
        </div>
        <Link href={editHref} className={styles.iconBtn} aria-label="Edit route">
          <PenIcon />
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <div>
              <div className={styles.totalTime}>{routeData.totalMinutes} min</div>
              <div className={styles.totalLabel}>Total travel time</div>
            </div>
            <div className={styles.summaryRight}>
              <div className={styles.stopCount}>{routeData.stops}</div>
              <div className={styles.stopLabel}>stops</div>
            </div>
          </div>
          <div className={styles.interchangeRow}>
            <RepeatIcon />
            <span>{routeData.interchanges} interchange{routeData.interchanges !== 1 ? "s" : ""}</span>
          </div>
          <div className={styles.linesRow}>
            <span className={styles.linesLabel}>Lines:</span>
            {routeData.lines.map((line) => (
              <span
                key={line}
                className={`${styles.linePill} ${line.includes("Green") ? styles.lineGreen : line.includes("Purple") ? styles.linePurple : styles.lineYellow}`}
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
              const lineColor = station.line === "green" ? "green" : station.line === "purple" ? "purple" : "yellow";
              const isLast = idx === steps.length - 1;
              const isInterchange = station.type === "interchange";
              const colorValue = lineColor === "green" ? "#10b981" : lineColor === "purple" ? "#a855f7" : "#eab308";

              return (
                <div key={idx} className={styles.timelineStep}>
                  {/* Line segment connecting to next station */}
                  {!isLast && (
                    <div 
                      className={styles.lineSegment}
                      style={{
                        backgroundColor: colorValue,
                        boxShadow: `0 0 0.5rem ${colorValue}40`
                      }}
                    />
                  )}
                  <div className={`${styles.dot} ${styles[`dot${lineColor.charAt(0).toUpperCase() + lineColor.slice(1)}`]}`} />
                  <div className={styles.content}>
                    <div className={`${styles.stationName} ${styles[`name${lineColor.charAt(0).toUpperCase() + lineColor.slice(1)}`]}`}>
                      {station.name}
                    </div>
                    {station.minutes != null && (
                      <div className={styles.stationTime}>{station.minutes} min</div>
                    )}
                    {isInterchange && (
                      <div className={styles.interchangeBox}>
                        <div className={styles.interchangeTitle}>
                          <RepeatIcon />
                          Change trains here
                        </div>
                        <div className={styles.interchangeText}>
                          From <span className={styles.emerald}>{station.fromLine}</span> to <span className={styles.purple}>{station.toLine}</span>
                        </div>
                        {station.walk && (
                          <div className={styles.interchangeWalk}>{station.walk}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn}>
            <RouteIcon />
            Start Navigation
          </button>
          <button type="button" className={styles.secondaryBtn}>
            <ShareIcon />
            Share Route
          </button>
        </div> */}

        {/* <section className={styles.alternatives}>
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
        </section> */}
      </main>

    </div>
  );
}

export default function RoutePage() {
  return (
    <Suspense fallback={
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" className={styles.iconBtn} aria-label="Back">
            <ArrowLeftIcon />
          </Link>
          <div className={styles.headerRoute}>
            <span className={styles.headerStation}>...</span>
            <span className={styles.headerArrow} aria-hidden><ArrowRightIcon /></span>
            <span className={styles.headerStation}>...</span>
          </div>
          <div className={styles.iconBtn} />
        </header>
        <main className={styles.main}>
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
            Loading route...
          </div>
        </main>
      </div>
    }>
      <RoutePageContent />
    </Suspense>
  );
}
