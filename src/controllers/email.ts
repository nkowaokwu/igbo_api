import omit from 'lodash/omit';
import map from 'lodash/map';
import {
  SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE,
  API_FROM_EMAIL,
  SENDGRID_API_KEY,
  isTest,
  isProduction,
} from '../config';

interface EmailData {
  to: string | string[];
  [key: string]: string | number | object;
}

interface EmailMessage extends EmailData {
  from: { email: string; name: string };
  reply_to: { email: string; name: string };
  personalizations: { to: { email: string }[] }[];
}

// @ts-expect-error use NodeJS type
const sgMail = process.env.NODE_ENV !== 'build' ? require('@sendgrid/mail') : {};

if (sgMail && sgMail.setApiKey && !isTest) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/* Builds the message object that will help send the email */
const constructMessage = (messageFields: EmailData): EmailMessage => ({
  from: { email: API_FROM_EMAIL, name: 'Igbo API' },
  ...messageFields,
  reply_to: { email: API_FROM_EMAIL, name: 'Igbo API' },
  personalizations: map(messageFields.to, (to) => ({ to: [{ email: to }] })),
});

/* Wrapper around SendGrid function to handle errors */
export const sendEmail = (message: EmailMessage) =>
  !isTest
    ? sgMail
        .send(message)
        .then(() => {
          if (!isProduction) {
            console.green('Email successfully sent.');
          }
        })
        .catch((err) => {
          if (!isProduction) {
            console.red(err);
            return Promise.resolve(err);
          }
          throw err;
        })
    : (async () => {
        if (!message.to) {
          throw new Error("'to' field must be defined");
        }
        return Promise.resolve();
      })();

/* Email sent out to newly signed up Developers */
export const sendNewDeveloper = (data: EmailData) => {
  const message = constructMessage({
    to: [data.to].flat(),
    templateId: SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE,
    dynamic_template_data: omit(data, ['to']),
  });
  return sendEmail(message);
};
