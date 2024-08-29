export const mockRequest = jest.fn((config) => config);
export const request = jest.fn();

export default { default: mockRequest, request };
