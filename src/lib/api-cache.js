"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

/**
 * Simple in-memory cache for API responses
 * Persists across page navigations in the same session
 */
const ApiCacheContext = createContext(null);

export function ApiCacheProvider({ children }) {
  // Cache for stations
  const [stationsCache, setStationsCache] = useState(null);
  const stationsLoadingRef = useRef(false);

  // Cache for routes (key: `${from}-${to}`)
  const [routesCache, setRoutesCache] = useState(new Map());
  const loadingPromisesRef = useRef(new Map());

  // Cache for selected station names (key: station code)
  const [stationNamesCache, setStationNamesCache] = useState(new Map());

  const fetchStations = useCallback(async () => {
    // Return cached data if available
    if (stationsCache) {
      return stationsCache;
    }

    // If already loading, return null
    if (stationsLoadingRef.current) {
      return null;
    }

    try {
      stationsLoadingRef.current = true;
      const res = await fetch("/api/stations");
      const data = await res.json();
      
      if (data.stations) {
        setStationsCache(data.stations);
        return data.stations;
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch stations:", error);
      return null;
    } finally {
      stationsLoadingRef.current = false;
    }
  }, [stationsCache]);

  const fetchRoute = useCallback(async (from, to) => {
    const cacheKey = `${from}-${to}`;

    // Return cached data if available
    if (routesCache.has(cacheKey)) {
      return routesCache.get(cacheKey);
    }

    // If already loading, return the existing promise
    const existingPromise = loadingPromisesRef.current.get(cacheKey);
    if (existingPromise) {
      return existingPromise;
    }

    // Create fetch promise
    const fetchPromise = (async () => {
      try {
        const res = await fetch(`/api/route?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({ error: "Failed to fetch route" }));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        
        // Cache the response
        setRoutesCache((prev) => {
          const newCache = new Map(prev);
          newCache.set(cacheKey, data);
          return newCache;
        });

        return data;
      } catch (error) {
        console.error("Failed to fetch route:", error);
        throw error;
      } finally {
        // Remove from loading promises
        loadingPromisesRef.current.delete(cacheKey);
      }
    })();

    // Store the promise
    loadingPromisesRef.current.set(cacheKey, fetchPromise);

    return fetchPromise;
  }, [routesCache]);

  const clearStationsCache = useCallback(() => {
    setStationsCache(null);
  }, []);

  const clearRouteCache = useCallback((from, to) => {
    if (from && to) {
      const cacheKey = `${from}-${to}`;
      setRoutesCache((prev) => {
        const newCache = new Map(prev);
        newCache.delete(cacheKey);
        return newCache;
      });
    } else {
      // Clear all routes
      setRoutesCache(new Map());
    }
  }, []);

  const setStationName = useCallback((code, name) => {
    setStationNamesCache((prev) => {
      const newCache = new Map(prev);
      newCache.set(code.toUpperCase(), name);
      return newCache;
    });
  }, []);

  const getStationName = useCallback((code) => {
    return stationNamesCache.get(code.toUpperCase()) || null;
  }, [stationNamesCache]);

  return (
    <ApiCacheContext.Provider
      value={{
        fetchStations,
        fetchRoute,
        stationsCache,
        routesCache,
        stationNamesCache,
        setStationName,
        getStationName,
        clearStationsCache,
        clearRouteCache,
      }}
    >
      {children}
    </ApiCacheContext.Provider>
  );
}

export function useApiCache() {
  const context = useContext(ApiCacheContext);
  if (!context) {
    throw new Error("useApiCache must be used within ApiCacheProvider");
  }
  return context;
}
