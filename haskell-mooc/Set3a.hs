-- Exercise set 3a
--
--  * lists
--  * functional programming

module Set3a where

import Mooc.Todo

-- Some imports you'll need.
-- Do not add any other imports! :)
import Data.Char
import Data.Either
import Data.List

------------------------------------------------------------------------------
-- Ex 1: implement the function maxBy that takes as argument a
-- measuring function (of type a -> Int) and two values (of type a).
--
-- maxBy should apply the measuring function to both arguments and
-- return the argument for which the measuring function returns a
-- higher value.
--
-- Examples:
--
--  maxBy (*2)   3       5      ==>  5
--  maxBy length [1,2,3] [4,5]  ==>  [1,2,3]
--  maxBy head   [1,2,3] [4,5]  ==>  [4,5]

maxBy :: (a -> Int) -> a -> a -> a
maxBy measure a b = if measure a >= measure b
                    then a
                    else b

------------------------------------------------------------------------------
-- Ex 2: implement the function mapMaybe that takes a function and a
-- Maybe value. If the value is Nothing, it returns Nothing. If it is
-- a Just, it updates the contained value using the function.
--
-- Examples:
--   mapMaybe length Nothing      ==> Nothing
--   mapMaybe length (Just "abc") ==> Just 3

mapMaybe :: (a -> b) -> Maybe a -> Maybe b
mapMaybe f Nothing = Nothing
mapMaybe f (Just x) = Just $ f x

------------------------------------------------------------------------------
-- Ex 3: implement the function mapMaybe2 that works like mapMaybe
-- except it combines two Maybe values using a function of two
-- arguments.
--
-- Examples:
--   mapMaybe2 take (Just 2) (Just "abcd") ==> Just "ab"
--   mapMaybe2 div (Just 6) (Just 3)  ==>  Just 2
--   mapMaybe2 div Nothing  (Just 3)  ==>  Nothing
--   mapMaybe2 div (Just 6) Nothing   ==>  Nothing

mapMaybe2 :: (a -> b -> c) -> Maybe a -> Maybe b -> Maybe c
mapMaybe2 f _ Nothing = Nothing
mapMaybe2 f Nothing _ = Nothing
mapMaybe2 f (Just x) (Just y) = Just $ f x y

------------------------------------------------------------------------------
-- Ex 4: define the functions firstHalf and palindrome so that
-- palindromeHalfs returns the first halfs of all palindromes in its
-- input.
--
-- The first half of a string should include the middle character of
-- the string if the string has an odd length.
--
-- Examples:
--   palindromeHalfs ["abba", "cat", "racecar"]
--     ==> ["ab","race"]
--
-- What types should firstHalf and palindrome have? Give them type
-- annotations.
--
-- Note! Do not change the definition of palindromeHalfs

palindromeHalfs :: [String] -> [String]
palindromeHalfs xs = map firstHalf (filter palindrome xs)

firstHalf pal = take halfLen pal
                where halfLen = (length pal + 1) `div` 2

palindrome xs = xs == reverse xs 

------------------------------------------------------------------------------
-- Ex 5: Implement a function capitalize that takes in a string and
-- capitalizes the first letter of each word in it.
--
-- You should probably define a helper function capitalizeFirst that
-- capitalizes the first letter of a string.
--
-- These functions will help:
--  - toUpper :: Char -> Char   from the module Data.Char
--  - words :: String -> [String]
--  - unwords :: [String] -> String
--
-- Example:
--   capitalize "goodbye cruel world" ==> "Goodbye Cruel World"

capitalize :: String -> String
capitalize sentence = unwords $ map capitalizeFirst $ words sentence

capitalizeFirst (x:xs) = toUpper x : xs

------------------------------------------------------------------------------
-- Ex 6: powers k max should return all the powers of k that are less
-- than or equal to max. For example:
--
-- powers 2 5 ==> [1,2,4]
-- powers 3 30 ==> [1,3,9,27]
-- powers 2 2 ==> [1,2]
--
-- You can assume that k is at least 2.
--
-- Hints:
--   * k^max > max
--   * the function takeWhile

