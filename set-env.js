const fs=require('fs');
const path=require('path');

const targetPath=path.join(__dirname,'src','app','app.backend.ts');
const backendUrl=process.env.BACKEND_URL||'http://localhost:8080';

const configContent=`
/* Do not edit - URL will be managed upon deployment to be overridden with prod URL when needed. */
/* Defaults to the local URL for the dev env. */

export const API_BACKEND_URL = '${backendUrl}';
`;

fs.writeFileSync(targetPath,configContent);
console.log(`Configuration file generated with the following backend URL : ${backendUrl}`);