package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type BingoBoard [][]int

func (board BingoBoard) String() string {
	var sb strings.Builder
	for _, v := range board {
		sb.WriteString(fmt.Sprintf("%v\n", v))
	}
	return sb.String()
}

func parseInput(path string) ([]int, []BingoBoard) {
	inputFile, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}

	defer inputFile.Close()
	scanner := bufio.NewScanner(inputFile)
	var drawnNumbers []int
	var boards []BingoBoard
	readDrawnNumbers := true
	var currentBoard BingoBoard
	var currentBingoRow int
	for scanner.Scan() {
		val := scanner.Text()
		if readDrawnNumbers {
			drawnNumbers = parseNumbers(strings.Split(val, ","))
			readDrawnNumbers = false
		} else if val == "" {
			currentBoard = make([][]int, 5)
			boards = append(boards, currentBoard)
			currentBingoRow = 0
		} else {
			currentBoard[currentBingoRow] = parseNumbers(strings.Fields(val))
			currentBingoRow++
		}
	}
	return drawnNumbers, boards
}

func parseNumbers(tokens []string) []int {
	numbers := make([]int, len(tokens))
	for i, v := range tokens {
		number, err := strconv.Atoi(v)
		numbers[i] = number
		if err != nil {
			fmt.Println(err)
			os.Exit(2)
		}
	}
	return numbers
}

func createDrawOrder(drawnNumbers []int) []int {
	drawOrder := make([]int, len(drawnNumbers))
	for i, v := range drawnNumbers {
		drawOrder[v] = i
	}
	return drawOrder
}

func markDrawOrder(drawOrder []int, boards []BingoBoard) []BingoBoard {
	var markedBoards []BingoBoard
	for _, board := range boards {
		currentBoard := make([][]int, len(board))
		for i, row := range board {
			currentBoard[i] = make([]int, 5)
			for j, number := range row {
				currentBoard[i][j] = drawOrder[number]
			}
		}
		markedBoards = append(markedBoards, currentBoard)
	}
	return markedBoards
}

func getMinBingoTurn(rowDraworder []int, minBingoTurn int) int {
	rowBingoTurn := 0
	for _, drawOrder := range rowDraworder {
		if drawOrder > rowBingoTurn {
			rowBingoTurn = drawOrder
		}
	}
	if rowBingoTurn < minBingoTurn {
		return rowBingoTurn
	} else {
		return minBingoTurn
	}
}

func calculateBingo(markedBoards []BingoBoard) (firstBingoBoardIndex, firstBingoTurn, lastBingoBoardIndex,
	lastBingoTurn int) {
	firstBingoTurn = 99
	lastBingoTurn = 0

	for boardIndex, board := range markedBoards {
		boardBingoTurn := 99
		for _, horizontalRow := range board {
			boardBingoTurn = getMinBingoTurn(horizontalRow, boardBingoTurn)
		}
		for col := 0; col < 5; col++ {
			verticalRow := make([]int, 5)
			for row := 0; row < 5; row++ {
				verticalRow[row] = board[row][col]
			}
			boardBingoTurn = getMinBingoTurn(verticalRow, boardBingoTurn)
		}
		if boardBingoTurn < firstBingoTurn {
			firstBingoTurn = boardBingoTurn
			firstBingoBoardIndex = boardIndex
		}
		if boardBingoTurn > lastBingoTurn {
			lastBingoTurn = boardBingoTurn
			lastBingoBoardIndex = boardIndex
		}
	}
	return firstBingoBoardIndex, firstBingoTurn, lastBingoBoardIndex, lastBingoTurn
}

func calculateAnswer(board BingoBoard, markedBoard BingoBoard, bingoTurn int, bingoAtNumber int) int {
	sumOfUnmarkedNumbers := 0
	for row := 0; row < 5; row++ {
		for col := 0; col < 5; col++ {
			if markedBoard[row][col] > bingoTurn {
				sumOfUnmarkedNumbers += board[row][col]
			}
		}
	}
	return sumOfUnmarkedNumbers * bingoAtNumber
}

func main() {
	drawnNumbers, boards := parseInput("../input/day_4_input.txt")
	drawOrder := createDrawOrder(drawnNumbers)
	markedBoards := markDrawOrder(drawOrder, boards)
	minBingoBoardIndex, minBingoTurn, maxBingoBoardIndex, maxBingoTurn := calculateBingo(markedBoards)
	fmt.Println("Winning board index:", minBingoBoardIndex, "Bingo turn:", minBingoTurn,
		"Bingo at number:", drawOrder[minBingoTurn])
	part1Answer := calculateAnswer(boards[minBingoBoardIndex], markedBoards[minBingoBoardIndex], minBingoTurn, drawnNumbers[minBingoTurn])
	fmt.Println("First bingo answer:", part1Answer)

	fmt.Println("Last bingo board index:", maxBingoBoardIndex, "Bingo turn:", maxBingoTurn,
		"Bingo at number:", drawOrder[maxBingoTurn])
	part2Answer := calculateAnswer(boards[maxBingoBoardIndex], markedBoards[maxBingoBoardIndex], maxBingoTurn, drawnNumbers[maxBingoTurn])
	fmt.Println("Last bingo answer:", part2Answer)
}
