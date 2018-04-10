$(function(){
  // views
  let $views = {};
  
  // find views
  $("[data-app]").each((_, el) => {
    let $el = $(el);
    let viewName = $el.data('app');
    $views[viewName] = $el;
  });

  // app state
  let state = {
    items: [],
    loadingItems: true,
    formError: null,
    formData: null,
    selectedItem: null,
  };

  // app event handlers
  // fetch, item-select, form-submit, update-view
  let handlers = {
    fetch: function(e, data = null) {
      state.loadingItems = true;
      triggerEvent('update-view');
      callAPI('/contacts', {
          method: 'get',
          data, // will be converted and added to querystring
        },
        function(items){
          state.loadingItems = false;
          state.items = items;
          state.formError = null;
          triggerEvent('update-view');
        },
        function(err){
          state.loadingItems = false;
          state.formError = err.message;
          triggerEvent('update-view');
        });
    },
    'item-select': function(e, item) {
      if (state.selectedItem == item) {
        triggerEvent('form-cancel');
      } else {
        state.selectedItem = item;
        state.formData = state.formError = null;
        triggerEvent('update-view');
      }
    },
    'form-cancel': function(e) {
      state.formError = state.formData = state.selectedItem = null;
      triggerEvent('update-view');
    },
    'item-remove': function(e) {
      let item = state.selectedItem;
      if (!confirm(`Sure to remove ${item.name}?`)) return;
      callAPI('/contacts/' + item.id, {
            method: 'delete'
          },
          function(){
            let index = state.items.indexOf(item);
            state.items.splice(index, 1);
            state.selectedItem = state.formError = state.formData = null;
            triggerEvent('update-view');
          },
          function(res){
            state.formError = res.responseJSON.message;
            state.formData = data;
            triggerEvent('update-view');
          });
    },
    'form-submit': function(e, data) {
      if (state.selectedItem) {
        callAPI('/contacts/' + state.selectedItem.id, {
            method: 'put',
            data: JSON.stringify(data), // object will be passed as JSON (in body)
            contentType: 'application/json'
          },
          function(item){
            let index = state.items.indexOf(state.selectedItem);
            state.selectedItem = state.items[index] = item; // replace reference
            state.formError = state.formData = null;
            triggerEvent('update-view');
          },
          function(res){
            state.formError = `Enter ${res.responseJSON.fields.join(', ')} correctly.`;
            state.formData = data;
            triggerEvent('update-view');
          });
      } else {
        callAPI('/contacts', {
            method: 'post',
            data: JSON.stringify(data), // object will be passed as JSON (in body)
            contentType: 'application/json'
          },
          function(item){
            state.items.unshift(item); // unshift: prepend new element to array
            state.formError = state.formData = null;
            triggerEvent('update-view');
            $views['form-name'].focus();
          },
          function(res){
            state.formError = `Enter ${res.responseJSON.fields.join(', ')} correctly.`;
            state.formData = data;
            triggerEvent('update-view');
          });
      }
    },
    'update-view': function(e) {
      // list
      $views['list-loading'][state.loadingItems ? 'show' : 'hide']();
      $views['list-empty'].hide();

      // form
      let item = state.selectedItem;
      let formData = state.formData;
      if (item) {
        $views['form-title'].text('Edit Contact');
        $views['form-name'].val(formData ? formData.name : item.name);
        $views['form-phone'].val(formData ? formData.phone : item.phone);
        $views['form-email'].val(formData ? formData.email : item.email);
        $views['form-submit'].text('Update');
        $views['form-cancel'].show();
        $views['form-remove'].show();
      } else {
        $views['form-title'].text('Create Contact');
        $views['form-name'].val(formData ? formData.name : '');
        $views['form-phone'].val(formData ? formData.phone : '');
        $views['form-email'].val(formData ? formData.email : '');
        $views['form-submit'].text('Save');
        $views['form-cancel'].hide();
        $views['form-remove'].hide();
      }

      // form error
      if (state.formError) {
        $views['form-error'].text(state.formError).show();
      } else {
        $views['form-error'].hide();
      }

      // list
      if (state.items.length == 0) {
        $views['list-empty'].show();
        $views['list'].hide();
      } else {
        let $list = $views['list'];
        let $template = $views['list-item-template'].hide();
        $list.children().not($template).remove();
        $list.append(state.items.map(item => {
          let $item = $template.clone().show();
          if (item == state.selectedItem) $item.addClass('active');
          $item.data('item', item); // reference to data
          $item.find('[data-app="list-item-name"]').text(item.name);
          $item.find('[data-app="list-item-phone"]').text(item.phone);
          $item.find('[data-app="list-item-email"]').text(item.email);
          return $item;
        })).show();
      }
    }
  };

  // register handlers
  Object.keys(handlers).forEach(name => {
    let eventName = 'app-' + name;
    $(window).on(eventName, handlers[name]);
  });

  // bind handlers
  $views['list'].on('click', function(e){
    let $item = $(e.target).closest('[data-app="list-item-template"]');
    if (!$item) return;
    let item = $item.data('item');
    triggerEvent('item-select', item);
  });

  $views['search'].on('keyup', function(e){
    if (e.keyCode == 27) { // ESC
      e.stopPropagation();
      $views['search'].val('');
      triggerEvent('fetch');
    } else {
      let keyword = $views['search'].val().trim();
      triggerEvent('fetch', {search: keyword});  // object will be passed to querystring 
    }
  });

  $views['form-cancel'].on('click', function(){
    triggerEvent('form-cancel');
  });

  $(window).on('keyup', function(e){
    if (e.keyCode == 27) { // ESC
      triggerEvent('form-cancel');
    }
  });

  $views['form-remove'].on('click', function(){
    triggerEvent('item-remove');
  });

  $views['form'].on('submit', function(e){
    e.preventDefault();
    triggerEvent('form-submit', {
      name: $views['form-name'].val(),
      phone: $views['form-phone'].val(),
      email: $views['form-email'].val(),
    });
  });

  // initiate app
  triggerEvent('update-view');
  triggerEvent('fetch');
  $('body').show();

  function callAPI(path, options = {}, success = null, fail = null) {
    $.ajax(`${location.protocol}//${location.host}${path}`, options)
    .done(success)
    .fail(fail);
  }

  function triggerEvent(name, data = null) {
    $(window).trigger('app-' + name, data);
  }
});