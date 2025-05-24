'use client';
import React from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from "ckeditor5-build-full";

export default function CustomEditor() {
  return (
    <CKEditor
      editor={ClassicEditor}
      data="<p>Viết nội dung vào đây...</p>"
      onReady={editor => {
        console.log('Editor is ready to use!', editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        console.log({ event, editor, data });
      }}
      onBlur={(event, editor) => {
        console.log('Blur.', editor);
      }}
      onFocus={(event, editor) => {
        console.log('Focus.', editor);
      }}
      
      config={{
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "exportPdf",
            "exportWord",
            "importWord",
            "|",
            "showBlocks",
            "formatPainter",
            "findAndReplace",
            "selectAll",
            "wproofreader",
            "|",
            "heading",
            "|",
            "style",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "-",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "code",
            "|",
            "removeFormat",
            "|",
            "specialCharacters",
            "horizontalLine",
            "pageBreak",
            "|",
            "link",
            "insertImage",
            "ckbox",
            "insertTable",
            "tableOfContents",
            "insertTemplate",
            "highlight",
            "blockQuote",
            "mediaEmbed",
            "codeBlock",
            "htmlEmbed",

            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "outdent",
            "indent",
            "insertImage",
            "sourceEditing"
          ],
          shouldNotGroupWhenFull: true
        }
      }}
    />
  );
}
