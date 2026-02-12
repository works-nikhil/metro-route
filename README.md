<img width="2291" height="1000" alt="namma-metro" src="https://github.com/user-attachments/assets/a6c202af-f105-49eb-9c49-6f115e9b2653" />

# 🚇 Bangalore Metro Route Finder

A full-stack metro route finder for **Namma Metro (Bangalore)** that computes the fastest route between stations using graph modeling and Dijkstra’s algorithm.

This project models a real-world transit system with normalized relational schema design, interchange handling, and weighted graph traversal.

# <a href="https://metro-route-alpha.vercel.app/"> Live Demo Link </a>
---

## 🔍 Overview

This application allows users to:

- Select a **source** and **destination** station
- Compute the **fastest route**
- Handle **interchange stations**
- Traverse multiple metro lines
- Calculate total travel time
- Return a structured path (station + line + sequence)

### Currently Supported Lines

- 🟢 Green Line  
- 🟣 Purple Line  
- 🟡 Yellow Line  

### Operational Interchanges

- **Majestic (KGWA)** → Green ↔ Purple  
- **Rashtriya Vidyalaya Road (RVR)** → Green ↔ Yellow  

---

## 🧠 System Design

### Graph Modeling

The metro system is modeled as a **weighted directed graph**:

- **Node** → `station_lines.id`
- **Edge** → `connections`
- **Weight** → `travel_time_min`

Each physical station can exist on multiple lines:

stations
↓
station_lines (per line instance)
↓
connections (edges)


This structure enables:

- Clean interchange modeling
- Line-specific ordering
- Bi-directional travel
- Extensibility for future lines

---

## 🗄️ Database Schema

### `lines`
Stores metro line metadata.

### `stations`
Stores physical station data:
- station code
- name
- coordinates

### `station_lines`
Represents a station on a specific line.
Contains:
- `sequence` (ordering on that line)
- `is_interchange` flag

### `connections`
Represents graph edges:
- `from_station_line_id`
- `to_station_line_id`
- `travel_time_min`
- `is_operational`

This separation ensures routing logic remains scalable and clean.

---

## ⚙️ Routing Algorithm

Fastest route is computed using:

### **Dijkstra’s Algorithm**

Features:

- Multi-source support (stations on multiple lines)
- Weighted edges
- Interchange penalties (5 minutes)
- Bi-directional connectivity
- Backend-only computation

Routing is handled server-side for:

- Better performance
- Centralized logic
- Scalability
- Clean architecture separation

---

## ⚙️ Tech Stack

### Frontend
- Next.js (App Router)
- React
- CSS Modules

### Backend
- Next.js API Routes
- Node.js

### Database
- PostgreSQL
- Supabase
- UUID-based schema
- Indexed graph tables

### Deployment
- Vercel (Frontend + API)
- Supabase (Database)

---

## 📂 Project Structure

/app
/api/route
route.js → Dijkstra implementation
/lib
db.js → PostgreSQL connection pool
/public
metro.svg



---

## 🚏 Example API Call

GET /api/route?from=RGDT&to=AGPP

Example response:

```json
{
  "from": "RGDT",
  "to": "AGPP",
  "totalTimeMin": 34,
  "path": [
    { "station": "Ragigudda", "line": "yellow" },
    { "station": "Rashtriya Vidyalaya Road", "line": "yellow" },
    { "station": "Rashtriya Vidyalaya Road", "line": "green" },
    { "station": "Nadaprabhu Kempegowda Station (Majestic)", "line": "green" },
    { "station": "Nadaprabhu Kempegowda Station (Majestic)", "line": "purple" },
    { "station": "Attiguppe", "line": "purple" }
  ]
}
```

🔄 Interchange Handling

## Interchanges are implemented as cross-line edges:

green KGWA  ↔  purple KGWA
green RVR   ↔  yellow RVR


These edges carry a 5-minute transfer penalty.

Future lines (Pink / Blue) can be added without redesigning the schema.

## 🧩 Extensibility

The system supports:

- Adding new lines

- Adding new stations

- Adding future interchanges

- Marking non-operational lines

- Adding fare calculation logic

## Supporting alternate route strategies

🏗️ Engineering Highlights

This project demonstrates:

- Relational schema design

- Graph theory applied to real-world systems

- Dijkstra’s algorithm implementation

- Backend API design

- Multi-line transit modeling

- Clean separation between data and computation

- Built as a backend-focused system design exercise.

## 🛠️ Setup

Clone repository: git clone https://github.com/works-nikhil/metro-route.git

Configure environment variables:

PG_DATABASE_URL= YOUR_EXTERNAL_DATABASE_URL


## Install dependencies:

npm install


## Run locally:

npm run dev

📌 Author

Built as a side project exploring backend engineering, graph algorithms, and scalable transit system modeling. Always open to feedback.
