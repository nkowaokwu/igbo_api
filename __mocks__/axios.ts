export const mockRequest = jest.fn((config) => config);
export const request = jest.fn(() => ({ data: {}, catch: jest.fn(() => ({ data: {} })) }));
// @ts-expect-error request
mockRequest.request = request;

export default mockRequest;
