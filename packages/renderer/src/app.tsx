import React, {useState} from 'react';
import {useEffect} from 'react';
import {ipcRenderer, IpcRendererEvent} from 'electron';

export default function App() {
  const [fileList, setFileList] = useState();
  const folderInput = React.useRef(null);

  useEffect(() => {
    if (folderInput) console.log(folderInput.current);
  }, [folderInput.current]);

  const fileChangedHandler = (evt: any) => {
    const {files} = evt.target;

    for (let i = 0; i < files.length; i++) {
      if (files[i].name.includes('Maxillary') || files[i].name.includes('Mandibular')) {
        console.log('File::', files[i]);
      }
    }
  };

  const loadHandler = () => {
    // ipcRenderer.send("showFolderDialog");
  };

  return (
    <div className="p-4 bg-slate-500 text-center flex">
      <div className="form-group row">
        <div className="col-lg-6">
          <label>Select Folder</label>
        </div>
        <div className="col-lg-6">
          <input
            type="file"
            directory=""
            webkitdirectory=""
            className="form-control"
            ref={folderInput}
            onChange={fileChangedHandler}
          />
        </div>
        <button onClick={loadHandler}>Load</button>
      </div>
    </div>
  );
}
// window.addEventListener('DOMContentLoaded', () => {
//   const btn = document.getElementById('folderchooser');

//   if (btn)
//     btn.addEventListener('click', (ev: Event) => {
//       ipcRenderer.send('showFolderDialog');
//     });
// });

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string; // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}
