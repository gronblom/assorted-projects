package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
)

func read_measurements(path string) []int {
	inputFile, err := os.Open(path)

	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()
	scanner := bufio.NewScanner(inputFile)
	var measurements []int
	for scanner.Scan() {
		depth, err := strconv.Atoi(scanner.Text())
		if err != nil {
			fmt.Println(err)
			os.Exit(2)
		}
		measurements = append(measurements, depth)
	}
	return measurements
}

func arraySum(numbers ...int) int {
	sum := 0
	for _, val := range numbers {
		sum += val
	}
	return sum
}

func main() {
	measurements := read_measurements("../input/day_1_input.txt")
	windowSize := 3

	var window1 []int
	// Init first window to window2 as a "prev value", for window reuse
	window2 := measurements[:3]
	increaseNum := 0
	for i := 1; i < len(measurements)-windowSize+1; i++ {
		window1 = window2
		window2 = measurements[i : i+3]
		if arraySum(window1...) < arraySum(window2...) {
			increaseNum++
		}

	}
	fmt.Println("Number of increases: ", increaseNum)
}
