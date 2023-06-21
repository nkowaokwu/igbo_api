import { MailDataRequired } from '@sendgrid/mail';
import map from 'lodash/map';
import omit from 'lodash/omit';

import {
  API_FROM_EMAIL,
  SENDGRID_API_KEY,
  SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE,
  isProduction,
  isTest,
} from '../config';
import { ConstructMessage, SendMailResponse, SendNewDeveloperMail } from './controllers.interface';

const NODE_ENV = process.env.NODE_ENV as 'build' | 'test' | 'production' | 'development';
// I don't know the reason for this but this is not cool design
const sgMail = NODE_ENV !== 'build' ? require('@sendgrid/mail') : {};

// still trying to figure out why the of setApiKey, is it possibly null or undefined,
// they can be a helper class to configure mail adapter that will accept any mail provider in the future
// incase if sendgrid fails for any reason the switch will be faster
if (sgMail?.setApiKey && !isTest) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/* Builds the message object that will help send the email */
const constructMessage = (messageFields: ConstructMessage) => ({
  from: { email: API_FROM_EMAIL, name: 'Igbo API' },
  ...messageFields,
  reply_to: { email: API_FROM_EMAIL, name: 'Igbo API' },
  personalizations: map(messageFields.to, (to) => ({ to: [{ email: to }] })),
});

/* Wrapper around SendGrid function to handle errors */
export const sendEmail = async (message: MailDataRequired): SendMailResponse => {
  // make sure to field is provided before trying to send mail
  if (!message.to) {
    throw new Error("'to' field must be defined");
  }

  let dispatchedMail: SendMailResponse;
  try {
    if (!isTest) {
      dispatchedMail = await sgMail.send(message);

      if (!isProduction) {
        // eslint-disable-next-line no-console
        console.green('Email successfully sent.');
      }
    }
  } catch (err) {
    if (!isProduction) {
      // eslint-disable-next-line no-console
      console.red(err);
      return Promise.resolve(err);
    }
    throw err;
  }

  return dispatchedMail;
};

/* Email sent out to newly signed up Developers */
export const sendNewDeveloper = (data: SendNewDeveloperMail) => {
  const message = constructMessage({
    to: [data.to],
    templateId: SENDGRID_NEW_DEVELOPER_ACCOUNT_TEMPLATE,
    dynamic_template_data: omit(data, ['to']),
  });
  return sendEmail(message);
};
