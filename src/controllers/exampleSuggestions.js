import { assign } from 'lodash';
import ExampleSuggestion from '../models/ExampleSuggestion';

/* Creates a new ExampleSuggestion document in the database */
export const postExampleSuggestion = (req, res) => {
  const { body: data } = req;

  if (!data.igbo && !data.english) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  const newExampleSuggestion = new ExampleSuggestion(data);
  return newExampleSuggestion.save()
    .then((exampleSuggestion) => (
      res.send({ id: exampleSuggestion.id })
    ))
    .catch(() => {
      res.status(400);
      return res.send('An error has occurred while saving, double check your provided data');
    });
};

/* Updates an existing ExampleSuggestion object */
export const putExampleSuggestion = (req, res) => {
  const { body: data } = req;

  if (!data.igbo && !data.english) {
    res.status(400);
    return res.send({ error: 'Required information is missing, double check your provided data' });
  }

  return ExampleSuggestion.findById(data.id)
    .then(async (exampleSuggestion) => {
      const updatedExampleSuggestion = assign(exampleSuggestion, data);
      res.send(await updatedExampleSuggestion.save());
    })
    .catch((err) => {
      console.log(err);
      res.status(400);
      return res.send('An error has occurred while updating, double check your provided data');
    });
};
