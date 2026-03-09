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
          style="max-width:100%; height:auto; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);"
          class="img-fluid"
        />
      `;
      editorRef.current.editor.insertContent(imgHtml);
    }
    setShowFileManager(false);
  };

  const toolBarFull =  "anchor |undo redo | styles | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image";
  // 'undo redo | link anchor code image | formatselect fontsizeselect | ' +
  // 'bold italic underline forecolor backcolor | ' +
  // 'alignleft aligncenter alignright alignjustify | ' +
  // 'bullist numlist outdent indent | removeformat | help';


  
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
          menubar: true,
          images_upload_credentials: true,
          body_class: 'article-content',
          content_css: '/article-content.css',
          toolbar_mode: "sliding",
          plugins: [
            "advlist", "anchor", "autolink",
            "charmap", "code", "fullscreen",
            "help", "image", "insertdatetime",
            "link", "lists", "media",
            "preview", "searchreplace",
            "table", "visualblocks"
          ],
      
          toolbar:
            "undo redo | anchor link image | blocks fontsize| bold italic underline forecolor backcolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | " +
            "code preview fullscreen",
      
          contextmenu: "link image anchor",
      
          /* 🔥 QUAN TRỌNG NHẤT */
          valid_elements: "*[*]",
          extended_valid_elements:
            "a[href|target|title|class|style|id]," +
            "img[src|alt|title|width|height|class|style]," +
            "span[style]," +
            "h1[id|class|style]," +
            "h2[id|class|style]," +
            "h3[id|class|style]," +
            "p[id|class|style]," +
            "div[id|class|style]",
      
          formats: {
            anchor: {
              selector: "h1,h2,h3,p,div",
              attributes: { id: "%value" }
            }
          },
      
          /* Cho phép link nội bộ */
          link_default_target: "_blank",
          link_title: false,
      
          file_picker_types: "image",
          file_picker_callback: filePickerCallback,
      
          image_caption: true,
      
          setup: (editor) => {
            editor.on("keydown", function (e) {
              if (e.key === "Tab") {
                e.preventDefault();
                editor.insertContent("&nbsp;&nbsp;&nbsp;&nbsp;");
              }
            });
          }
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