powers :: Int -> Int -> [Int]
powers 1 max = [1]
powers k max = takeWhile (\x -> x <= max) $ map (k^) [0..]


------------------------------------------------------------------------------
-- Ex 7: implement a functional while loop. While should be a function
-- that takes a checking function, an updating function, and an
-- initial value. While should repeatedly apply the updating function
-- to the initial value as long as the value passes the checking
-- function. Finally, the value that doesn't pass the check is
-- returned.
--
-- Examples:
--
--   while odd (+1) 1    ==>   2
--
--   while (<=4) (+1) 0  ==>   5
--
--   let check [] = True
--       check ('A':xs) = False
--       check _ = True
--   in while check tail "xyzAvvt"
--     ==> Avvt

while :: (a->Bool) -> (a->a) -> a -> a
while check update value
  | check value = while check update newValue
  | otherwise = value
  where newValue = update value

------------------------------------------------------------------------------
-- Ex 8: another version of a while loop. This time, the check
-- function returns an Either value. A Left value means stop, a Right
-- value means keep looping.
--
-- The call `whileRight check x` should call `check x`, and if the
-- result is a Left, return the contents of the Left. If the result is
-- a Right, the function should call `check` on the contents of the
-- Right and so on.
--
-- Examples (see definition of step below):
--   whileRight (step 100) 1   ==> 128
--   whileRight (step 1000) 3  ==> 1536

whileRight :: (a -> Either b a) -> a -> b
-- whileRight f ()
whileRight f x = case x' of (Right r) -> whileRight f r
                            (Left l) -> l 
  where x' = f x

-- for the whileRight examples:
-- step k x doubles x if it's less than k
step :: Int -> Int -> Either Int Int
step k x = if x<k then Right (2*x) else Left x

------------------------------------------------------------------------------
-- Ex 9: given a list of strings and a length, return all strings that
--  * have the given length
--  * are made by catenating two input strings
--
-- Examples:
--   joinToLength 2 ["a","b","cd"]        ==> ["aa","ab","ba","bb"]
--   joinToLength 5 ["a","b","cd","def"]  ==> ["cddef","defcd"]
--
-- Hint! This is a great use for list comprehensions

joinToLength :: Int -> [String] -> [String]
joinToLength len xs = [ s | first <- xs, last <- xs, let s = first ++ last, length s == len] 
 

------------------------------------------------------------------------------
-- Ex 10: implement the operator +|+ that returns a list with the first
-- elements of its input lists.
--
-- Give +|+ a type signature. NB: It needs to be of the form (+|+) :: x,
-- with the parentheses because +|+ is an infix operator.
--
-- Examples:
--   [1,2,3] +|+ [4,5,6]  ==> [1,4]
--   [] +|+ [True]        ==> [True]
--   [] +|+ []            ==> []

(+|+) :: [a] -> [a] -> [a]
[] +|+ [] = []
xs +|+ [] = [head xs]
[] +|+ ys = [head ys]
xs +|+ ys = [head xs, head ys]

------------------------------------------------------------------------------
-- Ex 11: remember the lectureParticipants example from Lecture 2? We
-- used a value of type [Either String Int] to store some measurements
-- that might be missing. Implement the function sumRights which sums
-- all non-missing measurements in a list like this.
--
-- Challenge: look up the type of the either function. Implement
-- sumRights using the map & either functions instead of pattern
-- matching on lists or Eithers!
--
-- Examples:
--   sumRights [Right 1, Left "bad value", Right 2]  ==>  3
--   sumRights [Left "bad!", Left "missing"]         ==>  0

sumRights :: [Either a Int] -> Int
sumRights xs = sumRights' 0 xs

