const fs=require('fs');
const path=require('path');

const targetPath=path.join(__dirname,'src','configuration','app-config.ts');
const dirPath=path.dirname(targetPath);

if(!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath,{recursive: true});
}

const backendUrl=process.env.BACKEND_URL||'http://localhost:8080';

const configContent=`
export const API_BACKEND_URL = '${backendUrl}';
`;

fs.writeFileSync(targetPath,configContent);
console.log(`Configuration file for the API generated with backend URL : ${backendUrl}`);