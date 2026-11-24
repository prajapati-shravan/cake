"""
Smart Route Optimization System
Design and Analysis of Algorithms - 5th Semester Mini Project

Compares Dijkstra, A* and Floyd-Warshall on random geometric road graphs.

Usage:
    python route_optimizer.py demo                 # input -> processing -> output (n=10)
    python route_optimizer.py demo -n 30 -s 0 -t 20
    python route_optimizer.py benchmark            # n = 10, 50, 100, 500 + graph
    python route_optimizer.py visualize -n 40      # draws the graph and routes
Requires: Python 3, matplotlib (only for benchmark graph / visualize)
"""
import argparse
import heapq
import math
import random
import time

INF = float("inf")


# ----------------------------------------------------------------------------
# 1. GRAPH GENERATOR  (locations = vertices, roads = weighted edges)
# ----------------------------------------------------------------------------
class Graph:
    def __init__(self, n, seed=1):
        rnd = random.Random(seed)
        self.n = n
        self.pos = [(rnd.uniform(0, 100), rnd.uniform(0, 100)) for _ in range(n)]
        self.adj = [[] for _ in range(n)]       # adjacency list: (neighbour, weight)
        self.edges = set()

        # Step 1: connect every node to its nearest earlier node -> graph is connected
        for i in range(1, n):
            j = min(range(i), key=lambda k: self.dist(i, k))
            self._add(i, j)

        # Step 2: add the shortest remaining roads until about 3n edges
        target = min(3 * n, n * (n - 1) // 2)
        cand = []
        for i in range(n):
            near = sorted((k for k in range(n) if k != i), key=lambda k: self.dist(i, k))[:8]
            cand += [(self.dist(i, k), min(i, k), max(i, k)) for k in near]
        for _, a, b in sorted(set(cand)):
            if len(self.edges) >= target:
                break
            self._add(a, b)

    def dist(self, a, b):                      # Euclidean distance (also the A* heuristic)
        (x1, y1), (x2, y2) = self.pos[a], self.pos[b]
        return math.hypot(x1 - x2, y1 - y2)

    def _add(self, a, b):
        e = (min(a, b), max(a, b))
        if a == b or e in self.edges:
            return
        self.edges.add(e)
        w = self.dist(a, b)
        self.adj[a].append((b, w))
        self.adj[b].append((a, w))             # undirected graph

    def matrix(self):                          # V x V distance matrix for Floyd-Warshall
        D = [[INF] * self.n for _ in range(self.n)]
        for i in range(self.n):
            D[i][i] = 0.0
            for j, w in self.adj[i]:
                D[i][j] = w
        return D


# ----------------------------------------------------------------------------
# 2. ALGORITHMS
# ----------------------------------------------------------------------------
def dijkstra(g, s, t):
    """Greedy: always settle the nearest unvisited node. O((V+E) log V)."""
    dist = [INF] * g.n
    parent = [-1] * g.n
    dist[s] = 0.0
    heap = [(0.0, s)]
    expanded = []
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue                            # stale heap entry
        expanded.append(u)
        if u == t:
            break
        for v, w in g.adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                parent[v] = u
                heapq.heappush(heap, (dist[v], v))
    return dist[t], _path(parent, s, t), expanded


def astar(g, s, t):
    """Best-first search ordered by f = g + h (h = straight-line distance)."""
    gs = [INF] * g.n
    parent = [-1] * g.n
    gs[s] = 0.0
    heap = [(g.dist(s, t), s)]
    closed = set()
    expanded = []
    while heap:
        _, u = heapq.heappop(heap)
        if u in closed:
            continue
        closed.add(u)
        expanded.append(u)
        if u == t:
            break
        for v, w in g.adj[u]:
            if gs[u] + w < gs[v]:
                gs[v] = gs[u] + w
                parent[v] = u
                heapq.heappush(heap, (gs[v] + g.dist(v, t), v))
    return gs[t], _path(parent, s, t), expanded


def floyd_warshall(g):
    """Dynamic programming over intermediate nodes k. Theta(V^3) time, Theta(V^2) space.
    Inner j-loop is written as a list comprehension (same logic, faster in Python)."""
    D = g.matrix()
    n = g.n
    for k in range(n):
        rowk = D[k]
        for i in range(n):
            dik = D[i][k]
            if dik == INF:
                continue
            # D[i][j] = min(D[i][j], D[i][k] + D[k][j]) for all j
            D[i] = [a if a <= dik + b else dik + b for a, b in zip(D[i], rowk)]
    return D


def _path(parent, s, t):
    path, u = [], t
    while u != -1:
        path.append(u)
        u = parent[u]
    path.reverse()
    return path if path and path[0] == s else []


# ----------------------------------------------------------------------------
# 3. DEMO  (input -> processing -> output, as in the project screenshots)
# ----------------------------------------------------------------------------
def demo(n, s, t):
    g = Graph(n)
    if not (0 <= s < n and 0 <= t < n):
        raise SystemExit(f"Source and target must be between 0 and {n - 1}")
    print("=== INPUT ===")
    print(f"Graph size : {n} nodes")
    print(f"Edges      : {len(g.edges)}")
    print(f"Source     : {s}")
    print(f"Target     : {t}")

    d1, p1, e1 = dijkstra(g, s, t)
    d2, p2, e2 = astar(g, s, t)
    D = floyd_warshall(g)
    d3 = D[s][t]

    print("\n=== PROCESSING ===")
    print(f"Dijkstra expanded {len(e1)} nodes: {e1}")
    print(f"A*       expanded {len(e2)} nodes: {e2}")

    print("\n=== OUTPUT ===")
    print(f"Dijkstra : {s} -> {t}  {d1:.2f}   path: {p1}")
    print(f"A*       : {s} -> {t}  {d2:.2f}   path: {p2}")
    print(f"Floyd-W. : {s} -> {t}  {d3:.2f}")
    ok = math.isclose(d1, d2, abs_tol=1e-9) and math.isclose(d1, d3, abs_tol=1e-9)
    print(f"All match: {ok}")


# ----------------------------------------------------------------------------
# 4. BENCHMARK  (runtime + nodes expanded, averaged over 20 source-target pairs)
# ----------------------------------------------------------------------------
def benchmark(sizes=(10, 50, 100, 500), pairs=20, plot=True):
    rnd = random.Random(7)
    rows = []
    print(f"{'n':>5} {'Edges':>6} {'Dijkstra(ms)':>13} {'A*(ms)':>10} {'Floyd-W(ms)':>12} "
          f"{'Dij nodes':>10} {'A* nodes':>9} {'Match':>6}")
    for n in sizes:
        g = Graph(n)
        qs = [(rnd.randrange(n), rnd.randrange(n)) for _ in range(pairs)]
        td = ta = 0.0
        nd = na = 0
        match = True
        t0 = time.perf_counter()
        D = floyd_warshall(g)
        tf = (time.perf_counter() - t0) * 1000
        for s, t in qs:
            a = time.perf_counter()
            d1, _, e1 = dijkstra(g, s, t)
            b = time.perf_counter()
            d2, _, e2 = astar(g, s, t)
            c = time.perf_counter()
            td += (b - a) * 1000
            ta += (c - b) * 1000
            nd += len(e1)
            na += len(e2)
            match &= math.isclose(d1, d2, abs_tol=1e-9) and math.isclose(d1, D[s][t], abs_tol=1e-9)
        row = (n, len(g.edges), td / pairs, ta / pairs, tf, nd / pairs, na / pairs, match)
        rows.append(row)
        print(f"{n:>5} {row[1]:>6} {row[2]:>13.4f} {row[3]:>10.4f} {row[4]:>12.2f} "
              f"{row[5]:>10.1f} {row[6]:>9.1f} {str(match):>6}")
    if plot:
        _plot_times(rows)
    return rows


def _plot_times(rows):
    import matplotlib.pyplot as plt
    ns = [r[0] for r in rows]
    plt.figure(figsize=(7, 4.5))
    plt.plot(ns, [r[2] for r in rows], "o-", label="Dijkstra")
    plt.plot(ns, [r[3] for r in rows], "s-", label="A*")
    plt.plot(ns, [r[4] for r in rows], "^-", label="Floyd-Warshall")
    plt.yscale("log")
    plt.xlabel("Input size n (nodes)")
    plt.ylabel("Execution time (ms, log scale)")
    plt.title("Input Size vs Execution Time")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig("performance_graph.png", dpi=150)
    print("\nSaved graph -> performance_graph.png")
    plt.show()


# ----------------------------------------------------------------------------
# 5. VISUALIZE  (map of roads + Dijkstra route + nodes explored by each algorithm)
# ----------------------------------------------------------------------------
def visualize(n, s, t):
    import matplotlib.pyplot as plt
    g = Graph(n)
    d1, p1, e1 = dijkstra(g, s, t)
    d2, p2, e2 = astar(g, s, t)
    fig, axes = plt.subplots(1, 2, figsize=(12, 5.5))
    for ax, name, d, p, ex in ((axes[0], "Dijkstra", d1, p1, e1), (axes[1], "A*", d2, p2, e2)):
        for a, b in g.edges:
            ax.plot(*zip(g.pos[a], g.pos[b]), color="#cfd8dc", lw=0.8, zorder=1)
        ax.scatter(*zip(*g.pos), s=18, color="#90a4ae", zorder=2)
        ax.scatter(*zip(*[g.pos[i] for i in ex]), s=40, color="#f2a33a", zorder=3, label=f"explored ({len(ex)})")
        ax.plot(*zip(*[g.pos[i] for i in p]), color="#1c7c7d", lw=3, zorder=4, label=f"route ({d:.2f})")
        ax.scatter(*g.pos[s], s=120, color="green", zorder=5)
        ax.scatter(*g.pos[t], s=120, color="red", zorder=5)
        ax.set_title(f"{name}: {s} -> {t}")
        ax.legend(loc="upper right")
        ax.set_aspect("equal")
    plt.tight_layout()
    plt.savefig("route_visualization.png", dpi=150)
    print("Saved picture -> route_visualization.png")
    plt.show()


# ----------------------------------------------------------------------------
if __name__ == "__main__":
    print("=== SMART ROUTE OPTIMIZATION SYSTEM ===")

    n = int(input("Enter number of nodes: "))
    s = int(input(f"Enter source node (0-{n-1}): "))
    t = int(input(f"Enter target node (0-{n-1}): "))

    if not (0 <= s < n):
        print("Invalid source node.")
        exit()

    if not (0 <= t < n):
        print("Invalid target node.")
        exit()

    if s == t:
        print("Source and target cannot be the same.")
        exit()

    demo(n, s, t)