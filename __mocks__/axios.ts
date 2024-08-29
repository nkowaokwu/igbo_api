export const mockRequest = jest.fn((config) => config);
export const request = jest.fn();
// @ts-expect-error
mockRequest.request = request;

export default mockRequest;
