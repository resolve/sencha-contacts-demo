app.views.ContactsList = Ext.extend(Ext.Panel, {
  title: 'Contacts',
  layout: 'fit',
  store: 'contacts',
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
    
    app.views.ContactsList.superclass.initComponent.apply(this, arguments);
  }
});
Ext.reg('contacts/list', app.views.ContactsList);