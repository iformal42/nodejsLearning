class APIFeatures {
  constructor(query, params) {
    this.query = query;
    this.params = params;
  }

  filter() {
    let queryObj = { ...this.params };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    queryObj = JSON.parse(queryString);

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    let sortBy = '-createdAt';
    if (this.params.sort) {
      sortBy = this.params.sort.split(',').join(' ');
    }
    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (this.params.fields) {
      const fields = this.params.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    const page = Math.max(this.params.page * 1, 1);

    const limit = this.params.limit * 1 || 10;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
