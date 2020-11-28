import cron from 'node-cron';
import {
  compact,
  filter,
  flatten,
  reduce,
} from 'lodash';
import { findUsers } from '../controllers/users';
import UserRoles from '../shared/constants/userRoles';
import { LOOK_BACK_DATE } from '../shared/constants/emailDates';
import { sendMergedStats } from '../controllers/email';
import { getWordSuggestionsFromLastWeek } from '../controllers/wordSuggestions';
import { getGenericWordsFromLastWeek } from '../controllers/genericWords';
import { getExampleSuggestionsFromLastWeek } from '../controllers/exampleSuggestions';

const getMergedWords = async () => (
  compact(flatten([
    await getWordSuggestionsFromLastWeek(),
    await getGenericWordsFromLastWeek(),
  ]))
);
const getMergedExamples = async () => (
  compact(flatten([await getExampleSuggestionsFromLastWeek()]))
);

const sendEmailJob = async () => {
  let userEmails = process.env.NODE_ENV === 'test' ? ['admin@example.com'] : [];
  try {
    if (process.env.NODE_ENV === 'production') {
      const users = filter(await findUsers(), (user) => (
        user.role === UserRoles.EDITOR
        || user.role === UserRoles.MERGER
        || user.role === UserRoles.ADMIN
      ));
      userEmails = compact(reduce(users, (emails, user) => {
        emails.push(user?.email);
        return emails;
      }, []));
    }
    if (userEmails.length) {
      /* Gets all the merged words and examples to show in email */
      const mergedWords = await getMergedWords();
      const mergedExamples = await getMergedExamples();
      const emailData = {
        to: userEmails,
        mergedWords: mergedWords.length,
        mergedExamples: mergedExamples.length,
        startDate: new Date(LOOK_BACK_DATE).toDateString(),
        endDate: new Date().toDateString(),
      };

      await sendMergedStats(emailData);
      console.log('Successfully sent emails.');
    } else {
      console.log('No emails to send to.');
    }
  } catch (err) {
    console.log(err.stack);
    console.log('Unsuccessfully sent emails.');
  }
};

cron.schedule('0 9 * * 1', sendEmailJob);
// cron.schedule('* * * * *', sendEmailJob);
