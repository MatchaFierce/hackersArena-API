const { Verdict } = require('../models');

class VerdictCtrl {
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
      result.push(new Verdict(res));
    });
    return result;
  }

  async getAll(req, res) {
    let data = await Verdict.getAll();
    // const json = {
    //   data: data,
    //   total_count: data.length,
    //   per_page: data.length,
    //   page: 0,
    // };
    data = this.processResult(data);
    if (data.length === 0) {
      res.status(400).send({ message: 'No existen elementos que cumplan con la peticion' });
    } else {
      res.status(200).send({ data });
    }
  }

  static async get(req, res) {
    const data = await Verdict.get(req.params.verdictId);
    if (data.length === 0) {
      res.status(400).send({ message: 'Element not found' });
    }
    res.send({ data });
  }

  static async create(req, res) {
    const data = await new Verdict({ id: req.params.verdictId, type: req.body.type }).save();
    if (data === 0) res.status(201).send({ message: 'Succesfully saved' });
    else if (data === 1) res.status(400).send({ message: 'Could not be saved' });
  }

  static async delete(req, res) {
    const data = await new Verdict({ id: req.params.verdictId }).delete();
    if (data === 0) {
      res.status(200).send({ message: 'Eliminado correctamente' });
    } else if (data === 1) {
      res.status(400).send({ error: 'No se pudo eliminar' });
    } else if (data === 2) {
      res.status(404).send({ error: 'No existe el elemento a eliminar' });
    }
  }
}

module.exports = new VerdictCtrl();
