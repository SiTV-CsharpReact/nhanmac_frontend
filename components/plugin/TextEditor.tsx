"use client";
import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import FileManager from './FileManager/FileManager'; // ← Import FileManager tự code

const TextEditor = ({  setEditorData, disabled = false, toolbar = 'full', content }) => {
  const editorRef = useRef(null);
  const [showFileManager, setShowFileManager] = useState(false);
  
  const handleEditorChange = (e) => {
    setEditorData(e.target.getContent());
  };

  // 🔥 MỞ FILE MANAGER TỰ CODE
  const filePickerCallback = (cb, value, meta) => {
    editorRef.current.editor.windowManager.close();
    setShowFileManager(true); // ← Mở modal FileManager
  };

  // 🔥 INSERT ẢNH VÀO EDITOR
  const handleFileSelect = (url, name) => {
    if (editorRef.current?.editor) {
      const imgHtml = `
        <img 
          src="${url}" 
          alt="${name}" 
          title="${name}" 
          style="max-width:100%; height:auto; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);"
          class="img-fluid"
        />
      `;
      editorRef.current.editor.insertContent(imgHtml);
    }
    setShowFileManager(false);
  };

  const toolBarFull =
  'undo redo | link anchor code image | formatselect fontsizeselect | ' +
  'bold italic underline forecolor backcolor | ' +
  'alignleft aligncenter alignright alignjustify | ' +
  'bullist numlist outdent indent | removeformat | help';

  return (
    <>
      <Editor
        ref={editorRef}
        apiKey="wc8tizgg3cirrsfaetuopcjdo8jq952zj6go5uz8qv3j3oc9"
        initialValue={content}
        disabled={disabled}
        init={{
          height: 600,
          width: '100%',
          menubar: toolbar === 'full',
          images_upload_credentials: true,
          body_class: 'article-content',
          content_css: '/article-content.css',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap','anchor',
            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
            'fullscreen', 'insertdatetime', 'media', 'help', 'wordcount', 'paste'
          ],
          toolbar: toolBarFull,
          image_title: true,
          automatic_uploads: false,
          file_picker_types: 'image',
          file_picker_callback: filePickerCallback,  // ← Trigger FileManager
          paste_as_text: false,
          paste_webkit_styles: 'all',
          paste_retain_style_properties: 'all',
          paste_enable_default_filters: false,
          valid_elements: '*[*]',
          extended_valid_elements:
            'a[href|target|title|class|style],img[src|alt|title|width|height|class|style],span[style],h1[id|class|style],h2[id|class|style],h3[id|class|style]',
            setup: (editor) => {
              editor.on('keydown', function (e) {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  editor.execCommand('mceInsertContent', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
                }
              });
            },
          //   content_style: `
          //   body { font-family: Arial, sans-serif; font-size:14px; }
          //   h1 { 
          //     font-size: 18px; 
          //     font-weight: bold; 
          //     color: #e36c0a;
          //     text-transform: uppercase;
          //   }
          //   h2 { font-size: 14px; font-weight: bold;   text-transform: uppercase;}
          //   h3 { font-size: 14px; font-weight: bold; text-transform: capitalize;  }
          //   a { text-decoration: none; }
          //   img { max-width:100%; height:auto; }
          // `,
          link_default_target: '_blank',
          link_title: false,      
          images_default_width: '',
          images_default_height: '',
          image_caption: true
        }}
        onChange={handleEditorChange}
      />

      {/* 🔥 FILE MANAGER TỰ CODE */}
      {showFileManager && (
        <FileManager 
          onSelect={handleFileSelect}
          onClose={() => setShowFileManager(false)}
        />
      )}
    </>
  );
};

export default TextEditor;
