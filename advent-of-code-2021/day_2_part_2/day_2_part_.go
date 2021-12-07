package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type Direction int

const (
	Forward Direction = iota
	Up
	Down
)

type Command struct {
	direction Direction
	units     int
}

func parse_direction(token string) Direction {
	switch token {
	case "forward":
		return Forward
	case "up":
		return Up
	case "down":
		return Down
	default:
		fmt.Println("Invalid direction:", token)
		os.Exit(2)
		return -1
	}
}

func parse_units(token string) int {
	units, err := strconv.Atoi(token)
	if err != nil {
		fmt.Println(err)
		os.Exit(2)
	}
	return units
}

func parse_commands(path string) []Command {
	inputFile, err := os.Open(path)

	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()
	scanner := bufio.NewScanner(inputFile)
	var commands []Command
	for scanner.Scan() {
		tokens := strings.Split(scanner.Text(), " ")
		direction := parse_direction(tokens[0])
		units := parse_units(tokens[1])
		commands = append(commands, Command{direction, units})
	}
	return commands
}

func calculate_destination(commands []Command) (int, int) {
	position := 0
	depth := 0
	aim := 0
	for _, v := range commands {
		switch v.direction {
		case Forward:
			position += v.units
			depth += aim * v.units
		case Up:
			aim -= v.units
		case Down:
			aim += v.units
		}
	}
	return position, depth
}

func main() {
	commands := parse_commands("../input/day_2_input.txt")
	position, depth := calculate_destination(commands)
	fmt.Println(position, "*", depth, "=", position*depth)

}
