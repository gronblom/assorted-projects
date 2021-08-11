import express from 'express';
import { calculateBmi } from './bmi_calculator';
import { calculateExercises } from './exercise_calculator';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/bmi', (req, res) => {
  console.log(req.query);
  if (req.query.height && req.query.weight) {
    try {
      const height = Number(req.query.height.toString());
      const weight = Number(req.query.weight.toString());
      if (isNaN(height) || isNaN(weight)) {
         res.status(500).send({ error: 'Need two give weight and height as ints' });
      } else {
        res.send(calculateBmi(height, weight));
      }
    } catch (e) {
      res.status(500).send({ error: 'Invalid parameters' });
    }
  } else {
    res.status(500).send({ error: 'Need two give weight and height as parameters' });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (req.body.daily_exercises && req.body.target) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const { daily_exercises, target } = req.body.target;
      res.send(calculateExercises(daily_exercises, target));
    } catch (e) {
      res.status(500).send({ error: 'Invalid parameters' });
    }
  } else {
      res.status(500).send({ error: 'Missing parameters' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});