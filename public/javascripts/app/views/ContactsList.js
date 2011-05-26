app.views.ContactsList = Ext.extend(UI.StackPanel, {
  title: 'Contacts',
  navBar: {
    right: {
      text: 'new',
      ui: 'confirm',
      handler: function() {
        Ext.dispatch({
          controller: app.controllers.contacts,
          action: 'newContact'
        });
      }
    }
  },
  store: new Ext.data.Store({
      model: 'app.models.Contact',
      sorters: ['last_name'],
      sortOnLoad: true,
      getGroupString : function(record) {
          return record.get('last_name')[0];
      },
    }),
  initComponent: function() {    
    var config = {
      items: [{
        xtype: 'list',
        id: 'contactslist',
        grouped: true,
        indexBar: true,
        store: this.store,
        style: {
          background: '#ffffff'
        },
        itemTpl: new Ext.XTemplate(
          '<tpl for=".">',
            '<div>',
            '{first_name} {last_name}',
            '</div>',
          '</tpl>'
        ),
        onItemDisclosure: function(record){
          Ext.dispatch({
            controller: app.controllers.contacts,
            action: 'show',
            id: record.getId(),
            animation: {type: 'slide', direction: 'left'}
          });
        },
        onItemTap: function(item) {
          record = this.getRecord(item);
          Ext.dispatch({
            controller: app.controllers.contacts,
            action: 'show',
            id: record.getId(),
            animation: {type: 'slide', direction: 'left'}
          });
        }
      }]
    };
    
    Ext.apply(this, config);
    
    this.store.load();
    this.store.sort('last_name', 'ASC');
    app.views.ContactsList.superclass.initComponent.apply(this, arguments);
  },
  listeners: {
    beforeactivate: function() {
    }
  }
});