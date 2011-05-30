Ext.regController('contacts', {
  index: function() {
    if ( ! this.listPanel) {
      this.listPanel = this.render({
        xtype: 'contacts/list',
        listeners: {
          list: {
            select: function (list, record) {
              Ext.dispatch({
                controller: 'contacts',
                action    : 'show',
                historyUrl: 'contacts/show/' + record.get('id'),
                id        : record.get('id')
              });
            }
          },
          activate: function (listPanel) {
            listPanel.list.getSelectionModel().deselectAll();
          }
        }
      });
      
      this.listPanel.navBar.right.on({
        tap: function () {
          Ext.dispatch({
            controller: 'contacts',
            action    : 'compose',
            historyUrl: 'contacts/compose'
          });
        }
      });
    } else {
      // Redisplay
      //alert('redisplay');
    }
    
    this.application.stack.show(this.listPanel);
  },
  
  
  compose: function () {
    this.form = this.render({
      xtype: 'contacts/edit',
      listeners: {
        deactivate: function (form) {
          form.destroy(); // Destroy panel after removal
        }
      }
    });
    
    this.form.navBar.right.on({
      tap: this.create,
      scope: this
    });
    
    this.application.stack.show(this.form, {
      returnPath: {
        controller: 'contacts',
        action    : 'index',
        historyUrl: 'contacts/index'
      },
      on  : { type: 'slide', direction: 'up', cover: true },
      off : { type: 'slide', direction: 'down', reveal: true }
    });
  },
  
  
  create: function () {
    var contact = Ext.ModelMgr.create(this.form.getValues(), 'Contact');
    var validation = contact.validate();
    if ( ! validation.isValid()) {
      this.form.setErrors(validation);
    } else {
      // Save here
      var store = Ext.getStore('contacts');
      store.add(contact);
      store.sync();
      this.application.stack.pop();
    }
    // Ext.getStore('contacts').create(this.form.getValues());
    //     this.application.stack.pop(); // Will automatically call index
  },
  
  
  show: function(params) {
    var record = Ext.getStore('contacts').findRecord('id', params.id);
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
    
    this.application.stack.show(details, {
      returnPath: {
        controller: 'contacts',
        action    : 'index',
        historyUrl: 'contacts/index'
      }
    });
  }
});