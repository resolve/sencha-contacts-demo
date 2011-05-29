Ext.apply(Ext.data.validations,{
  emailMessage: 'is not a valid e-mail address',
  email: function(config, value) {
    if (value.length == 0 || value.match(/^.+@.+$/)){
      return true;
    } else {
      return false;
    }
  },
  phoneMessage: 'is not a valid phone number',
  phone: function(config, value) {
    if (value.length == 0 || value.match(/^\+?[\d-]+$/)){
      return true;
    } else {
      return false;
    }
  }
});


(function () {
  var originalInitRenderData = Ext.form.Field.prototype.initRenderData;
  var originalApplyRenderSelectors = Ext.form.Field.prototype.applyRenderSelectors;
  var originalOnRender = Ext.form.Field.prototype.onRender;
  
  var tpl = Ext.form.Field.prototype.renderTpl;
  tpl.splice(0, 0, '<div class="x-field-wrap">');
  tpl.push('</div><div class="x-field-errors"><tpl for="errors">{.} </tpl></div>');
  Ext.form.Field.prototype.renderTpl = tpl;
  
  Ext.override(Ext.form.Field, {
    errors: [],
    applyRenderSelectors: function () {
      this.renderSelectors = Ext.apply(this.renderSelectors, {
        errorsEl: '.x-field-errors'
      });
      
      originalApplyRenderSelectors.apply(this, arguments);
    },
    initRenderData: function () {
      originalInitRenderData.apply(this, arguments);
      
      this.renderData.errors = this.errors;
      return this.renderData;
    },
    onRender: function () {
      originalOnRender.apply(this, arguments);
      
      if (this.errors.length > 0) {
        this.el.addCls('errors');
      }
    },
    setErrors: function(errors) {
      this.errors = errors;
      if (errors.length > 0) {
        var message = [];
        Ext.each(errors, function (error) {
          if ('none' != error.message) {
            message.push(error.message);
          }
        });
        if (message.length > 0) {
          this.el.addCls('error');
        } else {
          this.el.addCls('error-nomsg');
        }
        this.errorsEl.setHTML(message.join(' '));
      } else {
        this.el.removeCls('error');
        this.el.removeCls('error-nomsg');
        this.errorsEl.setHTML('');
      }
    }
  });
})();

(function () {
  Ext.override(Ext.form.FormPanel, {
    setErrors: function(errors) {
      this.removeCls('errors');
      if (errors.length > 0) {
        this.addCls('errors');
        Ext.defer(function () { this.removeCls('errors'); }, 100, this);
      }
      
      Ext.each(this.query('field'), function (field) {
        if (field_errors = errors.getByField(field.getName())) {
          field.setErrors(field_errors);
        } else {
          field.setErrors([]); // Blank out any existing errors
        }
      });
    }
  });
})();

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
      
      if (this.navBar.show) {
        // Add a back button
        if ( ! this.navBar.left || ( ! this.navBar.left.handler && ! this.navBar.left.listeners)) {
          if (stack.previous()) {
            this.toolbar.insert(0, Ext.apply({
              text: this.stack.previous().title,
              ui: 'back',
              handler: this.stack.pop,
              scope: this.stack
            }, this.navBar.left));
          }
        }
      }
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
  clean: function () {
    if (this.itemToRemove && (-1 != this.items.indexOf(this.itemToRemove))) {
      this.remove(this.itemToRemove);
      this.itemToRemove = false;
    }
    
    this.itemToRemove = false;
  },
  show: function (view, options) {
    if ( ! this.itemToRemove && view != this.getActiveItem()) {
      // Only if we aren't in the middle of a transition
      
      var token = Ext.History.getToken();
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
    }
  },
  push: function (view, options, direct) {
    this.clean();
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
    this.clean();
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
      this.clean();
    }
  }
});

// ownerCt