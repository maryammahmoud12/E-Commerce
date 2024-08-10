export class apiFeature {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  pagination() {
    let page = this.queryString.page * 1 || 1;
    if (page < 1) {
      page = 1;
    }
    let limit = 2;
    let skip = (page - 1) * limit;
    this.mongooseQuery.find().skip(skip).limit(limit);
    return this;
  }
  filter() {
    const excluded = ["page", "sort", "search", "select"];
    let filter = { ...this.queryString };
    excluded.forEach((e) => delete filter[e]);
    filter = JSON.parse(JSON.stringify(filter)).replace(
      /(gt | lt | gte | lte)/,
      (match) => `$${match}`
    );
    this.mongooseQuery.find(filter);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "));
    }
    return this;
  }
  select() {
    if (this.queryString.select) {
      this.mongooseQuery.select(this.queryString.select.replaceAll(",", " "));
    }
    return this;
  }
  search() {
    if (this.queryString.search) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.queryString.search, $options: "i" } },
          { description: { $regex: this.queryString.search, $options: "i" } },
        ],
      });
    }
  }
}
