interface BmiValues {
  height: number;
  weight: number;
}

export const parseArguments = (args: Array<string>): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (height: number, weight: number) => {
  const bmi = weight / Math.pow((height/100), 2);
  if (bmi < 15) {
    return "Very severly underweight";
  } else if (bmi < 16) {
    return "Severly underweight";
  } else if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal (healthy weight)";
  } else if (bmi < 30) {
    return "Overweight";
  } else if (bmi < 35) {
    return "Obese Class I (Moderately obese)";
  } else if (bmi < 40) {
    return "Obese Class II (Severely obese)";
  } else {
    return "Obese Class III (Very severely obese)";
  }
};

try {
  console.log(process.argv);
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
  //multiplicator(height, weight, `Multiplied ${height} and ${weight}, the result is:`);
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Error, something bad happened, message: ', e.message);
}