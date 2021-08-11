import Data.Array
import Data.List
import Data.List.Split
import Data.Maybe
import Data.Ord
import qualified Data.PQueue.Min as PQ

newtype Coord = Coord (Int,Int)

readLines :: FilePath -> IO [String]
readLines file = do content <- readFile file
                    return $ lines content

createNeuralMap :: Int -> Int -> [String] -> Array (Int,Int) Char
createNeuralMap width height lines = drawNeuralConnections lines neuralMap
  where neuralMap = initNeuralMap width height ' '

drawNeuralConnections :: [String] -> Array (Int,Int) Char -> Array (Int,Int) Char
drawNeuralConnections lines neuralMap = neuralMap // neuralPathways
  where neuralPathways = concat $ map (createNeuralCoords . parseNeuralPathway) lines

createNeuralCoords :: ((Int,Int),[String]) -> [((Int,Int),Char)]
createNeuralCoords ((x,y),directions) = ((x,y),'.') : createNeuralCoords' ((x,y),directions)
createNeuralCoords' ((x,y),[]) = []
createNeuralCoords' ((x,y),direction:directions) = ((x',y'),c) : createNeuralCoords' ((x',y'),directions)
  where ((x',y'),c) = createCoord (x,y) direction

createCoord :: (Int,Int) -> String -> ((Int,Int),Char)
createCoord (x,y) direction
  -- paths are denoted with '.' on the map
  | direction == "R" = ((x+1,y),'.')
  | direction == "L" = ((x-1,y),'.')
  | direction == "D" = ((x,y+1),'.')
  | direction == "U" = ((x,y-1),'.')
  | otherwise = ((x,y),head direction)

parseNeuralPathway :: String -> ((Int,Int),[String])
parseNeuralPathway line
    | tokenNum == 1 = ((x,y),[])
    | tokenNum == 2 = let directions = head $ tail tokens
                          directionTokens = splitOn "," directions
                      in ((x,y),directionTokens)
    | otherwise = error $ "Invalid line: " ++ line
      where tokens = splitOn " " line
            tokenNum = length tokens
            (x':y':[]) = splitOn "," $ head tokens 
            x = read x' :: Int
            y = read y' :: Int

initNeuralMap :: Int -> Int -> Char -> Array (Int,Int) Char
initNeuralMap width height c = array ((0,0),(xMax,yMax)) [((x,y),c) | x <- [0..xMax], y <- [0..yMax]]
  where xMax = width - 1
        yMax = height - 1

neuralMapToStr :: Array (Int,Int) Char -> String
neuralMapToStr neuralMap = neuralMapToStr' neuralMapAsList 0
  where sortedByRow = sortBy (comparing $ snd . fst) -- Sort by row, ie by y
        neuralMapAsList = sortedByRow $ assocs neuralMap
neuralMapToStr' [] _ = []
neuralMapToStr' (((x,y),c):neuralMap) currRow
  | y == currRow = c : go currRow
  | otherwise = '\n' : c : go (currRow + 1)
  where go rowNum = neuralMapToStr' neuralMap rowNum

-- The map has a one starting point, run A*Search from it to all the finish coordinates
runASearches :: Array (Int,Int) Char -> [String]
runASearches neuralMap = let start = head $ findCoords neuralMap 'S'
                             destinations = findCoords neuralMap 'F'
                         in map (\dest -> aSearch $ initASearchParams neuralMap start dest) destinations

-- For finding coordinates of specific characters on the map, such as S (start) and (F) finish. 
findCoords :: Array (Int,Int) Char -> Char -> [(Int,Int)]
findCoords neuralMap letter = foldr helper [] (assocs neuralMap)
  where helper = (\((x,y),c) acc -> if c == letter then acc ++ [(x,y)] else acc)

-- Simple 2d distance heuristic function
heuristicFunc :: (Int,Int) -> (Int,Int) -> Int
heuristicFunc (x1,y1) (x2,y2) = abs (x1 - x2) + abs (y1 - y2)

aSearch :: ASearchParams -> String
aSearch params
  | PQ.null (pQueue params) = createHeader params ++ "No paths\n"
  | otherwise = case PQ.findMin (pQueue params) of
    (_,coord) | coord == (destination params) -> formSolution params
              | otherwise -> let params' = params { pQueue = PQ.deleteMin (pQueue params)}
                                 neighbors = getNeighbors (neuralMap params) coord
                                 params'' = foldr (\neighb prms -> checkNeighbor prms coord neighb) params' neighbors
                             in aSearch params''

-- A*Search neighbor coordinate iteration
checkNeighbor :: ASearchParams -> (Int,Int) -> (Int,Int) -> ASearchParams
checkNeighbor params coord neighb = let tentativeGScore = (getGScore params coord) + 1
                                        neighbGScore = getGScore params neighb
                                    in if tentativeGScore >= neighbGScore then params
                                       -- Found smaller g score, update params
                                       else let cameFrom' = (cameFrom params) // [(neighb,Just coord)]
                                                gScore' = (gScore params) // [(neighb,Just tentativeGScore)]
                                                fScoreVal = tentativeGScore + (heurFunc params) neighb
                                                fScore' = (fScore params) // [(neighb,Just fScoreVal)]
                                                pQueue' = addIfNotExists (pQueue params) (fScoreVal,neighb)
                                            in params { cameFrom = cameFrom', gScore = gScore', fScore = fScore', pQueue = pQueue' }

