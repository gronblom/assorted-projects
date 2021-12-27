package aoc

import java.io.File
import java.util.ArrayDeque

fun main() {       
    val lines = parseInput("../input/day_10_input.txt")
    val points = checkSyntax(lines)
    println(points.sum())
}

fun parseInput(path: String): List<String> {
    var lines = mutableListOf<String>()
    for (line in File(path).readLines()) {
        lines.add(line)
    }
    return lines
}

fun checkSyntax(lines: List<String>): List<Int> {
    val starters = setOf('(', '[', '{', '<')
    val pairs = mapOf(')' to '(', ']' to '[', '}' to '{', '>' to '<')
    val pointTable = mapOf(')' to 3, ']' to 57, '}' to 1197, '>' to 25137)
    val points = mutableListOf<Int>()

    for (line in lines) {
        var stack = ArrayDeque<Char>()
        for (char in line.toCharArray()){
            if (char in starters) {
                stack.push(char)
            } else {
                val expected = pairs.getValue(char)
                if (expected == stack.peek()) {
                    stack.pop()
                } else {
                    points.add(pointTable.getValue(char))
                    break
                }
            }
        }
    }
    return points
}
