import { chromium } from 'playwright-chromium';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root='/tmp/srv2';const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);let f=path.join(root,p);try{if(fs.statSync(f).isDirectory())f=path.join(f,'index.html');}catch{f=path.join(root,'Evals-101/slides/index.html');}fs.readFile(f,(e,d)=>{if(e){fs.readFile(path.join(root,'Evals-101/slides/index.html'),(e2,d2)=>{res.writeHead(200,{'content-type':'text/html'});res.end(d2);});}else{res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});res.end(d);}});});
await new Promise(r=>srv.listen(8097,r));
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const pg=await b.newPage({viewport:{width:980,height:552}});
await pg.route('**/*',(r)=>{r.request().url().includes('localhost')?r.continue():r.abort();});
const num=async()=>pg.evaluate(()=>{const m=location.hash.match(/#\/(\d+)/);return m?+m[1]:0;});
// find total
await pg.goto('http://localhost:8097/Evals-101/slides/#/999',{waitUntil:'domcontentloaded'});await pg.waitForTimeout(900);
const total=await num(); console.log('TOTAL SLIDES:',total);
const bad=[];
for(let n=1;n<=total;n++){
  await pg.goto('http://localhost:8097/Evals-101/slides/#/'+n,{waitUntil:'domcontentloaded'});await pg.waitForTimeout(500);
  let presses=0, cur=n;
  for(let i=0;i<9;i++){ await pg.keyboard.press('ArrowRight'); await pg.waitForTimeout(160); cur=await num(); if(cur!==n){break;} presses++; }
  // presses = number of Rights that stayed on slide n = clicks total for slide n
  const flag = presses>3 ? '  <<< EXCEEDS' : '';
  if(presses>3) bad.push([n,presses]);
  console.log('slide',n,'clicks='+presses+flag);
}
console.log('EXCEEDING 3:',JSON.stringify(bad));
await b.close();srv.close();
