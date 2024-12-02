import {
  getCodeSnippet,
  getLines,
  getSnippetName,
  verifySnippet,
} from './code-reference';

jest.mock('node-fetch', () => jest.fn().mockReturnThis());

describe('getLines', () => {
  it('should return start line', () => {
    const result = getLines('https://example.com#L12');
    expect(result).toEqual([12, 12]);
  });

  it('should return start and end line', () => {
    const result = getLines('https://example.com#L12-L16');
    expect(result).toEqual([12, 16]);
  });

  it('should return null for lines if nothing is passed', () => {
    const result = getLines('https://example.com');
    expect(result).toBeNull();
  });

  it('should return null if snippet is passed', () => {
    const result = getLines('https://example.com#snippet');
    expect(result).toBeNull();
  });

  it('should return null if snippet is passed', () => {
    const result = getLines('https://example.com#L12snippet');
    expect(result).toBeNull();
  });
});

describe('getSnippet', () => {
  it('should return a snippet', () => {
    const result = getSnippetName('https://example.com#snippet');
    expect(result).toEqual('snippet');
  });

  it('should return null for a start line', () => {
    const result = getSnippetName('https://example.com#L1');
    expect(result).toBeNull();
  });

  it('should return null for a start line', () => {
    const result = getSnippetName('https://example.com#L1-L2');
    expect(result).toBeNull();
  });
});

describe('getCodeSnippet', () => {
  const code = `// Some code here
// [START snippet_name]
function example() {
  // [START foo]
  // code
}
// [END snippet_name]
`;

  it('should return code by a line', () => {
    const result = getCodeSnippet({
      code,
      lines: [5, 5],
      snippetName: null,
    });
    expect(result).toEqual(`  // code`);
  });
  it('should return code by lines', () => {
    const result = getCodeSnippet({ code, lines: [2, 5], snippetName: null });
    expect(result).toEqual(`// [START snippet_name]
function example() {
  // [START foo]
  // code`);
  });
  it('should return code by a snippet name', () => {
    const result = getCodeSnippet({
      code,
      lines: null,
      snippetName: 'snippet_name',
    });
    expect(result).toEqual(`function example() {
  // [START foo]
  // code
}`);
  });

  it('should throw an error for a non-existent snippet name', () => {
    const shouldThrow = (): void =>
      getCodeSnippet({
        code,
        lines: null,
        snippetName: 'foo_bar',
      });
    expect(shouldThrow).toThrow();
  });

  it('should throw an error for a non-matching snippet name', () => {
    const shouldThrow = (): void =>
      getCodeSnippet({
        code,
        lines: null,
        snippetName: 'foo',
      });
    expect(shouldThrow).toThrow();
  });
});

describe('verifySnippet', () => {
  it('should create a snippet file', async () => {
    const isVerifiedSnippet = await verifySnippet('testfile', 'foo');

    expect(isVerifiedSnippet).toBe(true);
  });

  it('should create a snippet file', async () => {
    const isVerifiedSnippet = await verifySnippet('testfile', 'bar');

    expect(isVerifiedSnippet).toBe(false);
  });
});
