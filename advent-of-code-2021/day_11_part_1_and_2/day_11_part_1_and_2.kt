package aoc

import java.io.File
import java.util.ArrayDeque

data class Coords(val x: Int, val y: Int)

fun main() {       
    // Part 1
    var grid = parseInput("../input/day_11_input.txt")
    var flashNum = 0
    for (i in 1..100) {
        flashNum += simulateFlashes(grid)
    }
    println("Flashes after 100 steps: $flashNum")
    // Part 2
    grid = parseInput("../input/day_11_input.txt")
    val octopusNum = grid.size * grid[0].size
    for (i in 1..1000) {
        flashNum = simulateFlashes(grid)
        if (flashNum == octopusNum) {
            println("All octopuses flash at step $i")
            break
        }
    }
}

fun parseInput(path: String): MutableList<MutableList<Int>> {
    var grid  = mutableListOf<MutableList<Int>>()
    for (line in File(path).readLines()) {
        grid.add(line.toCharArray().map { n -> n.digitToInt() }.toMutableList())
    }
    return grid 
}

fun simulateFlashes(grid: MutableList<MutableList<Int>>): Int {
    var flashes = increaseEnergyLevel(grid)
    var flashNum = 0
    while (!flashes.isEmpty()) {
        flashNum += flashes.size
        flashes = applyFlashes(grid, flashes)
    }
    return flashNum
}

fun increaseEnergyLevel(grid: MutableList<MutableList<Int>>): Set<Coords> {
    var flashes = mutableSetOf<Coords>()
    for (y in grid.indices) {
        for (x in grid[y].indices) {
            grid[y][x] += 1
            if (grid[y][x] > 9) {
                flashes.add(Coords(x, y))
                grid[y][x] = 0
            }
        }
    }
    return flashes
}

fun applyFlashes(grid: MutableList<MutableList<Int>>, flashes: Set<Coords>): Set<Coords> {
        val newFlashes = mutableSetOf<Coords>()
        for(flash in flashes) {
            val neighbors = getNeighbors(grid, flash.x, flash.y)
            for (neighbor in neighbors) {
                if (grid[neighbor.y][neighbor.x] != 0) {
                    grid[neighbor.y][neighbor.x] += 1
                    if (grid[neighbor.y][neighbor.x] > 9) {
                        newFlashes.add(neighbor)
                        grid[neighbor.y][neighbor.x] = 0
                    }
                }
            }
        }
        return newFlashes
}

fun getNeighbors(grid: MutableList<MutableList<Int>>, x: Int, y: Int): List<Coords> {
    val neighbors = mutableListOf<Coords>()
    if (x > 0) {
        neighbors.add(Coords(x - 1, y))
        if (y > 0) {
            neighbors.add(Coords(x - 1, y - 1))
        }
        if (y < grid.size - 1) {
            neighbors.add(Coords(x - 1, y + 1))
        }
    }
    if (x < grid[0].size - 1) {
        neighbors.add(Coords(x + 1, y))
        if (y > 0) {
            neighbors.add(Coords(x + 1, y - 1))
        }
        if (y < grid.size - 1) {
            neighbors.add(Coords(x + 1, y + 1))
        }
    }
    if (y > 0) {
        neighbors.add(Coords(x, y - 1))
    }
    if (y < grid.size - 1) {
        neighbors.add(Coords(x, y + 1))
    }
    return neighbors
}
