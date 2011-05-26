app.views.ContactsList = Ext.extend(Ext.Panel, {
  title: 'Contacts',
  store: new Ext.data.Store({
      autoLoad: true,
      model: 'Contact',
      sorters: ['last_name'],
      sortOnLoad: true,
      getGroupString : function(record) {
          return record.get('last_name')[0].toUpperCase();
      },
    }),
  initComponent: function () {  
    this.navBar = {
      show: true,
      right: {
        iconCls: 'add',
        iconMask: true
      }
    };
    
    this.list = new Ext.List({
      xtype: 'list',
      id: 'contactslist',
      grouped: true,
      indexBar: true,
      store: this.store,
      itemTpl: '{first_name} <strong>{last_name}</strong>'
    });
    this.items = [this.list];
    
    this.store.load();
    this.store.sort('last_name', 'ASC');
    app.views.ContactsList.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('contacts/list', app.views.ContactsList);