app.controllers.contacts = new Ext.Controller({
  index: function(options){
//    app.views.contactsList.items.items[0].refresh();
//    app.views.contactsList.items.items[0].doComponentLayout();
    app.stores.remoteContacts.load(function() {
      app.views.viewport.setActiveItem(app.views.contactsList, options.animation);
      app.views.contactsList.getStore();
    });
    
  },
  show: function(options) {
    var id = parseInt(options.id);
    var contact = app.stores.remoteContacts.getById(id);
    if(contact) {
      app.views.contactShow.updateWithRecord(contact);
      app.views.viewport.setActiveItem(app.views.contactShow, options.animation);
    }
  },
  edit: function(options) {
    var id = parseInt(options.id);
    var contact = app.stores.remoteContacts.getById(id);
    if(contact) {
      app.views.contactEdit.updateWithRecord(contact);
      app.views.viewport.setActiveItem(app.views.contactEdit, options.animation);
    }
  },
  update: function(options) {
    var id = parseInt(options.id);
    if(app.models.update(id)) {
      app.views.contactsList.store.load();
      app.views.viewport.setActiveItem(app.views.contactsList, options.animation);
    }
  },
  newContact: function(options) {
    app.viewport.push(new app.views.ContactNew());
    //app.views.viewport.setActiveItem(app.views.contactNew, options.animation);
  },
  create: function(options) {
    if(app.models.save()) {
      Ext.Msg.show({
        title: 'Saved',
        msg: 'Your new contact has been saved',
        buttons: Ext.MessageBox.OK,
        fn: function() {
          app.views.contactsList.store.load();
          //var tmp = app.views.contactsList.items.items[0];
          //tmp.refresh();
          app.views.viewport.setActiveItem(app.views.contactsList, options.animation);
        }
      });
    } // else do nothing, stay on the new form UI
  },
  destroy: function(options) {
    var id = parseInt(options.id);
    if(app.models.destroy(id)){
      Ext.Msg.show({
        title: 'Contact Removed',
        msg: 'The contact has been removed from the device',
        buttons: Ext.MessageBox.OK,
        fn: function() {
          app.stores.remoteContacts.load();
          app.views.contactsList.items.items[0].refresh();
          app.views.contactsList.items.items[0].doComponentLayout();
          app.views.viewport.setActiveItem(app.views.contactsList, options.animation);
        }
      });
    }
  }
});