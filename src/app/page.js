"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApiCache } from "@/lib/api-cache";
import styles from "./page.module.css";
import metroLogo from "../../public/metro.svg";
import nammaLogo from "../../public/namma-metro.png";

function PinIcon({ color = "currentColor" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
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

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function StationDropdown({ 
  stations, 
  value, 
  onChange, 
  isOpen, 
  onToggle, 
  onClose, 
  inputId,
  placeholder,
  loading,
  inputRef 
}) {
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        onClose();
        setSearchTerm("");
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, inputRef]);

  // Filter stations based on search term
  const filteredStations = useMemo(() => {
    if (!searchTerm.trim()) return stations;
    const term = searchTerm.toLowerCase();
    return stations.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.code?.toLowerCase().includes(term)
    );
  }, [stations, searchTerm]);

  const handleStationSelect = (station) => {
    onChange(station.code);
    onClose();
    setSearchTerm("");
  };

  const displayValue = useMemo(() => {
    const station = stations.find((s) => s.code === value);
    return station ? `${station.name} (${station.code})` : value;
  }, [stations, value]);

  return (
    <div className={styles.dropdownWrapper}>
      <div
        className={styles.inputWithDropdown}
        onClick={() => !isOpen && onToggle()}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          className={styles.input}
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => {
            if (isOpen) {
              setSearchTerm(e.target.value);
            } else {
              onChange(e.target.value.toUpperCase());
            }
          }}
          onFocus={() => {
            if (!isOpen) {
              onToggle();
              setSearchTerm("");
            }
          }}
          placeholder={loading ? "Loading stations..." : placeholder}
          aria-label={inputId === "from" ? "From station" : "To station"}
          autoComplete="off"
          readOnly={!isOpen}
        />
        <button
          type="button"
          className={styles.dropdownToggle}
          onClick={(e) => {
            e.stopPropagation();
            if (isOpen) {
              onClose();
              setSearchTerm("");
            } else {
              onToggle();
            }
          }}
          aria-label="Toggle dropdown"
        >
          <ChevronDownIcon />
        </button>
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {loading ? (
            <div className={styles.dropdownItem}>Loading stations...</div>
          ) : filteredStations.length === 0 ? (
            <div className={styles.dropdownItem}>No stations found</div>
          ) : (
            <div className={styles.dropdownList}>
              {filteredStations.map((station) => (
                <button
                  key={station.code}
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => handleStationSelect(station)}
                >
                  <span className={styles.stationName}>{station.name}</span>
                  <span className={styles.stationCode}>{station.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const searchParams = useSearchParams();
  const { fetchStations, stationsCache, setStationName } = useApiCache();

  // Store station CODES in state (not names)
  const [from, setFrom] = useState(() => (searchParams.get("from") || "").toUpperCase());
  const [to, setTo] = useState(() => (searchParams.get("to") || "").toUpperCase());

  // Station list from cache
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(true);

  // Dropdown state
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStations() {
      // Check cache first
      if (stationsCache) {
        setStations(stationsCache);
        setLoadingStations(false);
        return;
      }

      // Fetch from API (will use cache internally)
      try {
        const stationsList = await fetchStations();
        if (!cancelled && stationsList) {
          setStations(stationsList);
        }
      } catch (e) {
        console.error("Failed to load stations:", e);
      } finally {
        if (!cancelled) setLoadingStations(false);
      }
    }

    loadStations();
    return () => {
      cancelled = true;
    };
  }, [fetchStations, stationsCache]);

  const stationByCode = useMemo(() => {
    const m = new Map();
    for (const s of stations) {
      if (s?.code) m.set(String(s.code).toUpperCase(), s);
    }
    return m;
  }, [stations]);

  // Store station names in cache when codes change
  useEffect(() => {
    if (from && stationByCode.has(from)) {
      const station = stationByCode.get(from);
      if (station?.name) {
        setStationName(from, station.name);
      }
    }
  }, [from, stationByCode, setStationName]);

  useEffect(() => {
    if (to && stationByCode.has(to)) {
      const station = stationByCode.get(to);
      if (station?.name) {
        setStationName(to, station.name);
      }
    }
  }, [to, stationByCode, setStationName]);

  // Pin colors - using default colors for visual distinction
  const fromColor = "green"; // green
  const toColor = "purple"; // purple

  // Check if both stations are the same
  const isSameStation = from && to && from.toUpperCase() === to.toUpperCase();
  const canSearch = from && to && !isSameStation;

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    // Close any open dropdowns
    setFromDropdownOpen(false);
    setToDropdownOpen(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoWrap}>
            <Image
              src={metroLogo}
              alt="Namma Metro"
              width={24}
              height={24}
              priority
            />
          </div>
          <div>
            <span className={styles.brandName}>Namma Metro</span>
            <span className={styles.brandSub}>Bangalore</span>
          </div>
        </div>
        <div className={styles.headerLogo}>
          <Image src={nammaLogo} alt="Namma Metro" width={150} priority />
        </div>
        <div>
          <button type="button" className={styles.menuBtn} aria-label="Menu">
            <span className={styles.menuDots} />
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Find Your Route</h1>
        <p className={styles.subtitle}>
          Fastest metro journey, instant results
        </p>

        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="from">
              Where are you starting from?
            </label>
            <div className={`${styles.inputWrap} ${styles.fromWrap}`}>
              <span className={styles.pinWrap} aria-hidden>
                <PinIcon color={fromColor} />
              </span>
              <StationDropdown
                stations={stations}
                value={from}
                onChange={setFrom}
                isOpen={fromDropdownOpen}
                onToggle={() => {
                  setFromDropdownOpen(true);
                  setToDropdownOpen(false);
                }}
                onClose={() => setFromDropdownOpen(false)}
                inputId="from"
                placeholder="Select origin station"
                loading={loadingStations}
                inputRef={fromInputRef}
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
              Where are you going to?
            </label>
            <div className={`${styles.inputWrap} ${styles.toWrap}`}>
              <span className={styles.pinWrap} aria-hidden>
                <PinIcon color={toColor} />
              </span>
              <StationDropdown
                stations={stations}
                value={to}
                onChange={setTo}
                isOpen={toDropdownOpen}
                onToggle={() => {
                  setToDropdownOpen(true);
                  setFromDropdownOpen(false);
                }}
                onClose={() => setToDropdownOpen(false)}
                inputId="to"
                placeholder="Select destination station"
                loading={loadingStations}
                inputRef={toInputRef}
              />
            </div>
          </div>

          {canSearch ? (
            <Link
              href={`/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
              className={styles.primaryBtn}
            >
              Find Fastest Route
              <ArrowRightIcon />
            </Link>
          ) : (
            <button
              type="button"
              className={`${styles.primaryBtn} ${styles.primaryBtnDisabled}`}
              disabled
            >
              Find Fastest Route
              <ArrowRightIcon />
            </button>
          )}
          {isSameStation && (
            <div className={styles.errorMessage}>
              Origin and destination stations cannot be the same
            </div>
          )}
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
