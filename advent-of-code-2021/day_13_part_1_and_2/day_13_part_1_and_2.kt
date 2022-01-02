package aoc

import java.io.File
import java.util.ArrayDeque


data class Coords(val x: Int, val y: Int)

enum class FoldDirection {
    UP, LEFT
}

data class FoldInstruction(val direction: FoldDirection, val position: Int)

typealias Manual = MutableList<MutableList<Boolean>>

fun main() {       
    var (dots, foldInstructions) = parseInput("../input/day_13_input.txt")
    var manual = createManual(dots)
    var foldedManual = foldManual(manual, foldInstructions)
    println("Folded manual:")
    println(manualToString(foldedManual))
}

fun parseInput(path: String): Pair<List<Coords>, List<FoldInstruction>> {
    val dots = mutableListOf<Coords>()
    val foldInstructions = mutableListOf<FoldInstruction>()
    var parsingCoordinates = true
    
    for (line in File(path).readLines()) {
        if (line.isEmpty()) {
            parsingCoordinates = false
        } else if (parsingCoordinates) {
            val coords = parseCoords(line)
            dots.add(coords)
        } else {
            val foldInstruction = parseFoldInstruction(line)
            foldInstructions.add(foldInstruction)
        }
    }
    return Pair(dots, foldInstructions)
}

fun parseCoords(line: String): Coords {
    val tokens = line.split(",")
    val x = tokens[0].toInt()
    val y = tokens[1].toInt()
    return Coords(x, y)
}

fun parseFoldInstruction(line: String): FoldInstruction {
    val tokens = line.split(" ")[2].split("=")
    val foldDirection = if (tokens[0]=="x") FoldDirection.UP else FoldDirection.LEFT
    val position = tokens[1].toInt()
    return FoldInstruction(foldDirection, position)

}

fun findMaxCoords(coords: List<Coords>): Pair<Int, Int> {
    var maxX = 0
    var maxY = 0
    for (c in coords) {
        if (c.x > maxX) {
            maxX = c.x
        }
        if (c.y > maxY) {
            maxY = c.y
        }
    }
    return Pair(maxX, maxY)
}

fun createManual(dots: List<Coords>): Manual {
    var manual = createEmptyManual(dots)
    for (dot in dots) {
        manual[dot.y][dot.x] = true
    }
    return manual
}

fun createEmptyManual(dots: List<Coords>): Manual {
    val (maxX, maxY) = findMaxCoords(dots)
    var manual = mutableListOf<MutableList<Boolean>>()
    for (y in 0..maxY) {
        var row = mutableListOf<Boolean>()
        manual.add(row)
        for (x in 0..maxX) {
            row.add(false)
        }
    }
    return manual
}

fun foldManual(_manual: Manual, foldInstructions: List<FoldInstruction>): Manual {
    var manual = _manual
    var first = true
    for (foldInstruction in foldInstructions) {
        if (foldInstruction.direction == FoldDirection.UP) {
            manual = foldUp(manual, foldInstruction.position)
        } else {
            manual = foldLeft(manual, foldInstruction.position)
        }
        if (first) {
            println("Number of dots after first fold: ${countDots(manual)}")
            first = false
        }
    }

    return manual
}

fun foldLeft(manual: Manual, position: Int): Manual {
    val xSize = manual[0].size
    val ySize = manual.size
    var foldedManual = manual.slice(0..position-1).toMutableList()
    var currentRow = position-1
    for (y in position+1..ySize-1) {
        for(x in 0..xSize-1) {
            if (manual[y][x]) {
                foldedManual[currentRow][x] = true
            }
        }
        currentRow--
    }
    return foldedManual
} 
              
fun foldUp(manual: Manual, position: Int): Manual {
    var foldedManual = mutableListOf<MutableList<Boolean>>()
    for (row in manual) {
        var rowLeft = row.slice(0..position-1).toMutableList()
        foldedManual.add(rowLeft)
        var rowRight = row.slice(position+1..row.size-1)

        for (x in 0..rowRight.size-1) {
            if(rowRight[x]) {
                rowLeft[position-1-x] = true
            }
        }
    }
    return foldedManual
}

fun countDots(manual: Manual): Int {
    return manual.flatMap { it.toList() }.filter { it }.size
}

fun manualToString(manual: Manual): String {
    var sb = StringBuilder()
    for (row in manual) {
        for (col in row) {
            sb.append(if (col) "#" else ".")
        }
        sb.append("\n")
    }
    return sb.toString()
}
