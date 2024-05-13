describe('Test test for check does it work', () => {
  const testFunc = () => {
    return 'Hello test';
  };

  it('Should return "Hello test"', () => {
    const hello = testFunc();
    expect(hello).toEqual('Hello test');
  });
});
