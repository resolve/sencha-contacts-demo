Ext.regApplication('app', {
  defaultTarget : 'stack',
  defaultUrl    : 'contacts/index',
  name          : 'Contacts',
  useHistory    : true, 
  
  launch: function() {
    this.stack = new UI.NavigationStack();
  }
});