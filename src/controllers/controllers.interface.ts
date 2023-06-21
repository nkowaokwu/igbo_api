import { ClientResponse } from '@sendgrid/mail';
import Example from '../models/interfaces/Example';

export interface DeveloperRequestBody {
  email: string;
  password: string;
  name: string;
}

export interface SendNewDeveloperMail {
  to: string;
  apiKey: string;
  name: string;
}

export interface ConstructMessage {
  to: string[];
  templateId: string;
  dynamic_template_data: Omit<SendNewDeveloperMail, 'to'>;
}

export type SendMailResponse = Promise<[ClientResponse, Record<string, any>]>;
export interface ExampleResponse {
  contentLength?: number;
  examples?: Example[];
}
