import omit from 'lodash/omit';
import { MailDataRequired } from '@sendgrid/mail';
import map from 'lodash/map';
import {
  SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE,
  API_FROM_EMAIL,
  SENDGRID_API_KEY,
  isTest,
  isProduction,
  Environment,
} from '../config';

type EmailTemplate = {
  to: string[],
  templateId: string,
  dynamic_template_data: Omit<DeveloperEmailConfig, 'to'>,
};
/* Builds the message object that will help send the email */
const constructMessage = (messageFields: EmailTemplate) => ({
  from: { email: API_FROM_EMAIL, name: 'Igbo API' },
  ...messageFields,
  reply_to: { email: API_FROM_EMAIL, name: 'Igbo API' },
  personalizations: map(messageFields.to, (to) => ({ to: [{ email: to }] })),
});

/* Wrapper around SendGrid function to handle errors */
export const sendEmail = (message: MailDataRequired) => {
  const sgMail =
    // eslint-disable-next-line global-require
    (process.env.NODE_ENV as string) !== Environment.BUILD ? require('@sendgrid/mail') : {};

  if (!isTest) {
    sgMail.setApiKey(SENDGRID_API_KEY);
  }

  return !isTest
    ? sgMail
        .send(message)
        .then(() => {
          if (!isProduction) {
            console.green('Email successfully sent.');
          }
        })
        .catch((err: any) => {
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
};

type DeveloperEmailConfig = {
  apiKey: string,
  name: string,
  to: string,
};
/* Email sent out to newly signed up Developers */
export const sendNewDeveloper = (data: DeveloperEmailConfig) => {
  const message = constructMessage({
    to: [data.to],
    templateId: SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE,
    dynamic_template_data: omit(data, ['to']),
  });
  return sendEmail(message);
};
