const { University } = require('../models');

class UniversityCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.processResult = this.processResult.bind(this);
  }

  static processResult(data) {
    const result = [];
    data.forEach((res) => {
      result.push(new University(res));
    });
    return result;
  }

  async getAll(req, res) {
    let data = await University.getAll();
    data = this.processResult(data);
    if (data.length === 0) {
      res.status(400).send({ message: 'There are no elements that match request' });
    } else {
      res.status(200).send({ data });
    }
  }

  static async get(req, res) {
    const data = await University.get(req.params.universityId);
    if (data.length === 0) {
      res.status(400).send({ message: 'Element not found' });
    }
    res.send({ data });
  }

  static async create(req, res) {
    const data = await new University({
      id: req.params.universityId,
      name: req.body.name,
      idLogo: req.body.idLogo,
      idCountry: req.body.idCountry,
    })
      .save();
    if (data === 0) res.status(201).send({ message: 'Saved succesfully' });
    else if (data === 1) res.status(400).send({ message: 'Could not be saved' });
    else if (data === 2) res.status(400).send({ message: 'Country does not exist' });
  }

  static async delete(req, res) {
    const data = await new University({ id: req.params.universityId }).delete();
    if (data === 0) {
      res.status(200).send({ message: 'Deleted succesfully' });
    } else if (data === 1) {
      res.status(400).send({ error: 'Could not be deleted' });
    } else if (data === 2) {
      res.status(404).send({ error: 'There is no element to delete' });
    }
  }
}

module.exports = new UniversityCtrl();
