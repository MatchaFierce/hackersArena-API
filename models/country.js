// FIXME Corregir errores de linter
// FIXME agregar documentacion a clase y métodos
// FIXME para el manejo de estados 0, 1 y 2 sería mejor usar una constante definida con un nombre mas claro

const db = require('../db');


/**
 * Class that models a country a user can belong to
 * It is stored as a catalog in the database
 */
class Country {
  /**
   * Method that initializes a Country object
   * @param {number} id     the unique number that identifies the country (system created)
   * @param {string} name   the name of the country i.e 'Palestine'
   * @param {number} idFlag the id of the image of country's flag
   */
  constructor({
    id, name, idFlag,
  }) {
    this.id = id;
    this.name = name;
    this.id_flag = idFlag;
  }


  /**
   * Returns all existing countries in the database
   * @return {Promise} returns an array containing all existing countries
   * @throws {event}   returns the error
   */
  static async getAll() {
    try {
      const data = await db.selectAll('Country', '', '', 'id', true, 20, 0);
      const response = [];
      data.forEach((res) => {
        response.push(new Country(res));
      });
      return response;
    } catch (e) {
      throw e;
    }
  }


  /**
   * Returns an element if it matches the request
   * @param  {number}  countryId the unique id that identifies the element (param in the url)
   * @return {Promise}           returns the requested object
   * @throws {event}             returns an error
   */
  static async get(countryId) {
    try {
      const data = await db.selectOne('Country', '', [{ attr: 'id', oper: '=', val: countryId }]);
      return data.length !== 0 ? new Country(data[0]) : data;
    } catch (e) {
      throw e;
    }
  }


  /**
   * Updates the element that matches request, if none match, it creates it
   * @return {Promise} returns 0 if it exists
   *                           1 if it failed
   * @throws {event}   returns an error
   */
  async save() {
    try {
      if (this.id !== undefined && (await this.exists()).length !== 0) return this.update();
      if (await db.insert('Country', this)) return 0;
      return 1;
    } catch (e) {
      throw e;
    }
  }


  /**
   * Updates an element if it matches request
   * @return {Promise} returns 0 if the element was updated,
   *                           1 if it failed
   * @throws {event}   returns an error
   */
  async update() {
    try {
      if (this.id !== undefined && await db.update('Country', this, [{ attr: 'id', oper: '=', val: this.id }])) return 0;
      return 1;
    } catch (e) {
      throw e;
    }
  }


  /**
   * Deletes an element if it matches the request
   * @return {Promise} returns a 0 if the country is deleted,
   *                             1 if the country could not be deleted,
   *                             2 if it can't be found
   * @throws {event}   returns an error
   */
  async delete() {
    try {
      if (this.id !== undefined && (await this.exists()).length !== 0) {
        if (this.id !== undefined && await db.delete('Country', [{ attr: 'id', oper: '=', val: this.id }]) !== undefined) return 0;
        return 1;
      }
      return 2;
    } catch (e) {
      throw e;
    }
  }


  /**
   * Verifies that the element exists
   * @return {Promise} returns the country if it exists,
   *                           an empty array if it fails
   * @throws {event}   returns an error
   */
  async exists() {
    try {
      if (this.id !== undefined) {
        const result = await db.selectOne('Country', '', [{ attr: 'id', oper: '=', val: this.id }]);
        if (result) return result;
      }
      return [];
    } catch (e) {
      throw e;
    }
  }
}


module.exports = Country;
