"use client";
import { useState, useRef } from 'react';
import { env } from '../../config/env';
import { Editor } from '@tinymce/tinymce-react';
import FileManager from './FileManager/FileManager'; // ← Import FileManager tự code

const TextEditor = ({ editorData, setEditorData, disabled = false, toolbar = 'full', content }) => {
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
    'undo redo | link code image | formatselect | bold italic forecolor backcolor | ' +
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
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
            'fullscreen', 'insertdatetime', 'media', 'help', 'wordcount', 'paste'
          ],
          toolbar: toolBarFull,
          image_title: true,
          automatic_uploads: false,
          file_picker_types: 'image',
          file_picker_callback: filePickerCallback,  // ← Trigger FileManager
          paste_as_text: true,
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
