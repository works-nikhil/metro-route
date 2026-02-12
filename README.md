# 🚇 Bangalore Metro Route Finder

A full-stack metro route finder for **Namma Metro (Bangalore)** that computes the fastest route between stations using graph modeling and Dijkstra’s algorithm.

This project models a real-world transit system with normalized relational schema design, interchange handling, and weighted graph traversal.

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

