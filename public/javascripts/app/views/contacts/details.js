app.views.ContactDetails = Ext.extend(Ext.Panel, {
  styleHtmlContent: true,
  items: [
    {tpl: [
        '<h4>First Name</h4>',
        '<div class="field">{first_name}</div>'
    ]},
    {tpl: [
        '<h4>Last Name</h4>',
        '<div class="field">{last_name}</div>'
    ]},
    {tpl: [
        '<h4>Email</h4>',
        '<div class="field">{email}</div>'
    ]},
    {tpl: [
        '<h4>Phone</h4>',
        '<div class="field">{phone}</div>'
    ]}
  ],
  initComponent: function () {  
    this.navBar = {
      show: true
    };
    
    this.dockedItems = [
      {
        xtype: 'toolbar',
        dock: 'bottom',
        items: [
          {
            id: 'delete',
            text: 'remove',
            ui: 'decline'
          },
          {xtype: 'spacer'},
          {
            id: 'edit',
            text: 'edit',
            ui: 'confirm'
          }
        ]
      }
    ];
       
    app.views.ContactDetails.superclass.initComponent.apply(this, arguments);
  }
});

Ext.reg('contacts/details', app.views.ContactDetails);