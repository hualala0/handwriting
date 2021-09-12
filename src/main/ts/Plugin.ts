import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('handwriting', {
    text: 'handwriting button',
    onAction: () => {
      editor.windowManager.openUrl({
        title: 'Handwriting',
        url:'../handwriting/index.html',
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
          },
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

const plugin = (): void => {
  tinymce.PluginManager.add('handwriting', setup);
};

export default plugin;
