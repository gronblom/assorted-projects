interface ExerciseStatus {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export const calculateExercises = (trainingHoursPerDay: Array<number>, targetHours: number): ExerciseStatus => {
  const periodLength = trainingHoursPerDay.length;
  const trainingDays = trainingHoursPerDay.filter(hours => hours > 0).length;
  const totalHours = trainingHoursPerDay.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const average = totalHours / periodLength;
  const ratingPct = average / targetHours;
  const rating = getRating(ratingPct);
  const ratingDescription = ["u suck", "meh", "gj bro"][rating - 1];
  const success = ratingPct >= 1;

  return {
    periodLength, trainingDays, success, rating, ratingDescription, target: targetHours, average
  };
};

const getRating = (averageToTarget: number) => {
  if (averageToTarget >= 1) {
    return 3;
  } else if (averageToTarget >= 0.5) {
    return 2;
  } else {
    return 1;
  }
};

try {
  const targetHours = Number(process.argv[2]);
  const trainingHoursPerDay = process.argv.slice(3).map(n => Number(n));
  console.log(calculateExercises(trainingHoursPerDay, targetHours));
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Error, something bad happened, message: ', e.message);
}