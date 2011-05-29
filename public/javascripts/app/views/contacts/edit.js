app.views.ContactCompose = Ext.extend(Ext.form.FormPanel, {
  title: 'New Contact',
  scroll: 'vertical',
  items: [{
    xtype: 'fieldset',
    title: false,
    instructions: 'Fill in at least a first and last name.',
    defaults: { labelWidth: '40%'},
    items: [{
        xtype: 'textfield',
        name: 'first_name',
        label: 'First Name',
        required: true
      }, {
        xtype: 'textfield',
        name: 'last_name',
        label: 'Last Name',
        required: true
      }, {
        xtype: 'emailfield',
        name: 'email',
        label: 'Email',
        placeHolder: 'you@example.com'
      }, {
        xtype: 'textfield',
        inputType: 'tel',
        name: 'phone',
        label: 'Phone'
      }
    ]
  }],
  initComponent: function () {
    this.navBar = {
      show: true,
      left: {
        text: 'Cancel'
      },
      right: {
        text: 'Done',
        ui: 'confirm'
      }
    }
    
    app.views.ContactCompose.superclass.initComponent.apply(this, arguments);
  }
});
Ext.reg('contacts/edit', app.views.ContactCompose);