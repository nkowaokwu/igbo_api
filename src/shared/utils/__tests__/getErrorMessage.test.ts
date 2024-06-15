import getErrorMessage from '../getErrorMessage';

describe('getErrorMessage', () => {
  it('converts error instance to string', () => {
    const testingError = new Error('testing');
    const errorMessage = getErrorMessage(testingError);
    expect(errorMessage).toEqual('testing');
  });

  it('converts thrown value into string', () => {
    const testingError = 123;
    const errorMessage = getErrorMessage(testingError);
    expect(errorMessage).toEqual('123');
  });
});
