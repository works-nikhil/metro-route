"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import metroLogo from "../../public/metro.svg";

function PinIcon({ color = "currentColor" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState(() => searchParams.get("from") || "Majestic");
  const [to, setTo] = useState(() => searchParams.get("to") || "Whitefield");

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoWrap}>
            <Image src={metroLogo} alt="Namma Metro" width={40} height={40} priority />
          </div>
          <div>
            <span className={styles.brandName}>Namma Metro</span>
            <span className={styles.brandSub}>Bangalore</span>
          </div>
        </div>
        <button type="button" className={styles.menuBtn} aria-label="Menu">
          <span className={styles.menuDots} />
        </button>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Find Your Route</h1>
        <p className={styles.subtitle}>Fastest metro journey, instant results</p>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="from">
              FROM
            </label>
            <div className={`${styles.inputWrap} ${styles.fromWrap}`}>
              <span className={styles.pinWrap} aria-hidden>
                <PinIcon color="#22c55e" />
              </span>
              <input
                id="from"
                type="text"
                className={styles.input}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Select station"
                aria-label="From station"
              />
            </div>
          </div>

          <button
            type="button"
            className={styles.swapBtn}
            onClick={handleSwap}
            aria-label="Swap from and to"
          >
            <SwapIcon />
          </button>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="to">
              TO
            </label>
            <div className={`${styles.inputWrap} ${styles.toWrap}`}>
              <span className={styles.pinWrap} aria-hidden>
                <PinIcon color="#a855f7" />
              </span>
              <input
                id="to"
                type="text"
                className={styles.input}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Select station"
                aria-label="To station"
              />
            </div>
          </div>

          <Link
            href={`/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
            className={styles.primaryBtn}
          >
            Find Fastest Route
            <ArrowRightIcon />
          </Link>
        </div>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.green}`} />
            Green Line
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.purple}`} />
            Purple Line
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.yellow}`} />
            Yellow Line
          </span>
        </div>
      </main>
    </div>
  );
}
