package aoc

import java.io.File
import java.util.ArrayDeque


data class InsertionRule(val from: String, val to: String)

enum class FoldDirection {
    UP, LEFT
}

data class FoldInstruction(val direction: FoldDirection, val position: Int)

typealias Manual = MutableList<MutableList<Boolean>>

fun main() {       
    var (polymerTemplate, insertionRules) = parseInput("../input/day_14_input.txt")
    println("Template:      $polymerTemplate")
    val letterCount = mutableMapOf<Char, Long>()
    val pairMapping = createPairMapping(insertionRules)
    // Count initial letters in polymer template
    countLetters(polymerTemplate, letterCount)
    var pairCount = initPairCount(polymerTemplate)

    for (step in 1..40) {
        pairCount = applyInsertions(pairCount, insertionRules, pairMapping, letterCount)
        if (step == 10) {
            println("Part 1 answer: ${calcAnswer(letterCount)}")
        }
    }
    println("Part 2 answer: ${calcAnswer(letterCount)}")
}

fun applyInsertions(pairCount: MutableMap<String, Long>, insertionRules: MutableMap<String, Char>,
                    pairMapping: Map<String, List<String>>,
                    letterCount: MutableMap<Char, Long>): MutableMap<String, Long> {
        var newPairCount = mutableMapOf<String, Long>()
        for ((key, value) in pairCount.entries) {        
            pairMapping.getValue(key).forEach {
                newPairCount.merge(it, value, Long::plus)
            } 
            val newChar = insertionRules.getValue(key)
            letterCount.merge(newChar, value, Long::plus)
        }
        return newPairCount
}

fun calcAnswer(letterCount: MutableMap<Char, Long>): Long {
    val sortedLetterCount = letterCount.toList().sortedBy { (_, value) -> value }
    return sortedLetterCount[sortedLetterCount.size-1].second - sortedLetterCount[0].second
}

fun initPairCount(polymerTemplate: String): MutableMap<String, Long> {
    val pairCount =  mutableMapOf<String, Long>()
    for (i in 0..polymerTemplate.length-2) {
        val pair = polymerTemplate.substring(i, i+2)
        pairCount.merge(pair, 1, Long::plus) 
    }
    return pairCount
}

// Each insertion creates two new pairs, create such mapping
fun createPairMapping(insertionRules: MutableMap<String, Char>): Map<String, List<String>> {
    val pairMapping = mutableMapOf<String, List<String>>()
    for ((key, value) in insertionRules.entries) {
        pairMapping.put(key, listOf(key.substring(0,1).plus(Character.toString(value)),
                        Character.toString(value).plus(key.substring(1,2))))
    }
    return pairMapping
}

fun countLetters(s: String, letterCount: MutableMap<Char, Long>) {
    s.forEach{
        letterCount[it] = letterCount.getOrDefault(it, 0) + 1
    }
}

fun parseInput(path: String): Pair<String, MutableMap<String, Char>> {
    var polymerTemplate = ""
    val insertionRules = mutableMapOf<String, Char>()
    var parsingPolymerTemplate = true
    
    for (line in File(path).readLines()) {
        if (parsingPolymerTemplate) {
            polymerTemplate = line
            parsingPolymerTemplate = false
        } else if(!line.isEmpty()) {
            val tokens = line.split(" -> ")
            insertionRules.put(tokens[0], tokens[1].toCharArray()[0])
        } 
    }
    return Pair(polymerTemplate, insertionRules)
}
