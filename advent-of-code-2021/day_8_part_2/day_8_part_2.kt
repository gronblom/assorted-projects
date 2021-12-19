package aoc

import java.io.File
import java.util.Arrays

val segments = listOf("abcefg", "cf", "acdeg", "acdfg", "bcdf", "abdfg", "abdefg", "acf", "abcdefg", "abcdfg")
val segmentsMap = initSegmentsMap(segments)

fun initSegmentsMap(segments: List<String>): Map<String, Int> {
    val map:  MutableMap<String, Int> = mutableMapOf()
    for (i in segments.indices) {
        map.put(segments[i], i)
    }
    return map
}

fun main() {                        
    println("Segment frequencies: ${countLetters(segments)}")
    var sum = 0
    for (line in File("../input/day_8_input.txt").readLines()) {
        val tokens = line.split(" | ")
        val uniqueEncodedNumbers = tokens[0].split(" ")
        val encodedNumbers = tokens[1].split(" ")
        val decodedNumber = solveInput(uniqueEncodedNumbers, encodedNumbers)
        sum += decodedNumber
    }
    println("Answer: $sum")
}


fun solveInput(segments: List<String>, numbers: List<String>): Int {
    val numberMapping = resolveNumberMappings(segments)
    val segmentLetterCount = countLetters(segments)
    val segmentMappings: MutableMap<Char, Char> = resolveSegmentMappings(numberMapping, segmentLetterCount)
    return decodeNumbers(numbers, segmentMappings)
}

fun countLetters(segments: List<String>): MutableMap<Char, Int> {
    val segmentLetterCount:  MutableMap<Char, Int> = mutableMapOf('a' to 0, 'b' to 0 , 'c' to 0, 'd' to 0,
                                                                  'e' to 0, 'f' to 0, 'g' to 0)
    for (segment in segments) {
        for (letter in segment.toCharArray()) {
            segmentLetterCount.merge(letter, 1, Int::plus)
        }
    }
    return segmentLetterCount
}

/*
 * Resolve the numbers which can be deduced by the amount of segments.
 */
fun resolveNumberMappings(segments: List<String>): MutableMap<Int, String> {
    val numberMapping: MutableMap<Int, String> = mutableMapOf()
    // Deduce numbers by number of segments
    for (segment in segments) {
        when (segment.length) {
            2 -> numberMapping.put(1, segment)
            4 -> numberMapping.put(4, segment)
            3 -> numberMapping.put(7, segment)
            7 -> numberMapping.put(8, segment)
        }
    }
    return numberMapping
}

/*
 * Deduce segments by their frequency. For example. the letter that occurs four times is 'e'
 * Ambigous frequencies are resolved by checking if they are found in segment "one" or "fo
 */
fun resolveSegmentMappings(numberMapping: MutableMap<Int, String>,
                           segmentLetterCount: MutableMap<Char, Int>): MutableMap<Char, Char>  {
    val segmentMappings:  MutableMap<Char, Char> = mutableMapOf()
    for ((key, value) in segmentLetterCount.entries) {
        if (value == 4){
            segmentMappings.put(key, 'e')
        } else if (value == 6) {
            segmentMappings.put(key, 'b')
        } else if (value == 7) {
            if (Character.toString(key) in numberMapping.getValue(4)) {
                segmentMappings.put(key, 'd')
            } else {
                segmentMappings.put(key, 'g')
            }
        }  else if (value == 8) {
            if (!(Character.toString(key) in numberMapping.getValue(1))) {
                segmentMappings.put(key, 'a')
            } else {
                segmentMappings.put(key, 'c')
            }
        } else if (value == 9) {
            segmentMappings.put(key, 'f')
        }
    }
    return segmentMappings
}

fun decodeNumbers(encodedNumbers: List<String>, segmentMappings: MutableMap<Char, Char>): Int {
    var decodedNumbers: MutableList<Int> = mutableListOf()
    var decodedNumber = ""
    for (number in encodedNumbers) {
        var decodedLetters: MutableList<Char> = mutableListOf()
        for (char in number.toCharArray()) {
            decodedLetters.add(segmentMappings.getValue(char))
        }
        decodedLetters.sort()
        val decodedSegment = decodedLetters.toTypedArray().joinToString("")
        decodedNumbers.add(segmentsMap.getValue(decodedSegment))
        decodedNumber += segmentsMap.getValue(decodedSegment)
    }
    return decodedNumber.toInt()
}

