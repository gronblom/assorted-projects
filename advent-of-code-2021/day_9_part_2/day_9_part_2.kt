package aoc

import java.io.File
import java.util.ArrayDeque

fun main() {                        
    var heightMap = parseHeightMap("../input/day_9_input.txt")
    val pointFlows = calculateFlows(heightMap)
    val basinSizes = findBasins(heightMap, pointFlows)
    basinSizes.sorted()
    val basinNum = basinSizes.size
    println("Three largest basins: ${basinSizes.sorted().subList(basinNum - 3, basinNum)}")
}

fun calculateFlows(heightMap: List<List<Int>>): List<List<List<Pair<Int, Int>>>> {
    val maxX = heightMap[0].size - 1
    val maxY = heightMap.size - 1
    var flows = mutableListOf<List<List<Pair<Int, Int>>>>()

    for (y in 0..maxY) {
        val flowsRow = mutableListOf<List<Pair<Int, Int>>>()
        for (x in 0..maxX) {
            flowsRow.add(calculateOutflows(heightMap, x, y, maxX, maxY))
            
        }
        flows.add(flowsRow)
    }
    return flows
}

fun calculateOutflows(heightMap: List<List<Int>>, x: Int, y: Int, maxX: Int, maxY: Int): List<Pair<Int, Int>> {
    val value = heightMap[y][x]
    // Check to which directions this point flows
    
    var outflows = mutableListOf<Pair<Int, Int>>()
    if (value == 9) {
        return outflows
    }
    if (x - 1 >= 0 && heightMap[y][x - 1] < value && heightMap[y][x - 1] < 9) {
        outflows.add(Pair(x-1, y))
    }
    if (x + 1 <= maxX && heightMap[y][x+1] < value && heightMap[y][x + 1] < 9) {
        outflows.add(Pair(x+1, y))
    }
    if (y - 1 >= 0 && heightMap[y-1][x] < value && heightMap[y-1][x] < 9) {
        outflows.add(Pair(x, y-1))
    }
    if (y + 1 <= maxY && heightMap[y+1][x] < value && heightMap[y+1][x] < 9) {
        outflows.add(Pair(x, y+1))
    }
    return outflows
}

fun parseHeightMap(path: String): List<List<Int>> {
    var heightMap = mutableListOf<List<Int>>()
    for (line in File(path).readLines()) {
        val numbers = line.toCharArray().map {c -> Character.toString(c).toInt() }
        heightMap.add(numbers)
    }
    return heightMap
}

fun findBasins(heightMap: List<List<Int>>, pointFlows: List<List<List<Pair<Int, Int>>>>): List<Int> {
    val basinSizes = mutableListOf<Int>()
    val maxX = heightMap[0].size - 1
    val maxY = heightMap.size - 1
    for (y in 0..maxY) {
        for (x in 0..maxX) {
           val point = heightMap[y][x]
           val outflows = pointFlows[y][x]
           if (point < 9 && outflows.isEmpty()) {
               var basinSize = calculateBasinSize(x, y, pointFlows, maxX, maxY)
               basinSizes.add(basinSize)
           } 
        }
    }
    return basinSizes
}

fun calculateBasinSize(x: Int, y: Int, pointFlows: List<List<List<Pair<Int, Int>>>>,
                       maxX: Int, maxY: Int): Int {
    val visitedPoints = mutableSetOf<Pair<Int, Int>>()
    val pointsToVisit = ArrayDeque<Pair<Int, Int>>()
    pointsToVisit.push(Pair(x,y))
    while (!pointsToVisit.isEmpty()) {
        val currentCoords = pointsToVisit.pop()
        visitedPoints.add(currentCoords)
        val neighbors = findNeighbors(currentCoords.first, currentCoords.second, maxX, maxY)
        for (neighbor in neighbors) {
            if (currentCoords in pointFlows[neighbor.second][neighbor.first]) {
                if (!visitedPoints.contains(neighbor)) {
                    visitedPoints.add(currentCoords)
                    pointsToVisit.push(neighbor)
                }
            }
        }
    }
    return visitedPoints.size
}

fun findNeighbors(x: Int, y: Int, maxX: Int, maxY: Int): List<Pair<Int, Int>> {
    val neighbors = mutableListOf<Pair<Int, Int>>()
    if (x - 1 >= 0) {
        neighbors.add(Pair(x-1, y))
    }
    if (x + 1 <= maxX)  {
        neighbors.add(Pair(x+1, y))
    }
    if (y - 1 >= 0) {
        neighbors.add(Pair(x, y-1))
    }
    if (y + 1 <= maxY) {
        neighbors.add(Pair(x, y+1))
    }
    return neighbors
}
