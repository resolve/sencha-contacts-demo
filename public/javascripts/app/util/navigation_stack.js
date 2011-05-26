(function () {
  var originalInit = Ext.Panel.prototype.initComponent;
  
  Ext.override(Ext.Panel, {
    title: 'Untitled',
    navBar: {
      show: false,
      left: null,
      right: null
    },
    registerStack: function(stack) {
      this.stack = stack;
      
      if ( ! this.navBar.left && stack.previous()) {
         // Add a back button
        this.toolbar.insert(0, {
          itemId: 'backButton',
          text: this.stack.previous().title,
          ui: 'back',
          handler: this.stack.pop,
          scope: this.stack
        });
      }
    },
    deregisterStack: function(stack) {
      delete this.stack;
      this.removeDocked(this.dockedItems.first());
    },
    initComponent: function () {
      originalInit.apply(this, arguments);
      
      if (this.navBar.show) {
        // Add the navigation bar
        var toolbarItems = [];
        if (this.navBar.left) {
          // Add specified left button
          this.navBar.left = Ext.create(this.navBar.left, 'button');
          toolbarItems.push(this.navBar.left);
        }
        toolbarItems.push({ xtype: 'spacer' });
        if (this.navBar.right) {
          // Add specified right button
          this.navBar.right = Ext.create(this.navBar.right, 'button');
          toolbarItems.push(this.navBar.right);
        }
        
        this.toolbar = new Ext.Toolbar({
          dock: 'top',
          title: this.title,
          items: toolbarItems
        });
        this.addDocked(this.toolbar);
      }
    }
  });
})();

Ext.ns('UI');
UI.NavigationStack = Ext.extend(Ext.Container, {
  fullscreen: true,
  layout: 'card',
  cardSwitchAnimation: 'slide',
  autoDestory: false, // Don't destroy child views automatically
  initComponent: function () {
    this.options = [];
    UI.NavigationStack.superclass.initComponent.apply(this, arguments);
    
    if (this.root) {
      this.add(this.root); // Add the root view to the navigation stack
      this.root.registerStack(this);
    }
  },
  previous: function() {
    var count = this.items.length;
    if (count > 1) {
      return this.items.get(count - 2);
    }
    
    return false;
  },
  show: function (view, options) {
    var token = Ext.History.getToken();
    if ( ! this.itemToRemove && view != this.getActiveItem()) {
      // Only if we aren't in the middle of a transition
      options = Ext.apply({
        on: { type: 'slide', direction: 'left' },
        off: { type: 'slide', direction: 'right' }
      }, options);
    
      if (-1 != (index = this.items.indexOf(view))) {
        this.setActiveItem(view, false);
        this.options.slice(0, index - 1); // Remote all unused options
        if (this.items.slice) {
          Ext.each(this.items.slice(index + 1), function (item) {
            this.remove(item); // Remove view
          });
        }
      } else {
        if (this.items.length == 0) {
          if (options.returnPath) {
            Ext.dispatch(options.returnPath);
            Ext.History.add(token);
          }
          this.push(view, options, true);
        } else {
          this.push(view, options);
        }
      }
    } else {
      console.log('cant do it: ' + view.title);
    }
  },
  push: function (view, options, direct) {
    options = Ext.apply({
      on: { type: 'slide', direction: 'left' },
      off: { type: 'slide', direction: 'right' }
    }, options);
    
    this.options.push(options);
    
    this.add(view);
    view.registerStack(this);
    if ( ! this.previous() || direct) {
      this.setActiveItem(view, false);
    } else {
      this.setActiveItem(view, options.on);
    }
  },
  pop: function () {
    if (this.previous()) {
      var options = this.options.pop();
      this.itemToRemove = this.getActiveItem();
      
      if (options.returnPath) {
        Ext.dispatch(options.returnPath);
      }
      
      this.setActiveItem(this.previous(), options.off);
    }
  },
  listeners: {
    cardswitch: function () {
      // Remove item after animation completes
      if (this.itemToRemove && (-1 != this.items.indexOf(this.itemToRemove))) {
        this.remove(this.itemToRemove);
        this.itemToRemove = false;
      }
      this.itemToRemove = false;
    }
  }
});

// ownerCt