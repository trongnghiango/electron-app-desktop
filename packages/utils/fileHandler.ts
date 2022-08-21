const { readdir, copyFile } = require('fs').promises;
// const { resolve } = require('path');


export const renameAndChangeFileList = async (dirName: string, desDirName:string) => {
  const extName = '3mf';
  let files: any = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await renameAndChangeFileList(`${dirName}/${item.name}`, `${desDirName}`))];
    } else {
      const thenum = dirName.match(/\d+/);
      if (item.name.split('.')[1] === extName) {
        if (thenum) console.log('Step::', thenum[0]);
        console.log('DirPath::', dirName);
        const desFilePath = `${desDirName}/${item.name.split('.')[0]}${thenum ? '-' + thenum : ''}.${extName}`;
        await copyFile(`${dirName}/${item.name}`, desFilePath);
        console.log('File::', item.name);
        console.log('==================END===================\n');
        files.push(desFilePath);
      }
    }
  }
  return files;
};
