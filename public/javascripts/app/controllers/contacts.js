Ext.regController('contacts', {
  index: function() {
    if ( ! this.listPanel) {
      this.listPanel = this.render({
        xtype: 'contacts/list',
        listeners: {
          list: {
            select: this.show,
            scope: this
          },
          activate: function (listPanel) {
            listPanel.list.getSelectionModel().deselectAll();
          }
        }
      });
      
      this.listPanel.navBar.right.on({
        tap: this.compose,
        scope: this
      });
      
      this.application.stack.push(this.listPanel);
    } else {
      // Redisplay
      //alert('redisplay');
    }
  },
  
  
  compose: function () {
    this.composePanel = this.render({
      xtype: 'contacts/compose',
      listeners: {
        deactivate: function (form) {
          form.destroy(); // Destroy panel after removal
        }
      }
    });
    
    this.composePanel.navBar.right.on({
      tap: this.create,
      scope: this
    });
    
    this.application.stack.push(this.composePanel, {
      back: this.index,
      scope: this
    });
  },
  
  
  show: function(list, record) {
    var details = this.render({
      xtype: 'contacts/details',
      data: record.data,
      title: record.get('first_name') + ' ' + record.get('last_name'),
      listeners: {
        deactivate: function (details) {
          details.destroy();
        }
      }
    });
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