package main

import (
	"bufio"
	"fmt"
	"log"
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

func simulatePopulation(fishPopulationBuckets []int, days int) []int {
	for day := 0; day < days; day++ {
		newFish := fishPopulationBuckets[0]
		for i := range fishPopulationBuckets {
			if i == 0 {
				continue
			} else {
				fishPopulationBuckets[i-1] = fishPopulationBuckets[i]
			}
		}
		fishPopulationBuckets[6] += newFish
		fishPopulationBuckets[8] = newFish
	}
	return fishPopulationBuckets
}

func sortPopulation(fishPopulation []int) []int {
	fishPopulationBuckets := make([]int, 9)
	for _, fish := range fishPopulation {
		fishPopulationBuckets[fish]++
	}
	return fishPopulationBuckets
}

func calculateTotalPopulation(fishPopulationBuckets []int) int {
	sum := 0
	for _, populationBucket := range fishPopulationBuckets {
		sum += populationBucket
	}
	return sum
}

func main() {
	initialPopulation := parseInitialPopulation("../input/day_6_input.txt")
	fishPopulationBuckets := sortPopulation(initialPopulation)
	simulatePopulation(fishPopulationBuckets, 80)
	sum := calculateTotalPopulation(fishPopulationBuckets)
	fmt.Println("Lantern fish after 80 days:", sum)
	fishPopulationBuckets = sortPopulation(initialPopulation)
	simulatePopulation(fishPopulationBuckets, 256)
	sum = calculateTotalPopulation(fishPopulationBuckets)
	fmt.Println("Lantern fish after 256 days:", sum)
}
