(function () {
    'use strict';

    var setup = function (editor, url) {
      editor.ui.registry.addButton('handwriting', {
        text: 'handwriting button',
        onAction: function () {
          editor.windowManager.openUrl({
            title: 'Handwriting',
            url: '../handwriting/index.html',
            buttons: [
              {
                type: 'custom',
                name: 'submitButton',
                text: 'Submit',
                primary: true
              },
              {
                type: 'cancel',
                name: 'closeButton',
                text: 'Cancel'
              }
            ],
            onAction: function (dialogApi, details) {
              window.addEventListener('message', function (event) {
                dialogApi.close();
              });
              dialogApi.sendMessage('submit');
            }
          });
        }
      });
    };
    var plugin = function () {
      tinymce.PluginManager.add('handwriting', setup);
    };

    plugin();
    tinymce.init({
      selector: 'textarea.tinymce',
      external_plugins: { 'handwriting': 'http://localhost:8080/dist/handwritingplugin/plugin.js' },
      toolbar: 'handwriting'
    });

}());
