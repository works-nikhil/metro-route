import { query } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/route?from=IDN&to=JPN
 *
 * Returns fastest path between two stations by code using Dijkstra on
 * station_lines graph (nodes = station_lines.id, edges = connections).
 */

export async function GET(request) {
  // CORS headers for external access
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const { searchParams } = new URL(request.url);
  const fromCode = searchParams.get("from")?.trim();
  const toCode = searchParams.get("to")?.trim();

  // --- 1. Validate inputs ---
  if (!fromCode || !toCode) {
    return NextResponse.json(
      { error: "Missing required query parameters: from and to" },
      { status: 400, headers },
    );
  }

  if (fromCode === toCode) {
    return NextResponse.json(
      { error: "from and to must be different" },
      { status: 400, headers },
    );
  }

  try {
    // --- 2. Load all station_line nodes with station and line info (for path labels) ---
    const nodesResult = await query(`
      SELECT sl.id, s.name AS station, s.code AS station_code, l.code AS line, sl.sequence
      FROM station_lines sl
      JOIN stations s ON sl.station_id = s.id
      JOIN lines l ON sl.line_id = l.id
    `);

    const nodeMap = {};
    nodesResult.rows.forEach((row) => {
      nodeMap[row.id] = {
        station: row.station,
        stationCode: row.station_code,
        line: row.line,
        sequence: row.sequence,
      };
    });

    // Resolve station codes to station_line ids (a station can be on multiple lines)
    const fromIds = nodesResult.rows
      .filter((r) => r.station_code === fromCode)
      .map((r) => r.id);
    const toIds = nodesResult.rows
      .filter((r) => r.station_code === toCode)
      .map((r) => r.id);

    if (fromIds.length === 0) {
      return NextResponse.json(
        { error: `Station not found: ${fromCode}` },
        { status: 404, headers },
      );
    }
    if (toIds.length === 0) {
      return NextResponse.json(
        { error: `Station not found: ${toCode}` },
        { status: 404, headers },
      );
    }

    // --- 3. Load connections and build adjacency list (DIRECTED, since DB already has both directions) ---
    const connResult = await query(
      "SELECT from_station_line_id, to_station_line_id, travel_time_min FROM connections WHERE is_operational = true",
    );

    const adj = {};
    connResult.rows.forEach((row) => {
      const a = row.from_station_line_id; // UUID string
      const b = row.to_station_line_id; // UUID string
      const w = Number(row.travel_time_min);

      if (!adj[a]) adj[a] = [];
      adj[a].push({ node: b, weight: w });
    });

    // --- 4. Multi-source Dijkstra ---
    const INF = Number.MAX_SAFE_INTEGER;
    const dist = {};
    const prev = {};

    // IMPORTANT: keep UUIDs as STRINGS
    const allNodeIds = new Set([
      ...Object.keys(adj), // <-- no Number()
      ...fromIds,
      ...toIds,
    ]);

    for (const id of allNodeIds) {
      dist[id] = INF;
      prev[id] = null;
    }
    for (const id of fromIds) dist[id] = 0;

    // Simple priority queue
    const queue = fromIds.map((id) => ({ node: id, d: 0 }));
    const visited = new Set();

    while (queue.length > 0) {
      let minIdx = 0;
      for (let i = 1; i < queue.length; i++) {
        if (queue[i].d < queue[minIdx].d) minIdx = i;
      }

      const { node: u } = queue[minIdx];
      queue.splice(minIdx, 1);

      if (visited.has(u)) continue;
      visited.add(u);

      // OPTIONAL: early exit if we reached any target
      if (toIds.includes(u)) break;

      for (const { node: v, weight: w } of adj[u] || []) {
        const alt = dist[u] + w;

        // If dist[v] was never initialized, treat as INF
        if (dist[v] === undefined) {
          dist[v] = INF;
          prev[v] = null;
        }

        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
          queue.push({ node: v, d: alt });
        }
      }
    }

    // --- 5. Pick best destination (minimum time among all "to" nodes) ---
    let bestEnd = null;
    let bestDist = INF;
    for (const id of toIds) {
      if (dist[id] < bestDist) {
        bestDist = dist[id];
        bestEnd = id;
      }
    }

    if (bestEnd == null || bestDist === INF) {
      return NextResponse.json(
        { error: "No route found between the given stations" },
        { status: 404, headers },
      );
    }

    // --- 6. Reconstruct path by backtracking predecessors ---
    const pathIds = [];
    let cur = bestEnd;
    while (cur != null) {
      pathIds.push(cur);
      cur = prev[cur];
    }
    pathIds.reverse();

    const path = pathIds
      .map((id) => {
        const n = nodeMap[id];
        return n
          ? {
              station: n.station,
              stationCode: n.stationCode,
              line: n.line,
              sequence: n.sequence,
            }
          : null;
      })
      .filter(Boolean);

    return NextResponse.json(
      {
        from: fromCode,
        to: toCode,
        totalTimeMin: bestDist,
        path,
      },
      { headers }
    );
  } catch (err) {
    console.error("GET /api/route error:", err);
    return NextResponse.json(
      { error: "Internal server error", message: err.message },
      { status: 500, headers },
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
