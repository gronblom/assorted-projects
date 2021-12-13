package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Line struct {
	fromX, fromY int
	toX, toY     int
}

func parse_lines(path string) []Line {
	inputFile, err := os.Open(path)

	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()
	scanner := bufio.NewScanner(inputFile)
	var lines []Line

	var coords []int = make([]int, 4)
	for scanner.Scan() {
		index := 0
		for _, tokens := range strings.Split(scanner.Text(), " -> ") {
			for _, val := range strings.Split(tokens, ",") {
				intVal, err := strconv.Atoi(val)
				if err != nil {
					log.Fatal(err)
				}
				coords[index] = intVal
				index++
			}
		}
		line := Line{fromX: coords[0], fromY: coords[1], toX: coords[2], toY: coords[3]}
		lines = append(lines, line)

	}
	return lines
}

func createDiagram(width, height int) [][]int {
	var diagram = make([][]int, width)
	for i := range diagram {
		diagram[i] = make([]int, height)
	}
	return diagram
}

func drawLines(lines []Line, diagram [][]int) {
	for _, line := range lines {
		if line.fromX == line.toX { // Vertical line
			if line.fromY < line.toY {
				for y := line.fromY; y <= line.toY; y++ {
					diagram[y][line.fromX]++
				}
			} else {
				for y := line.fromY; y >= line.toY; y-- {
					diagram[y][line.fromX]++
				}
			}
		} else if line.fromY == line.toY { // Horizontal line
			if line.fromX < line.toX {
				for x := line.fromX; x <= line.toX; x++ {
					diagram[line.fromY][x]++
				}
			} else {
				for x := line.fromX; x >= line.toX; x-- {
					diagram[line.fromY][x]++
				}
			}
		} else if line.fromX < line.toX && line.fromY < line.toY { // Diagonal line, right down
			for x, y := line.fromX, line.fromY; x <= line.toX; x, y = x+1, y+1 {
				diagram[y][x]++
			}
		} else if line.fromX < line.toX && line.fromY > line.toY { // Diagonal line, right up
			for x, y := line.fromX, line.fromY; x <= line.toX; x, y = x+1, y-1 {
				diagram[y][x]++
			}
		} else if line.fromX > line.toX && line.fromY < line.toY { // Diagonal line, left down
			for x, y := line.fromX, line.fromY; x >= line.toX; x, y = x-1, y+1 {
				diagram[y][x]++
			}
		} else if line.fromX > line.toX && line.fromY > line.toY { // Diagonal line, left up
			for x, y := line.fromX, line.fromY; x >= line.toX; x, y = x-1, y-1 {
				diagram[y][x]++
			}
		}
	}
}

func calcOverlaps(diagram [][]int) int {
	overlaps := 0
	for _, row := range diagram {
		for _, val := range row {
			if val >= 2 {
				overlaps++
			}
		}
	}
	return overlaps
}

func main() {
	lines := parse_lines("../input/day_5_input.txt")
	diagram := createDiagram(1000, 1000)
	drawLines(lines, diagram)
	overlaps := calcOverlaps(diagram)
	fmt.Println("Overlaps", overlaps)

}
