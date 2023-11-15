import React, { memo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  content?: string;
  onChangeData?: (content: string) => void;
  onBlur?: (content: string) => void;
};

const Editor = memo(({ content, onBlur, onChangeData }: Props) => {
  return (
    <CKEditor
    
      editor={ClassicEditor}
      data={content ?? ""}
      // onReady={(editor) => {
      //   MyCustomUploadAdapterPlugin(editor);
      // }}
      onChange={(event, editor: any) => {
        const data = editor.getData();
        onChangeData?.(data);
      }}
      onBlur={(event, editor: any) => {
        const data = editor.getData();
        onBlur?.(data);
      }}
      onFocus={(event, editor) => { }}
      config={{
        mediaEmbed: {
          previewsInData: true,
        },
        toolbar: {
          items: [
            'heading',
            '|',
            'fontSize',
            'fontFamily',
            '|',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'alignment',
            '|',
            'numberedList',
            'bulletedList',
            '|',
            'outdent',
            'indent',
            '|',
            'todoList',
            'link',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            '|',
            'superscript',
            'subscript',
            'removeFormat',
            'specialCharacters',
            'undo',
            'redo'
          ]
        }
      }}
    />
  );
});

// class MyUploadAdapter {
//   public loader;
//   constructor(loader: any) {
//     this.loader = loader;
//   }

//   upload() {
//     return this.loader.file.then(async (file: any) => {
//       const formData = new FormData();
//       formData.append("files", file);
//     //   const images = await UploadService.uploadImage(formData);
//       return new Promise((rj) => {
//         rj({
//           urls: {
//             // default: images[0],
//             default: ""
//           },
//         });
//       });
//     });
//   }

//   abort() {}
// }

// function MyCustomUploadAdapterPlugin(editor: any) {
//   editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
//     // Configure the URL to the upload script in your back-end here!
//     return new MyUploadAdapter(loader);
//   };
// }

export default Editor;
