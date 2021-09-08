import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('handwritingplugin', {
    text: 'handwritingplugin button',
    onAction: () => {
      editor.setContent('<p>content added from handwritingplugin</p>');
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('handwritingplugin', setup);
};
