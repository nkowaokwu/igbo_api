import { map, omit } from 'lodash';
import {
  NEW_DEVELOPER_ACCOUNT_TEMPLATE,
  API_FROM_EMAIL,
} from '../config';

const sgMail = process.env.NODE_ENV !== 'build' ? require('@sendgrid/mail') : {};

/* Builds the message object that will help send the email */
const constructMessage = (messageFields) => ({
  from: { email: API_FROM_EMAIL, name: 'Igbo API' },
  ...messageFields,
  reply_to: { email: API_FROM_EMAIL, name: 'Igbo API' },
  personalizations: map(messageFields.to, (to) => ({ to: [{ email: to }] })),
});

/* Wrapper around SendGrid function to handle errors */
export const sendEmail = (message) => (
  process.env.NODE_ENV !== 'test' ? sgMail.send(message)
    .then(() => {
      if (process.env.NODE_ENV !== 'production') {
        console.green('Email successfully sent.');
      }
    })
    .catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.red(err);
        return Promise.resolve(err);
      }
      throw err;
    }) : (async () => {
    if (!message.to) {
      throw new Error('\'to\' field must be defined');
    }
    return Promise.resolve();
  })()
);

/* Email sent out to newly signed up Developers */
export const sendNewDeveloper = (data) => {
  const message = constructMessage({
    to: [data.to],
    templateId: NEW_DEVELOPER_ACCOUNT_TEMPLATE,
    dynamic_template_data: omit(data, ['to']),
  });
  return sendEmail(message);
};
