package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

func parseInitialPopulation(path string) []int {
	inputFile, err := os.Open(path)

	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()
	scanner := bufio.NewScanner(inputFile)
	var initialState []int

	for scanner.Scan() {
		for _, val := range strings.Split(scanner.Text(), ",") {
			intVal, err := strconv.Atoi(val)

			if err != nil {
				log.Fatal(err)
			}
			initialState = append(initialState, intVal)
		}
	}
	return initialState
}

func calculateSum(numbers []int) int {
	sum := 0
	for _, numbers := range numbers {
		sum += numbers
	}
	return sum
}

func main() {
	initialPositions := parseInitialPopulation("../input/day_7_input.txt")
	//fmt.Println(initialPositions)
	sum := calculateSum(initialPositions)
	meanPosition := math.Round(float64(sum)/float64(len(initialPositions))) - 1
	fmt.Println("Mean position:", meanPosition)
	minFuelPart1 := math.MaxInt64
	minFuelPart2 := math.MaxInt64
	for targetPosition := range initialPositions {
		fuelPart1 := 0
		fuelPart2 := 0
		for _, position := range initialPositions {
			stepsAway := int(math.Abs(float64(position) - float64(targetPosition)))
			fuelPart1 += stepsAway
			fuelPart2 += (stepsAway * (stepsAway + 1)) / 2
		}
		if fuelPart1 < minFuelPart1 {
			minFuelPart1 = fuelPart1
		}
		if fuelPart2 < minFuelPart2 {
			minFuelPart2 = fuelPart2
		}
	}
	fmt.Println("Min fuel part 1", minFuelPart1)
	fmt.Println("Min fuel part 2", minFuelPart2)
}
