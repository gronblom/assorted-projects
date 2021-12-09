package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
)

func calc_power_consumption(path string) {
	inputFile, err := os.Open(path)

	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()
	scanner := bufio.NewScanner(inputFile)
	var oneCount [12]int
	var lineNum int
	for scanner.Scan() {
		for i, v := range strings.Split(scanner.Text(), "") {
			if v == "1" {
				oneCount[i]++
			}
		}
		lineNum++
	}
	var gammaNumber int
	halfLineNum := lineNum / 2
	for i, v := range oneCount {
		if v >= halfLineNum {
			gammaNumber = gammaNumber | (1 << (12 - 1 - i))
		}
	}
	epsilonNumber := (gammaNumber ^ 0x0FFF) & 0x0FFF
	fmt.Printf("Gamma bits:     %012b\n", gammaNumber)
	fmt.Println("Gamma number:  ", gammaNumber)
	fmt.Printf("Epsilon bits:   %012b\n", epsilonNumber)
	fmt.Println("Epsilon number:", epsilonNumber)
	fmt.Println("gamma*epsilon: ", gammaNumber*epsilonNumber)
}

func main() {
	calc_power_consumption("../input/day_3_input.txt")
}
