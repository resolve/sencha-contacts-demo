app.views.Viewport = Ext.extend(Ext.Panel, {
  fullscreen: true,
  layout: 'card',
  cardSwitchAnimation: 'slide',
  initComponent: function() {
    Ext.apply(app.views, {
      contactsList:   new app.views.ContactsList(),
      contactShow:    new app.views.ContactShow(),
      contactEdit:    new app.views.ContactEdit(),
      contactNew:     new app.views.ContactNew()
    });
    Ext.apply(this, {
      items: [
        app.views.contactsList,
        app.views.contactShow,
        app.views.contactEdit,
        app.views.contactNew
      ]
    });
    app.views.Viewport.superclass.initComponent.apply(this, arguments);
  }
});


Ext.ns('UI');
UI.StackPanel = Ext.extend(Ext.Panel, {
  title: 'Untitled',
  navBar: {
    left: null,
    right: null
  },
  layout: { type: 'fit' },
  registerStack: function(stack) {
    alert('register');
    this.stack = stack;
    var toolbarItems = [];
    if (this.navBar.left) {
      // Add specified left button
      toolbarItems.push(this.navBar.left);
    } else {
      if (this.stack.previous()) {
        // Add a back button
        toolbarItems.push({
            text: this.stack.previous().title,
            ui: 'back',
            handler: function() {
              this.stack.pop();
            }
          });
      }
    }
    toolbarItems.push({ xtype: 'spacer' });
    if (this.navBar.right) {
      // Add specified right button
      toolbarItems.push(this.navBar.right);
    }
    
    this.addDocked({
      xtype: 'toolbar',
      title: this.title,
      items: toolbarItems
    });
  },
  deregisterStack: function(stack) {
    delete this.stack;
    this.removeDocked(this.dockedItems.first());
  }
});

UI.NavigationStack = Ext.extend(Ext.Container, {
  fullscreen: true,
  layout: 'card',
  cardSwitchAnimation: 'slide',
  autoDestory: false, // Don't destroy child views
  initComponent: function () {
    UI.NavigationStack.superclass.initComponent.apply(this, arguments);
    
    this.add(this.root); // Add the root view to the navigation stack
    this.root.registerStack(this);
  },
  previous: function() {
    var count = this.items.length;
    if (count > 1) {
      return this.items.get(count - 1);
    }
    
    return false;
  },
  push: function (view) {
    this.add(view);
    view.registerStack(this);
    this.setActiveItem(view);
  },
  pop: function () {
    alert('boo');
    alert(this.last());
  }
});

// ownerCt