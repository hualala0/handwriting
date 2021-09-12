import { TinyMCE } from 'tinymce';

import Plugin from '../../main/ts/Plugin';

declare let tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  external_plugins: {
    'handwriting': 'http://localhost:8080/dist/handwritingplugin/plugin.js',
  },
  toolbar: 'handwriting',
});
