import { env } from '@/config/env';
import { Editor } from '@tinymce/tinymce-react';
// import { env } from '../../../configs/Config';
// import axios from 'axios';
// import { Modal } from 'antd';
// import { getLocalStorage, removeCookie } from 'utils/utils';
// import { listAPI } from 'services/apiLibrary';
const TextEditor = ({ editorData, setEditorData, disabled = false, toolbar = 'full', content }) => {
  const handleEditorChange = (e) => {
    setEditorData(e.target.getContent());
  };

  const toolBarBase =
    'link formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify ' +
    '| bullist numlist outdent indent | removeformat';
  const toolBarFull =
    'undo redo| link code image | formatselect | bold italic forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | removeformat | help';

  return (
    <Editor
    // vo25zsk87945fzmx85atwacm1js3vj6chy45bcvpppbukvky
    apiKey={`ls9n12mosetj64wsxzgq7wuxnthcj022co290q0x5nw59vdv`}
    initialValue={content}
    disabled={disabled}
    init={{
      height: 600,
     width: '100%',
      menubar: toolbar === 'full' ? true : false,
      // images_upload_base_path: '/file/straight-upload',
      images_upload_credentials: true,
      plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'preview',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'code',
        'help',
        'wordcount',
        'paste',
      ],
      toolbar: toolbar === 'full' ? toolBarFull : toolbar === 'base' ? toolBarBase : false,
      image_title: true,
      automatic_uploads: true,
      file_picker_types: 'image',
      file_picker_callback: function (cb, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        var url = env.uploadUrl;
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        xhr.open('POST', url, true);
        // xhr.setRequestHeader('Authorization', 'Bearer' + ' ' + getLocalStorage('access_token'));

        input.onchange = function () {
          var file = this.files[0];
          var reader = new FileReader();
          xhr.onload = function () {
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              const imageUrl = response?.url || response?.Data?.url; // tùy vào backend bạn trả
              cb(imageUrl); // Phải là đường dẫn URL ảnh hợp lệ
            } else {
              console.log("Upload thất bại");
            }
          };
          reader.onload = function () {
            var id = 'blobid' + new Date().getTime();
            var blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
            var base64 = reader.result.split(',')[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
            fd.append('file', blobInfo.blob(), blobInfo.filename());
            xhr.send(fd);
          };

          reader.readAsDataURL(file);
        };

        input.click();
      },
      images_upload_handler: (blobInfo, success, failure) => {
        let data = new FormData();
        data.append('file', blobInfo.blob(), blobInfo.filename());
        var reader = new FileReader();
        // Cần gửi FormData này bằng fetch hoặc axios
        fetch(env.uploadUrl, {
          method: 'POST',
          body: data,
        })
          .then((res) => res.json())
          .then((res) => {
            const url = res?.url || res?.Data?.imageUrl; // kiểm tra lại
            success(url); // Phải truyền URL ảnh thực sự
          })
          .catch(() => {
            failure('Upload thất bại');
          });
          reader.readAsDataURL(blobInfo.blob());
      },
      paste_as_text: true,
      paste_text_sticky: true,
      paste_auto_cleanup_on_paste: true,
      paste_remove_styles: true,
      paste_remove_styles_if_webkit: true,
      paste_strip_class_attributes: true,
    }}
    onChange={handleEditorChange}
  />

  );
};

export default TextEditor;
