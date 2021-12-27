package aoc

import java.io.File
import java.util.ArrayDeque

fun main() {       
    val lines = parseInput("../input/day_10_input.txt")
    val points = completeOpenChunks(lines)
    val sortedPoints = points.sorted()
    val midIndex = sortedPoints.size / 2
    println("Mid index: $midIndex")
    println("Mid score: ${sortedPoints.get(midIndex)}")
}

fun parseInput(path: String): List<String> {
    var lines = mutableListOf<String>()
    for (line in File(path).readLines()) {
        lines.add(line)
    }
    return lines
}

fun completeOpenChunks(lines: List<String>): List<Long> {
    val starters = setOf('(', '[', '{', '<')
    val pairs = mapOf(')' to '(', ']' to '[', '}' to '{', '>' to '<')   
    val points = mutableListOf<Long>()
    for (line in lines) {
        var stack = ArrayDeque<Char>()
        var corrupted = false
        for (char in line.toCharArray()){
            if (char in starters) {
                stack.push(char)
            } else {
                val expected = pairs.getValue(char)
                if (expected == stack.peek()) {
                    stack.pop()
                } else {
                    // Corrupted line
                    corrupted = true
                    break
                }
            }
        }
        if (!corrupted && !stack.isEmpty()) {
           val linePoints = calculatePoints(stack)
           points.add(linePoints)
        }
    }
    return points
}

fun calculatePoints(stack: ArrayDeque<Char>): Long {
    val pairs = mapOf('(' to ')', '[' to ']', '{' to '}', '<' to '>')
    val pointTable = mapOf(')' to 1, ']' to 2, '}' to 3, '>' to 4)
    val it: Iterator<Char> = stack.asIterable().iterator()
    var points: Long = 0
    while (it.hasNext()) {
        val char = it.next()
        val completion = pairs.getValue(char)
        points = 5 * points + pointTable.getValue(completion)
    }
    return points
}
