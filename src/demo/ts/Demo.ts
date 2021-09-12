import { TinyMCE } from 'tinymce';

import Plugin from '../../main/ts/Plugin';

declare let tinymce: TinyMCE;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  external_plugins: {
    'handwriting': 'https://hualala0.github.io/handwriting/dist/handwritingplugin/plugin.js',
  },
  toolbar: 'handwriting',
});
