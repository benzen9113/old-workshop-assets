class Contact {
  constructor(data) {
    this.validate(data);
    this.id = Contact.id++;
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email;
    Contact.instances.unshift(this);
  }

  static create(data) {
    return new Contact(data);
  }

  static findById(id) {
    let item = Contact.instances.find(c => c.id == id);
    if (!item) {
      let err = new Error('CONTACT_NOT_EXISTS');
      err.code = 404;
      throw err;
    }
    return item;
  }

  static find(findCallback) {
    if (typeof findCallback == 'function')
      return Contact.instances.filter(findCallback);

    return Contact.instances;
  }

  update(data) {
    this.validate(data);
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email;
    return this;
  }

  validate(data = {}) {
    let err = new Error('CONTACT_VAILDATION_FALED');
    err.fields = [];
    err.code = 400;
    
    if (!data.name)
      err.fields.push('name');
    
    if (!data.phone || !/^[0-9]{3}\-?[0-9]{3,4}\-?[0-9]{3,4}$/.test(data.phone))
      err.fields.push('phone');

    if (!data.email || !/^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+$/.test(data.email))
      err.fields.push('email');

    if (err.fields.length > 0) throw err;

    return this;
  }

  delete() {
    let index = Contact.instances.indexOf(this);
    Contact.instances.splice(index, 1);
  }

  static deleteByIds(ids) {
    Contact.instances = Contact.instances.filter(c => ids.indexOf(c.id) == -1);
  }
}

Contact.instances = [];
Contact.id = 1;

Contact.create({
  name: 'test1',
  phone: '010-1234-1234',
  email: 'test1@test.com'
});
Contact.create({
  name: 'test2',
  phone: '010-1234-1235',
  email: 'test2@test.com'
});
Contact.create({
  name: 'test3',
  phone: '010-1234-1236',
  email: 'test3@test.com'
});

module.exports = Contact;