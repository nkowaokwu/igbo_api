export const AWS_URL = 'https://nkowaokwu.s3.us-west-1.amazonaws.com/assets';

export default (path: string): string => `${AWS_URL}${path}`;
