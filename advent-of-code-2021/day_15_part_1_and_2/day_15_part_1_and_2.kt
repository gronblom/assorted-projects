package aoc

import java.io.File
import java.util.PriorityQueue


data class Coords(val x: Int, val y: Int)

data class CoordsDistance(val coords: Coords, val distance: Int) : Comparable<CoordsDistance> {

  override fun compareTo(other: CoordsDistance) = 
    distance - other.distance
}


typealias Map2D<T> = MutableList<MutableList<T>>


fun main() {       
    val caveMap = parseInput("../input/day_15_input.txt")
    val start = Coords(0, 0)
    val end = Coords(caveMap[0].size - 1, caveMap.size - 1)
    val (distances, _) = dijkstras(caveMap, start)
    println("Part 1 answer: ${distances[end.y][end.x]}")
    val bigMap = createBigMap(caveMap)
    val end2 = Coords(bigMap[0].size - 1, bigMap.size - 1)
    val (distances2, _) = dijkstras(bigMap, start)
    println("Part 2 answer: ${distances2[end2.y][end2.x]}")
    
}

fun dijkstras(caveMap: Map2D<Int>, start: Coords): Pair<Map2D<Int>, Map2D<Coords?>> {
    val (distances, prev) = initPathMaps(caveMap, start)
    val maxX = caveMap[0].size - 1
    val maxY = caveMap.size - 1
    val queue = PriorityQueue<CoordsDistance>()
    queue.add(CoordsDistance(start, distances[start.y][start.x]))
    while (!queue.isEmpty()) {
        val position = queue.remove().coords
        val neighbors = findNeighbors(position.x, position.y, maxX, maxY)
        for (neighbor in neighbors) {
            val alt = distances[position.y][position.x] + caveMap[neighbor.y][neighbor.x]
            if (alt < distances[neighbor.y][neighbor.x]) {
                distances[neighbor.y][neighbor.x] = alt
                prev[neighbor.y][neighbor.x] = position
                // Add to queue if not already there
                if (!queue.any { it.coords.x == neighbor.x && it.coords.y == neighbor.y }) {
                    queue.add(CoordsDistance(neighbor, alt))
                }
            }
        }
    }
    return Pair(distances, prev)
}

fun createBigMap(caveMap: Map2D<Int>): Map2D<Int> {
    var bigMap = mutableListOf<MutableList<Int>>()

    val incRiskLevel : (Int) -> Int = { it: Int ->
                                            when {
                                                it + 1 > 9 -> 1
                                                else -> it + 1
                                        } }
    
    for (row in caveMap) {
        var bigRow = row.toMutableList()
        var prevRow = row
        for (y in 1..4) {
            val nextRow = prevRow.map { incRiskLevel(it) }.toMutableList()
            bigRow.addAll(nextRow)
            prevRow = nextRow
        }
        bigMap.add(bigRow)
    }

    var prevRows = bigMap
    for (y in 1..4) {
        var nextRows = mutableListOf<MutableList<Int>>()
        for (row in prevRows) {
            var nextRow = row.map { incRiskLevel(it) }.toMutableList()
            nextRows.add(nextRow)

        }
        bigMap.addAll(nextRows)
        prevRows = nextRows
    }
    return bigMap
}

fun parseInput(path: String): Map2D<Int> {
    var map = mutableListOf<MutableList<Int>>()
    for (line in File(path).readLines()) {
        val numbers = line.toCharArray().map {c -> Character.toString(c).toInt() }.toMutableList()
        map.add(numbers)
    }
    return map
}

fun initPathMaps(map: Map2D<Int>, start: Coords): Pair<Map2D<Int>, Map2D<Coords?>>  {
    var distances = mutableListOf<MutableList<Int>>()
    var prev = mutableListOf<MutableList<Coords?>>()
    for (row in map) {
        distances.add(row.map { _ -> Int.MAX_VALUE }.toMutableList())
        prev.add(row.map { _ -> null }.toMutableList())
    }
    distances[start.y][start.x] = 0
    return Pair(distances, prev)
}

fun findNeighbors(x: Int, y: Int, maxX: Int, maxY: Int): List<Coords> {
    val neighbors = mutableListOf<Coords>()
    if (x - 1 >= 0) {
        neighbors.add(Coords(x-1, y))
    }
    if (x + 1 <= maxX)  {
        neighbors.add(Coords(x+1, y))
    }
    if (y - 1 >= 0) {
        neighbors.add(Coords(x, y-1))
    }
    if (y + 1 <= maxY) {
        neighbors.add(Coords(x, y+1))
    }
    return neighbors
}
