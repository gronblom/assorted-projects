package aoc

import java.io.File

fun main() {                        
    var heightMap = parseHeightMap("../input/day_9_input.txt")
    val maxX = heightMap[0].size - 1
    val maxY = heightMap.size - 1
    var lowestPoints = mutableListOf<Int>()
    for (y in 0..maxY) {
        println(heightMap[y])
        for (x in 0..maxX) {
            if (isLowestPoint(heightMap, x, y, maxX, maxY)) {
                lowestPoints.add(heightMap[y][x] + 1)
            }
        }
    }
    println("Answer: ${lowestPoints.sum()}")
}

fun isLowestPoint(heightMap: List<List<Int>>, x: Int, y: Int, maxX: Int, maxY: Int): Boolean {
    val value = heightMap[y][x]
    if ((x - 1) >= 0 && heightMap[y][x - 1] <= value) {
        return false
    }
    if ((x + 1) <= maxX && heightMap[y][x+1] <= value) {
        return false
    }
    if ((y - 1) >= 0 && heightMap[y-1][x] <= value) {
        return false
    }
    if ((y + 1) <= maxY && heightMap[y+1][x] <= value) {
        return false
    }
    return true
}

fun parseHeightMap(path: String): List<List<Int>> {
    var heightMap = mutableListOf<List<Int>>()
    for (line in File(path).readLines()) {
        val numbers = line.toCharArray().map {c -> Character.toString(c).toInt() }
        heightMap.add(numbers)
    }
    return heightMap
}
