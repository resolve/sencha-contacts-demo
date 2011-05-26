app.views.ContactDetails= Ext.extend(Ext.Panel, {
  scroll: 'vertical',
  styleHtmlContent: true,
  dockedItems:[
    {
      xtype: 'toolbar',
      dock: 'bottom',
      items: [
        {
          id: 'delete',
          text: 'remove',
          ui: 'decline',
          handler: function() {
            Ext.dispatch({
              controller: app.controllers.contacts,
              action: 'destroy',
              id: this.record.getId(),
              animation: {type: 'slide', direction: 'right'}
            })
          }
        },
        {xtype: 'spacer'},
        {
          id: 'edit',
          text: 'edit',
          ui: 'confirm',
          listeners: {
            'tap': function(record) {
              Ext.dispatch({
                controller: app.controllers.contacts,
                action: 'edit',
                id: this.record.getId(),
                animation: {type: 'slide', direction: 'left'}
              });
            }
          }
        }
      ]
    }
  ],
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
  ]
});

Ext.reg('contacts/details', app.views.ContactDetails);