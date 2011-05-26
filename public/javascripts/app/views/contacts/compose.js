app.views.ContactCompose = Ext.extend(Ext.form.FormPanel, {
  title: 'New Contact',
  scroll: 'vertical',
  submitOnAction: true,
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
        label: 'Email'
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
      right: {
        text: 'Save',
        ui: 'confirm'
      }
    }
    
    app.views.ContactCompose.superclass.initComponent.apply(this, arguments);
  }
});
Ext.reg('contacts/compose', app.views.ContactCompose);