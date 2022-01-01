package aoc

import java.io.File
import java.util.ArrayDeque

data class Node(val name: String, val isSmallCave: Boolean, val vertices: MutableList<Node>)

data class Vertex(val node1: String, val node2: String)

fun main() {       
    var vertices = parseInput("../input/day_12_input.txt")
    val startNode = createGraph(vertices)
    val pathsPart1 = findPathsPart1(startNode)
    println("Amount of paths from start to end in part 1: ${pathsPart1.size}")
    val pathsPart2 = findPathsPart2(startNode)
    println("Amount of paths from start to end in part 2: ${pathsPart2.size}")
}

fun parseInput(path: String): MutableList<Vertex> {
    var vertices  = mutableListOf<Vertex>()
    for (line in File(path).readLines()) {
        val tokens = line.split("-")
        vertices.add(Vertex(tokens[0], tokens[1]))
    }
    return vertices
}

fun createGraph(paths: List<Vertex>): Node {
    val nodes = mutableMapOf<String, Node>()
    for (path in paths) {
        if (!nodes.contains(path.node1)) {
            nodes.put(path.node1, createNode(path.node1))
        }
        if (!nodes.contains(path.node2)) {
            nodes.put(path.node2, createNode(path.node2))
        }
        val node1 = nodes.getValue(path.node1)
        val node2 = nodes.getValue(path.node2)
        node1.vertices.add(node2)
        node2.vertices.add(node1)
    }
    for ((key, value) in nodes.entries) {
        println("${key} -> ${value.vertices.map { node -> node.name }.joinToString()}")
    }
    return nodes.getValue("start")
}

fun createNode(name: String): Node {
    val isSmallCave = name === name.lowercase()
    return Node(name, isSmallCave, mutableListOf<Node>())
}

fun findPathsPart1(startNode: Node): List<String> {
    var path = mutableListOf<String>()
    val paths = mutableListOf<String>()
    findPathsPart1_(startNode, path, paths)
    return paths
}

fun findPathsPart1_(node: Node, path: MutableList<String>, paths: MutableList<String>) {
    path.add(node.name)
    if (path[path.lastIndex] == "end") {
        paths.add(path.joinToString("-"))
    } else {
        for (connectedNode in node.vertices) {
            if (!connectedNode.isSmallCave || !path.contains(connectedNode.name)) {
                findPathsPart1_(connectedNode, path, paths)
            }
        }
    }
    path.removeLast()
}

fun findPathsPart2(startNode: Node): List<String> {
    var path = mutableListOf<String>()
    val paths = mutableListOf<String>()
    val smallCaveVisited = false
    findPathsPart2_(startNode, path, smallCaveVisited, paths)
    return paths
}

fun findPathsPart2_(node: Node, path: MutableList<String>, smallCaveVisited: Boolean, paths: MutableList<String>) {
    path.add(node.name)
    if (path[path.lastIndex] == "end") {
        paths.add(path.joinToString("-"))
    } else if (path.size > 1 && path[path.lastIndex] == "start") {

    } else {
        for (connectedNode in node.vertices) {
            if (!connectedNode.isSmallCave || !path.contains(connectedNode.name)) {
                findPathsPart2_(connectedNode, path, smallCaveVisited, paths)
            } else if (connectedNode.isSmallCave && path.contains(connectedNode.name) && !smallCaveVisited) {
                findPathsPart2_(connectedNode, path, true, paths)
            }
        }
    }
    path.removeLast()
}
