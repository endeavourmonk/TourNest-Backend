module.exports = class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const toBeExcluded = [
      'page',
      'limit',
      'filter',
      'search',
      'sort',
      'fields',
      'token',
      'apiKey',
      'user',
      'groupBy',
      'aggregate',
    ];

    toBeExcluded.forEach((el) => delete queryObj[el]);

    const regex = /(\b(gt|gte|lt|lte)\b)/g;
    const queryStr = JSON.stringify(queryObj).replace(
      regex,
      (match) => `$${match}`,
    );
    const filter = JSON.parse(queryStr);
    this.query = this.query.find(filter);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortyBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortyBy);
    } else {
      this.query = this.query.sort('-createdAt'); // by default sorting by date created
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      let { fields } = this.queryStr;
      fields = fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const { page = 1, limit = 10 } = this.queryStr;
    const skipData = (page - 1) * limit;
    this.query = this.query.skip(skipData).limit(limit);
    return this;
  }
};