formSolution :: ASearchParams -> String
formSolution params = let header = createHeader params
                          pathFromDestination = tracePath (start params) (destination params) (cameFrom params)
                          pathFromStart = reverse pathFromDestination -- path trace algorithms works backwards, so reverse it to start from start
                          mapWithPath = drawPath (neuralMap params) pathFromStart
                          solution = pathToDirections pathFromStart
                      in header ++ "Found solution\n" ++ mapWithPath ++ "\n\n" ++ solution ++ "\n"

-- Transform a path made up of coordinates into a string of directions ('R','L','U','D')
pathToDirections :: [(Int,Int)] -> String
pathToDirections [] = ""
pathToDirections (x:[]) = ""
pathToDirections (x1:x2:xs) = getDirection x1 x2 : pathToDirections (x2:xs)

createHeader :: ASearchParams -> String
createHeader params = "########### A* search algorithm from S " ++ show (start params) ++ " to F " ++ show (destination params) ++ "\n"

-- Trace path from destination back to start with the cameFrom map
tracePath :: (Int,Int) -> (Int,Int) -> Array(Int,Int) (Maybe(Int,Int)) -> [(Int,Int)]
tracePath start destination cameFrom
  | start == destination = start : []
  | otherwise = let prevCoord = fromMaybe (error $ "path trace invalid coord: " ++ show destination) (cameFrom ! destination)
                in destination : tracePath start prevCoord cameFrom

-- Draw a neural map with a path
drawPath :: Array (Int,Int) Char -> [(Int,Int)] -> String
drawPath neuralMap path = let path' = tail $ init path -- remove start and end from path as they already are special chars on the map 
                              neuralMapWithPath = neuralMap // [(coord,'*') | coord <- path']
                          in neuralMapToStr neuralMapWithPath 

getDirection :: (Int,Int) -> (Int,Int) -> Char
getDirection from@(x1,y1) to@(x2,y2)
  | x1 > x2 = 'L'
  | x1 < x2 = 'R'
  | y1 > y2 = 'U'
  | y1 < y2 = 'D'

-- Add f score for a coordinate to the priority queue if it is not found already
addIfNotExists :: PQ.MinQueue (Int,(Int,Int)) -> (Int,(Int,Int)) -> PQ.MinQueue (Int,(Int,Int))
addIfNotExists pQueue (fScoreVal,coord)
  | elem coord queuedCoords = pQueue
  | otherwise = PQ.insert (fScoreVal,coord) pQueue
  where queuedCoords = map (\x -> snd x) (PQ.toList pQueue)
                                      
getGScore :: ASearchParams -> (Int,Int) -> Int
getGScore params coord = fromMaybe (error (show coord ++ " invalid route")) ((gScore params) ! coord)

-- Find all valid neighboring coordinates
getNeighbors :: Array (Int,Int) Char -> (Int,Int) -> [(Int,Int)]
getNeighbors neuralMap (x,y) = filter neighborFilter [(x+1,y),(x-1,y),(x,y+1),(x,y-1)]
  where neighborFilter coord = let val = neuralMap ! coord
                               in not $ elem val [' ', 'X'] 

initCameFrom :: Array(Int,Int) a -> Array(Int,Int) (Maybe(Int,Int))
initCameFrom neuralMap = array (bounds neuralMap) $ map (\(coord,x) -> (coord,Nothing)) $ assocs neuralMap

initScoreMap :: Array (Int,Int) Char -> (Int,Int) -> Array (Int,Int) (Maybe Int)
initScoreMap neuralMap start = scoreMap // [(start,Just 0)]
  where f ((x,y),c) = if c == ' ' then ((x,y),Nothing) else ((x,y),Just (maxBound::Int))
        scoreMap = array (bounds neuralMap) $ map f $ assocs neuralMap

data ASearchParams = ASearchParams {neuralMap :: Array (Int,Int) Char,
                                    start :: (Int,Int),
                                    destination :: (Int,Int),
                                    heurFunc :: (Int,Int) -> Int,
                                    cameFrom :: Array(Int,Int) (Maybe(Int,Int)),
                                    gScore :: Array (Int,Int) (Maybe Int),
                                    fScore :: Array (Int,Int) (Maybe Int),
                                    pQueue :: PQ.MinQueue (Int,(Int,Int))}

initASearchParams :: Array (Int,Int) Char -> (Int,Int) -> (Int,Int) -> ASearchParams
initASearchParams neuralMap start destination =
  let cameFrom = initCameFrom neuralMap
      gScore = initScoreMap neuralMap start
      fScore = initScoreMap neuralMap start
      pQueue = PQ.singleton (0,start)
      in ASearchParams neuralMap start destination (heuristicFunc destination) cameFrom gScore fScore pQueue

main = do lines <- readLines "neural_link.txt"
          let neuralMap = createNeuralMap 128 128 lines
          let solutions = runASearches neuralMap
          putStrLn $ unlines solutions
          return ()

