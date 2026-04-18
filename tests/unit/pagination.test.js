const { parsePagination } = require('../../src/utils/pagination');

describe('parsePagination', () => {
  it('returns defaults when query is empty', () => {
    const result = parsePagination({});
    expect(result).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('normalizes invalid values', () => {
    const result = parsePagination({ page: -2, limit: 0 });
    expect(result).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('caps limit at 100 and calculates skip', () => {
    const result = parsePagination({ page: 3, limit: 150 });
    expect(result).toEqual({ page: 3, limit: 100, skip: 200 });
  });
});
