app.models.Contact = new Ext.regModel('Contact', {
  fields: [
    { name: 'id', type: 'int' },
    { name: 'first_name', type: 'string' },
    { name: 'last_name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' }
  ],
  validations: [
    { type: 'presence', field: 'first_name', message: 'none' },
    { type: 'presence', field: 'last_name', message: 'none' },
    { type: 'email', field: 'email', message: 'Please enter a valid e-mail address.' },
    { type: 'phone', field: 'phone', message: 'Please enter a valid phone number.'}
  ],
  proxy: {
    type: 'ajax',
    url: 'contacts.xml',
    reader: {
      type: 'xml',
      record: 'contact'
    },
    writer: {
      type: 'xml',
      record: 'contact'
    }
  }
});

Ext.regStore('contacts', {
  autoLoad: true,
  model: 'Contact',
  sorters: ['last_name'],
  sortOnLoad: true,
  getGroupString : function(record) {
      return (record.get('last_name') || '#')[0].toUpperCase();
  },
});