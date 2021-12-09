package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"sort"
	"strings"
)

func calc_oxygen_rating(path string) {
	inputFile, err := os.Open(path)

	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()
	scanner := bufio.NewScanner(inputFile)
	var numbers [][]string
	for scanner.Scan() {
		numbers = append(numbers, strings.Split(scanner.Text(), ""))
	}
	var slice [][]string = numbers[:]
	// Can save a few cpu cycles by sorting first :P
	sortSlice(slice, 0)
	co2ScrubberRating := partitionNumbers(slice, 0, false)
	oxygenRating := partitionNumbers(slice, 0, true)
	fmt.Println("oxy", oxygenRating, convertBitsToInt(oxygenRating))
	fmt.Println("co2", co2ScrubberRating, convertBitsToInt(co2ScrubberRating))
}

func sortSlice(slice [][]string, bitColumn int) {
	// Sort the bit strings at bit column, "0" comes before "1"
	sort.Slice(slice, func(i1, i2 int) bool {
		return slice[i1][bitColumn] < slice[i2][bitColumn]
	})
}

func partitionNumbers(slice [][]string, bitColumn int, mostCommon bool) []string {
	sliceLen := len(slice)

	if sliceLen == 1 {
		fmt.Println("Found answer at bit position", bitColumn)
		return slice[0]
	}
	if bitColumn >= 12 {
		log.Fatal("Did not find a single value")
		return nil
	}
	sortSlice(slice, bitColumn)
	// Figure out where the border between "0" and "1" lies
	var border int
	for i := 1; i < sliceLen; i++ {
		border = i
		if slice[i-1][bitColumn] != slice[i][bitColumn] {
			break
		}
	}

	zeroesNum := border
	onesNum := sliceLen - border
	// Calculate the partition that goes to next iteration
	// Note in mostCommon mode "1" wins ties and vice versa
	var slicePartition [][]string
	if mostCommon {
		if zeroesNum > onesNum {
			slicePartition = slice[:border]
		} else {
			slicePartition = slice[border:]
		}
	} else {
		if zeroesNum > onesNum {
			slicePartition = slice[border:]
		} else {
			slicePartition = slice[:border]
		}
	}
	return partitionNumbers(slicePartition, bitColumn+1, mostCommon)
}

func convertBitsToInt(bitArray []string) int {
	var number int
	for i, v := range bitArray {
		if v == "1" {
			number = number | (1 << (12 - 1 - i))
		}
	}
	return number
}

func main() {
	calc_oxygen_rating("../input/day_3_input.txt")
}
