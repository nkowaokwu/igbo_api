import { map, omit } from 'lodash';
import {
  MERGED_SUGGESTION_TEMPLATE,
  REJECTED_SUGGESTION_TEMPLATE,
  MERGED_STATS_TEMPLATE,
  API_FROM_EMAIL,
  NKOWAOKWU_FROM_EMAIL,
} from '../config';

const sgMail = process.env.NODE_ENV !== 'build' ? require('@sendgrid/mail') : {};

/* Builds the message object that will help send the email */
const constructMessage = (messageFields) => ({
  from: { email: NKOWAOKWU_FROM_EMAIL, name: 'Nkowaokwu' },
  ...messageFields,
  reply_to: { email: API_FROM_EMAIL, name: 'Igbo API' },
  personalizations: map(messageFields.to, (to) => ({ to: [{ email: to }] })),
});

/* Wrapper around SendGrid function to handle errors */
export const sendEmail = (message) => (
  process.env.NODE_ENV !== 'test' ? sgMail.send(message)
    .then(() => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Email successfully sent.');
      }
    })
    .catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(err);
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

/* Email sent when an editor clicks the approve button */
export const sendApprovedEmail = (data) => {
  const message = constructMessage(data);
  return sendEmail(message);
};

/* Email sent when an editor clicks the deny button */
export const sendDeniedEmail = (data) => {
  const message = constructMessage(data);
  return sendEmail(message);
};

/* Email sent when suggestion gets merged */
export const sendMergedEmail = (data) => {
  const message = constructMessage({
    to: data.to,
    templateId: MERGED_SUGGESTION_TEMPLATE,
    dynamic_template_data: omit(data, ['to']),
  });
  return sendEmail(message);
};

/* Email sent when a suggestion has been deleted without getting merged */
export const sendRejectedEmail = (data) => {
  const message = constructMessage({
    to: data.to,
    templateId: REJECTED_SUGGESTION_TEMPLATE,
    dynamic_template_data: omit(data, ['to']),
  });
  return sendEmail(message);
};

/* Email sent every week to editors, mergers, and admins */
export const sendMergedStats = (data) => {
  const message = constructMessage({
    from: { email: API_FROM_EMAIL, name: 'Igbo API' },
    to: data.to,
    templateId: MERGED_STATS_TEMPLATE,
    dynamic_template_data: omit(data, ['to']),
  });
  return sendEmail(message);
};
