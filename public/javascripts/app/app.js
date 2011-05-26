Ext.regApplication({
    name: 'app',
    launch: function() {
      this.viewport = new UI.NavigationStack({
        root: new this.views.ContactsList()
      });
    }
});