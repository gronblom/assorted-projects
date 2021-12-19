package aoc

import java.io.File

fun main() {                        
    val map:  MutableMap<String, Int> = mutableMapOf("one" to 0, "four" to 0 , "seven" to 0, "eight" to 0)
    println(map::class.simpleName)
    for (line in File("../input/day_8_input.txt").readLines()) {
        val numbers = line.split(" | ")[1].split(" ")
        for (number in numbers) {
            when (number.length) {
                2 -> map.merge("one", 1, Int::plus)
                4 -> map.merge("four", 1, Int::plus)
                3 -> map.merge("seven", 1, Int::plus)
                7 -> map.merge("eight", 1, Int::plus)
            }
        }
    }
    println(map)
    println(map.toList().map { it.second }.sum())
}
