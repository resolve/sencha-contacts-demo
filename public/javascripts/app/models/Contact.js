app.models.Contact = new Ext.regModel('app.models.Contact', {
  fields: [
    {name: 'id', type: 'int'},
    {name: 'remote_id', type: 'int'},
    {name: 'first_name', type: 'string'},
    {name: 'last_name', type: 'string'},
    {name: 'email', type: 'string'},
    {name: 'phone', type: 'string'}
  ],
  validations: [
    {type: 'presence', field: 'first_name'},
    {type: 'presence', field: 'last_name'}
  ],
  proxy: {
    type: 'ajax',
    url: 'contacts.xml',
    reader: {
      type: 'xml',
      //root: 'contacts',
      record: 'contact'
    },
    writer: {
      type: 'xml',
      record: 'contact'
    }
  }
});

app.stores.remoteContacts = new Ext.data.Store({
  id: 'remoteContacts',
  model: 'app.models.Contact'
});

app.models.save = function() {
  var form = app.views.contactNew
  var params = form.getValues();
  var newcontact = Ext.ModelMgr.create(params, app.models.Contact);
  var errors = newcontact.validate();
  if (errors.isValid()) {
    app.stores.remoteContacts.add(newcontact);
    app.stores.remoteContacts.sync();
    form.reset();
    return true;
  } else {
    var errorMsg = '';
    errors.each(function(e) {
      errorMsg = errorMsg + fieldHumanize(e.field) + ' ' + e.message + "<br />";
      errorMsg = errorMsg ;
    });
    Ext.Msg.show({
      title: 'Error',
      msg: errorMsg,
      buttons: Ext.MessageBox.OK,
      fn: function() {
        return false;
      }
    });
  }
}

app.models.update = function(id) {
  var contact = app.stores.remoteContacts.getById(id);
  if (contact) {
    var form = app.views.contactEdit
    var params = form.getValues();
    for (var field in params) {
      console.log("field: " + field + ' | value: ' + params[field]);
      contact.set(field, params[field]);
    }
    var errors = contact.validate();
    if (errors.isValid()) {
      app.stores.remoteContacts.sync();
      Ext.Msg.alert('Updated', 'The contact has been updated');
      return true;
    } else {
      var errorMsg = '';
      errors.each(function(e) {
      errorMsg = errorMsg + fieldHumanize(e.field) + ' ' + e.message + "<br />";
      errorMsg = errorMsg ;
    });
    Ext.Msg.alert('Error', errorMsg);
      return false;
    }
  } else {
    return false;
  }
};

app.models.destroy = function(id) {
  var contact = app.stores.remoteContacts.getById(id);
  if (contact) {
    app.stores.remoteContacts.remove(contact);
    app.stores.remoteContacts.sync();
    return true;
  } else {
    return false;
  }
};