sumRights' :: Int -> [Either a Int] -> Int
sumRights' n [] = n
--sumRights' n (x:xs) = case x of (Right val) -> sumRights' (n + val) xs
--                                (Left val) -> sumRights' n xs

sumRights' n ((Right val):xs) = sumRights' (n + val) xs
sumRights' n ((Left val):xs) = sumRights' n xs
------------------------------------------------------------------------------
-- Ex 12: recall the binary function composition operation
-- (f . g) x = f (g x). In this exercise, your task is to define a function
-- that takes any number of functions given as a list and composes them in the
-- same order than they appear in the list.
--
-- Examples:
--   multiCompose [] "foo" ==> "foo"
--   multiCompose [] 1     ==> 1
--   multiCompose [(++"bar")] "foo" ==> "foobar"
--   multiCompose [reverse, tail, (++"bar")] "foo" ==> "raboo"
--   multiCompose [(3*), (2^), (+1)] 0 ==> 6
--   multiCompose [(+1), (2^), (3*)] 0 ==> 2

multiCompose [] = id
multiCompose (x:[]) = x
multiCompose (x:xs) = x . multiCompose xs

------------------------------------------------------------------------------
-- Ex 13: let's consider another way to compose multiple functions. Given
-- some function f, a list of functions gs, and some value x, define
-- a composition operation that applies each function g in gs to x and then
-- f to the resulting list. Give also the type annotation for multiApp.
--
-- Challenge: Try implementing multiApp without lambdas or list comprehensions.
--
-- Examples:
--   multiApp id [] 7  ==> []
--   multiApp id [id, reverse, tail] "This is a test"
--       ==> ["This is a test","tset a si sihT","his is a test"]
--   multiApp id  [(1+), (^3), (+2)] 1  ==>  [2,1,3]
--   multiApp sum [(1+), (^3), (+2)] 1  ==>  6
--   multiApp reverse [tail, take 2, reverse] "foo" ==> ["oof","fo","oo"]
--   multiApp concat [take 3, reverse] "race" ==> "racecar"

multiApp :: ([a] -> b) -> [(c -> a)] -> c -> b
multiApp f [] x = f []
multiApp f gs x = f $ multiApp' gs x
multiApp' (g:[]) x = g x : [] 
multiApp' (g:gs) x = g x : multiApp' gs x


------------------------------------------------------------------------------
-- Ex 14: in this exercise you get to implement an interpreter for a
-- simple language. You should keep track of the x and y coordinates,
-- and interpret the following commands:
--
-- up -- increment y by one
-- down -- decrement y by one
-- left -- decrement x by one
-- right -- increment x by one
-- printX -- print value of x
-- printY -- print value of y
--
-- The interpreter will be a function of type [String] -> [String].
-- Its input is a list of commands, and its output is a list of the
-- results of the print commands in the input.
--
-- Both coordinates start at 0.
--
-- Examples:
--
-- interpreter ["up","up","up","printY","down","printY"] ==> ["3","2"]
-- interpreter ["up","right","right","printY","printX"] ==> ["1","2"]
--
-- Surprise! after you've implemented the function, try running this in GHCi:
--     interact (unlines . interpreter . lines)
-- after this you can enter commands on separate lines and see the
-- responses to them
--
-- The suprise will only work if you generate the return list directly:t multi
-- using (:). If you build the list in an argument to a helper
-- function, the surprise won't work.

interpreter :: [String] -> [String]
--interpreter commands = todo 
interpreter commands = interpreter' (0, 0) commands
interpreter' (x, y) [] = []
interpreter' (x, y) (command:commands) = case command of "printX" -> show x : interpreter' (x, y) commands 
                                                         "printY" -> show y : interpreter' (x, y) commands
                                                         command ->  interpreter' (move (x, y) command) commands
move (x, y) "up" = (x, y + 1)
move (x, y) "down" = (x, y - 1)
move (x, y) "left" = (x - 1, y)
move (x, y) "right" = (x + 1, y)

