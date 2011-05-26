app.views.ContactCompose = Ext.extend(Ext.form.FormPanel, {
  title: 'New Contact',
  scroll: 'vertical',
  defaults: { labelWidth: '40%'},
  submitOnAction: true,
  items: [
    {
      xtype: 'textfield',
      name: 'first_name',
      label: 'First Name'
    },
    {
      xtype: 'textfield',
      name: 'last_name',
      label: 'Last Name'
    },
    {
      xtype: 'textfield',
      name: 'email',
      label: 'Email'
    },
    {
      xtype: 'textfield',
      name: 'phone',
      label: 'Phone'
    }
  ],
  initComponent: function () {
    this.navBar = {
      show: true,
      right: {
        text: 'Save',
        ui: 'confirm'
      }
    }
    
    app.views.ContactCompose.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('contacts/compose', app.views.ContactCompose);