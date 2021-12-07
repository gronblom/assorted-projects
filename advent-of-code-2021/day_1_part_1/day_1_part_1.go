package main

import (
	"bufio"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
)

func main() {
	inputFile, err := os.Open("../input/day_1_input.txt")

	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()

	scanner := bufio.NewScanner(inputFile)

	var prevDepth int = math.MaxInt64
	increaseNum := 0
	for scanner.Scan() {
		depth, err := strconv.Atoi(scanner.Text())
		if err != nil {
			// handle error
			fmt.Println(err)
			os.Exit(2)
		}
		if depth > prevDepth {
			increaseNum += 1
		}
		prevDepth = depth
	}
	fmt.Println("Number of increases:", increaseNum)
}
