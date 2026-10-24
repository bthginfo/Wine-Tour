import {PDFDocument,PDFName,PDFString,rgb,pushGraphicsState,popGraphicsState,rectangle,clip,endPath,type PDFFont,type PDFImage,type PDFPage,type RGB} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import shape from '../geo/germany.json';
import iberia from '../geo/iberia.json';
import places from '../geo/places.json';
import type{TastingBook,PdfArticle,TastingNote,ImageCredit}from'./model';

const W=595.28,H=841.89,M=46,CW=W-M*2,BOTTOM=785;
const c=(s:string)=>rgb(parseInt(s.slice(1,3),16)/255,parseInt(s.slice(3,5),16)/255,parseInt(s.slice(5,7),16)/255);
const ink=c('#263c30'),muted=c('#607060'),paper=c('#fbfbf7'),line=c('#dde3d6'),forest=c('#233d30'),lime=c('#dce9c3'),white=rgb(1,1,1),rose=c('#eedbd6'),gold=c('#b18a38');
const tones=[c('#e9d1d0'),c('#f0dad4'),c('#eee2bd'),c('#e4d6dd')];
const tidy=(s:string)=>s.normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/\t/g,'    ');
const segmenter=new Intl.Segmenter('de',{granularity:'grapheme'});
const chars=(s:string)=>Array.from(segmenter.segment(s),x=>x.segment);
type Fonts={regular:PDFFont;bold:PDFFont;heading:PDFFont};
type Glyph={image:PDFImage;ratio:number};
type Picture={image:PDFImage;width:number;height:number};
type Link={page:PDFPage;x:number;top:number;width:number;height:number;target:()=>number};

async function bytes(url:string){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);try{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw Error('Asset '+r.status);return new Uint8Array(await r.arrayBuffer());}finally{clearTimeout(timer);}}
async function picture(url:string,doc:PDFDocument):Promise<Picture>{
 const data=await bytes(url);const bitmap=await createImageBitmap(new Blob([data as BlobPart]));
 try{const scale=Math.min(1,1250/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext('2d')!;ctx.fillStyle='#fbfbf7';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Bild konnte nicht umgewandelt werden.')),'image/jpeg',.86));return{image:await doc.embedJpg(await blob.arrayBuffer()),width:canvas.width,height:canvas.height};}finally{bitmap.close();}
}
class BookLayout{
 page!:PDFPage;y=65;context='';lastArticleWine=-1;pages:{page:PDFPage;context:string;cover:boolean}[]=[];links:Link[]=[];chapterPages=new Map<number,number>();notePages=new Map<number,number>();usedCredits=new Map<string,ImageCredit>();
 constructor(public doc:PDFDocument,public fonts:Fonts,public pictures:Map<string,Picture>,public glyphs:Map<string,Glyph>,public book:TastingBook){}
 rect(x:number,top:number,w:number,h:number,color:RGB,border?:RGB){this.page.drawRectangle({x,y:H-top-h,width:w,height:h,color,borderColor:border,borderWidth:border?.6:0});}
 rule(x:number,top:number,w:number,color=line,thickness=.7){this.page.drawLine({start:{x,y:H-top},end:{x:x+w,y:H-top},color,thickness});}
 circle(x:number,top:number,r:number,color:RGB){this.page.drawCircle({x,y:H-top,size:r,color});}
 width(text:string,size:number,font=this.fonts.regular){let total=0;let run='';for(const char of chars(text)){const glyph=this.glyphs.get(char);if(glyph){if(run)total+=font.widthOfTextAtSize(run,size);run='';total+=glyph.ratio*size;}else run+=char;}return total+(run?font.widthOfTextAtSize(run,size):0);}
 text(text:string,x:number,top:number,size=10.7,font=this.fonts.regular,color=ink){text=tidy(text);let run='';let cursor=x;const flush=()=>{if(run){this.page.drawText(run,{x:cursor,y:H-top-size,font,size,color});cursor+=font.widthOfTextAtSize(run,size);run='';}};for(const char of chars(text)){const glyph=this.glyphs.get(char);if(glyph){flush();this.page.drawImage(glyph.image,{x:cursor,y:H-top-size*1.1,width:glyph.ratio*size,height:size*1.25});cursor+=glyph.ratio*size;}else run+=char;}flush();}
 wrap(text:string,size:number,width:number,font=this.fonts.regular){const lines:string[]=[];for(const para of tidy(text).split('\n')){let current='';for(const word of para.split(/\s+/).filter(Boolean)){const candidate=current?current+' '+word:word;if(this.width(candidate,size,font)<=width){current=candidate;continue;}if(current){lines.push(current);current='';}if(this.width(word,size,font)<=width){current=word;continue;}for(const char of chars(word)){if(current&&this.width(current+char,size,font)>width){lines.push(current);current='';}current+=char;}}lines.push(current);}return lines;}
 newPage(context=this.context,cover=false){if(this.pages.length>=250)throw Error('Diese PDF ist zu umfangreich. Kürze bitte sehr lange Artikeltexte.');this.context=context;this.page=this.doc.addPage([W,H]);this.pages.push({page:this.page,context,cover});this.rect(0,0,W,H,paper);this.y=65;if(!cover){this.text('sip happens.',M,28,9,this.fonts.heading);const label=this.wrap(context,7.6,350,this.fonts.regular)[0];this.text(label,W-M-this.width(label,7.6),30,7.6,this.fonts.regular,muted);this.rule(M,49,CW);}return this.page;}
 ensure(height:number){if(this.y+height>BOTTOM){this.newPage();this.text('FORTSETZUNG',M,this.y,8,this.fonts.bold,muted);this.y+=25;}}
 paragraph(text:string,size=10.2,gap=7,color=ink){const lines=this.wrap(text,size,CW);const leading=size*1.4;for(const lineText of lines){this.ensure(leading);this.text(lineText,M,this.y,size,this.fonts.regular,color);this.y+=leading;}this.y+=gap;}
 heading(text:string,size=14){const lines=this.wrap(text,size,CW,this.fonts.heading);this.ensure(lines.length*size*1.3+42);for(const l of lines){this.text(l,M,this.y,size,this.fonts.heading);this.y+=size*1.3;}this.y+=6;}
 title(text:string,size=30){const lines=this.wrap(text,size,CW,this.fonts.heading);for(const l of lines){this.ensure(size*1.23);this.text(l,M,this.y,size,this.fonts.heading);this.y+=size*1.23;}this.y+=11;}
 eyebrow(text:string,gap=22){this.text(text.toLocaleUpperCase('de-DE'),M,this.y,8.1,this.fonts.bold,muted);this.y+=gap;}
 image(url:string,x:number,top:number,w:number,h:number,fit='cover',position='center center',credit?:ImageCredit){const pic=this.pictures.get(url);if(!pic)return false;const scale=fit==='contain'?Math.min(w/pic.width,h/pic.height):Math.max(w/pic.width,h/pic.height);const iw=pic.width*scale,ih=pic.height*scale;const px=position.includes('left')?0:position.includes('right')?1:.5;const py=position.includes('top')?0:position.includes('bottom')?1:.5;this.page.pushOperators(pushGraphicsState(),rectangle(x,H-top-h,w,h),clip(),endPath());this.page.drawImage(pic.image,{x:x+(w-iw)*px,y:H-top-h+(h-ih)*(1-py),width:iw,height:ih});this.page.pushOperators(popGraphicsState());if(credit)this.usedCredits.set(url,credit);return true;}
 glass(x:number,top:number,size:number,color:RGB,bubbles=0){this.page.drawSvgPath('M8 0 C5 20 4 34 23 39 C42 34 41 20 38 0 Z',{x,y:H-top,scale:size/46,borderColor:muted,borderWidth:.8});this.page.drawSvgPath('M8 18 C7 28 10 36 23 38 C36 35 39 28 38 18 Z',{x,y:H-top,scale:size/46,color});this.page.drawLine({start:{x:x+size/2,y:H-top-size*.85},end:{x:x+size/2,y:H-top-size*1.32},color:muted,thickness:.7});this.rule(x+size*.23,top+size*1.34,size*.54,muted,.7);for(let i=0;i<bubbles;i++)this.circle(x+size*(.31+(i%3)*.15),top+size*(.46+Math.floor(i/3)*.13),1,white);}
 star(x:number,top:number,filled:boolean){const points=Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?3.4:7.4;return`${7.5+Math.cos(a)*r},${7.5+Math.sin(a)*r}`;});this.page.drawSvgPath('M'+points.join(' L')+' Z',{x,y:H-top,color:filled?gold:line});}
 map(slug:string,x:number,top:number,w:number,h:number){if(slug==='jumilla'){const scale=Math.min(w/280,(h-16)/230),left=x+(w-280*scale)/2;for(const [path,color]of[[iberia.portugal,'#e4e8dc'],[iberia.spain,'#d7e0ce']])this.page.drawSvgPath(path,{x:left,y:H-top,scale,color:c(color)});const px=left+iberia.point.x*scale,py=top+iberia.point.y*scale;this.circle(px,py,4,rose);this.circle(px,py,1.9,forest);this.text('Jumilla · Spanien',x+(w-this.width('Jumilla · Spanien',8,this.fonts.bold))/2,top+h-13,8,this.fonts.bold);return;}const place=places[slug as keyof typeof places];if(!place)return;const scale=Math.min(w/280,(h-16)/335);this.page.drawSvgPath(shape.path,{x:x+(w-280*scale)/2,y:H-top,scale,color:c('#d7e0ce')});const px=x+(w-280*scale)/2+(place.lon-5.5)*24*scale,py=top+(55.5-place.lat)*38*scale;this.circle(px,py,5.5,rose);this.circle(px,py,2.4,forest);const tw=this.width(place.town,8,this.fonts.bold);this.text(place.town,x+(w-tw)/2,top+h-13,8,this.fonts.bold);}
 visual(a:PdfArticle){if(a.scene){if(this.pictures.has(a.image)){this.ensure(119);this.image(a.image,M,this.y,CW,108,a.imageFit||'cover',a.imagePosition,a.credit);this.y+=119;}this.learningScene(a.scene);return;}const pic=this.pictures.get(a.image);const kind=a.visual;const height=['bubbles','aromas','balance','closures','rose-compare'].includes(kind||'')?124:108;this.ensure(height+21);const y=this.y;
  if(kind==='region'){this.rect(M,y,CW,height,c('#eef2e7'));if(pic)this.image(a.image,M,y,CW-145,height,a.imageFit||'cover',a.imagePosition,a.credit);else{this.text(a.slug==='jumilla'?'LAGE IN SPANIEN':'LAGE IN DEUTSCHLAND',M+20,y+25,8,this.fonts.bold,muted);this.text(a.title,M+20,y+45,25,this.fonts.heading);this.text('Ein Ort als Bezugspunkt,',M+20,y+86,9,this.fonts.regular,muted);this.text('keine Grenze des Anbaugebiets.',M+20,y+101,9,this.fonts.regular,muted);}this.map(a.slug,M+CW-135,y+7,125,height-14);
  }else if(pic&&(kind==='producer'||!kind||kind==='none')){const portrait=pic.height>pic.width;this.rect(M,y,CW,height,c('#edf0e7'));const featured=this.book.wines.find(w=>w.slugs.includes(a.slug));if(portrait&&featured){this.image(a.image,M,y,172,height,'cover',a.imagePosition,a.credit);this.image(featured.bottleImage||'',M+190,y+8,46,height-16,'contain','center',{text:featured.bottleCredit||featured.producer,url:featured.bottleSource});this.text('UNSER WEIN',M+253,y+16,7.2,this.fonts.bold,muted);this.wrap(featured.name,14,CW-272,this.fonts.heading).forEach((l,i)=>this.text(l,M+253,y+35+i*18,14,this.fonts.heading));this.wrap(featured.style,8.8,CW-272).forEach((l,i)=>this.text(l,M+253,y+84+i*12,8.8,this.fonts.regular,muted));}else this.image(a.image,M,y,CW,height,a.imageFit||'cover',a.imagePosition,a.credit);
  }else if(pic){this.image(a.image,M,y,145,height,'cover',a.imagePosition,a.credit);this.diagram(kind||'skins',M+160,y,CW-160,height);}
  else if(kind&&kind!=='none')this.diagram(a.slug==='mourvedre-monastrell'?'monastrell':a.slug==='rotwein'?'red-wine':kind,M,y,CW,height);else return;
  this.y+=height+11;
 }
 learningScene(scene:NonNullable<PdfArticle['scene']>){
  this.ensure(160);this.eyebrow(scene.eyebrow,18);this.heading(scene.title,15);
  const top=this.y,cell=CW/scene.items.length;
  this.rect(M,top,CW,82,c('#eef2e7'));
  for(const [i,item] of scene.items.entries()){
   const x=M+(i+.5)*cell,cy=top+31;
   if(scene.kind==='riesling-season'){
    this.page.drawLine({start:{x,y:H-cy-18},end:{x,y:H-cy+15},color:c('#94745e'),thickness:2});
    if(i===0){this.circle(x-4,cy-9,5,c('#a8b58a'));this.circle(x+4,cy-9,5,c('#8da176'));}
    else for(const [dx,dy]of[[-6,-7],[6,-7],[0,5]])this.circle(x+dx,cy+dy,i===1?2.5:6,i===1?gold:i===2?c('#91a776'):c('#c3bd79'));
   }else if(scene.kind==='rose-methods'){
    this.rect(x-18,cy-17,36,33,c('#edddd9'),muted);this.rect(x-16,cy,32,14,c('#d6a09d'));if(i===0){this.rule(x-23,cy-23,46,muted,1.4);this.rule(x-20,cy-8,40,muted,1.4);}else if(i===1){for(const dx of[-10,0,10])this.circle(x+dx,cy-4,3,c('#8d596b'));}else{this.rule(x+18,cy+2,16,c('#d6a09d'),2);this.rect(x+30,cy+2,3,15,c('#d6a09d'));}
   }else if(scene.kind==='sekt-bottle'){
    this.rect(x-13,cy-8,26,31,c('#d9cb99'),muted);this.rect(x-5,cy-25,10,17,c('#d9cb99'),muted);
    if(i===1)for(const[dx,dy]of[[-5,0],[5,8],[0,-8]])this.circle(x+dx,cy+dy,1.3,white);
    if(i===2)this.rect(x-11,cy+17,22,4,c('#a6946d'));if(i===3)this.circle(x,cy-32,2.5,c('#a6946d'));
   }else if(scene.kind==='champagne-blend'){
    this.circle(x,cy,15,[c('#9d6e80'),c('#8a9d7b'),c('#d3bc82')][i]);this.text(String(i+1),x-3,cy-6,10,this.fonts.bold,white);
   }else if(scene.kind==='cava-age'){
    const months=String(item.months);this.text(months,x-this.width(months,23,this.fonts.heading)/2,cy-19,23,this.fonts.heading);this.text('Monate',x-this.width('Monate',7.5)/2,cy+10,7.5,this.fonts.regular,muted);
   }else if(scene.kind==='port-styles'){
    if(i===1||i===3){this.rect(x-15,cy-18,30,35,i===1?c('#b78b68'):c('#8e6674'));this.rule(x-15,cy-7,30,white);this.rule(x-15,cy+7,30,white);}else{this.rect(x-10,cy-10,20,29,c('#874354'));this.rect(x-4,cy-23,8,13,c('#874354'));this.rect(x-8,cy-2,16,12,white);}
   }else this.glass(x-13,cy-20,26,c(scene.color||'#b18a38'));
   const labels=this.wrap(item.label,8.1,cell-12,this.fonts.bold);for(const [n,label]of labels.entries())this.text(label,x-this.width(label,8.1,this.fonts.bold)/2,top+59+n*10,8.1,this.fonts.bold);
  }
  this.y+=94;
  const gap=12,column=(CW-gap)/2,pad=14;
  for(let i=0;i<scene.items.length;i+=2){
   const row=scene.items.slice(i,i+2).map(item=>({title:this.wrap(item.title,10,column-pad*2,this.fonts.heading),body:this.wrap(item.body,9,column-pad*2)}));
   const height=Math.max(...row.map(item=>item.title.length*14+8+item.body.length*12.6))+pad*2;
   this.ensure(height+8);const y=this.y;
   row.forEach((item,j)=>{const x=M+j*(column+gap);this.rect(x,y,column,height,c('#f0f2eb'));let ty=y+pad;for(const title of item.title){this.text(title,x+pad,ty,10,this.fonts.heading);ty+=14;}ty+=8;for(const text of item.body){this.text(text,x+pad,ty,9);ty+=12.6;}});this.y+=height+9;
  }
  this.paragraph(scene.caption,8.5,14,muted);
 }
 diagram(kind:string,x:number,y:number,w:number,h:number){this.rect(x,y,w,h,c('#eef2e7'));const pad=16;
  if(kind==='monastrell'){
   const cell=w/3;for(let i=0;i<3;i++){const cx=x+cell*(i+.5);if(i===0){this.circle(cx,y+35,22,c('#795068'));this.circle(cx,y+35,15,c('#e8d9bf'));for(const dx of[-4,4])this.circle(cx+dx,y+37,2.5,c('#92725b'));}else if(i===1){this.circle(cx,y+35,16,c('#dec178'));for(let n=0;n<8;n++){const a=n*Math.PI/4;this.page.drawLine({start:{x:cx+Math.cos(a)*21,y:H-y-35-Math.sin(a)*21},end:{x:cx+Math.cos(a)*26,y:H-y-35-Math.sin(a)*26},color:c('#a98f50'),thickness:1});}}else{for(const [dx,dy]of[[-9,-6],[9,-6],[0,9]])this.circle(cx+dx,y+35+dy,10,c('#795068'));}const label=['Dunkle Schale','Späte Reife','Duftvergleiche'][i],detail=['Farbe und Gerbstoffe','Lange, warme Saison','Beeren · Pflaume · Würze'][i];this.text(label,cx-this.width(label,9,this.fonts.bold)/2,y+72,9,this.fonts.bold);for(const[l,n]of this.wrap(detail,7.8,cell-12).map((l,n)=>[l,n]as const))this.text(l,cx-this.width(l,7.8)/2,y+91+n*10,7.8,this.fonts.regular,muted);}
  }else if(kind==='red-wine'){
   const stages=[['01','Maischegärung','Farbe und Gerbstoffe aus den Schalen.'],['02','Eichenfass','Unser Juan Gil: rund zwölf Monate Reife.'],['03','Im Glas','Frucht riechen, Gerbstoffe fühlen.']];stages.forEach(([n,title,body],i)=>{const left=x+pad+i*(w-2*pad)/3;this.text(n,left,y+15,8,this.fonts.bold,muted);this.text(title,left,y+37,12,this.fonts.heading);this.wrap(body,8.1,(w-2*pad)/3-12).forEach((l,j)=>this.text(l,left,y+62+j*12,8.1,this.fonts.regular,muted));});
  }else if(kind==='skins'||kind==='bubbles'||kind==='pinot'){
   const labels=kind==='bubbles'?['Stillwein','Secco','Sekt']:kind==='pinot'?['Spätburgunder','Grauburgunder','Weißburgunder']:['Hell','Rosé','Rot'];
   const detail=kind==='bubbles'?['Ohne Perlwein-Druck','1–2,5 bar','Ab 3,5 bar']:kind==='pinot'?['Pinot Noir','Pinot Gris / Grigio','Pinot Blanc / Bianco']:['Früh pressen','Kurzer Schalenkontakt','Mit Schalen gären'];
   const colors=kind==='skins'?[c('#dfd59d'),c('#d9a09a'),c('#8b4960')]:kind==='pinot'?[c('#745268'),c('#c69c9d'),c('#c9d298')]:[c('#dfd59d'),c('#d9a09a'),c('#dfd59d')];
   for(let i=0;i<3;i++){const cell=w/3,cx=x+cell*(i+.5);if(kind==='pinot'){for(const [dx,dy]of[[-8,0],[8,0],[0,14]])this.circle(cx+dx,y+35+dy,9,colors[i]);}else this.glass(cx-17,y+14,34,colors[i],kind==='bubbles'?i*3:0);this.text(labels[i],cx-this.width(labels[i],9,this.fonts.bold)/2,y+75,9,this.fonts.bold);const lines=this.wrap(detail[i],7.8,cell-12);lines.forEach((l,n)=>this.text(l,cx-this.width(l,7.8)/2,y+94+n*10,7.8,this.fonts.regular,muted));}
   if(kind==='bubbles')this.text('Überdruck bei 20 °C · vereinfachter Vergleich',x+pad,y+h-14,6.8,this.fonts.regular,muted);
  }else if(kind==='rose-compare'){
   for(let i=0;i<2;i++){const cell=w/2,left=x+i*cell;this.glass(left+16,y+19,35,c('#d9a09a'),i===0?5:0);const name=i===0?'Secco Rosé':'JUWEL Rosé';const detail=i===0?'Perlwein · halbtrocken':'Stillwein · trocken';this.text(name,left+68,y+25,11,this.fonts.heading);this.wrap(detail,8.2,cell-78).forEach((l,n)=>this.text(l,left+68,y+46+n*12,8.2,this.fonts.regular,muted));}
   this.text('Beide aus Spätburgunder · Farbe und Süße getrennt betrachten',x+pad,y+101,8,this.fonts.regular,muted);
  }else if(kind==='aromas'){
   const families=[['Zitrus','Zitrone · Grapefruit · Limette'],['Helle Frucht','Apfel · Birne · Pfirsich'],['Rote Frucht','Erdbeere · Kirsche · Himbeere'],['Blüten','Rose · Akazie · Holunderblüte'],['Kräuter','Gras · Heu · Kräuter'],['Würze','Pfeffer · Vanille · Nelke']];
   families.forEach(([name,words],i)=>{const left=x+pad+(i%2)*(w/2),top=y+13+Math.floor(i/2)*38;this.circle(left+3,top+6,3,i===2?c('#c2898b'):forest);this.text(name,left+13,top,9,this.fonts.bold);this.text(words,left+13,top+15,7.4,this.fonts.regular,muted);});
  }else if(kind==='balance'){
   for(let i=0;i<2;i++){const left=x+pad+i*w/2;this.text(i===0?'Mehr Säure':'Weniger Säure',left,y+15,10,this.fonts.bold);this.text('Restzucker',left,y+42,8,this.fonts.regular,muted);this.rect(left+65,y+44,w/2-100,6,c('#d8c591'));this.text('Säure',left,y+63,8,this.fonts.regular,muted);this.rect(left+65,y+65,(w/2-100)*(i===0?1:.4),6,c('#8da57f'));}this.text('Gleiche Süße kann anders wirken. Schema ohne Messwerte.',x+pad,y+105,8.2,this.fonts.regular,muted);
  }else if(kind==='closures'){
   this.rect(x+23,y+28,25,60,c('#c1a27d'));for(let i=0;i<4;i++)this.rule(x+29,y+39+i*12,12,c('#806749'),1);this.text('Naturkork',x+65,y+36,12,this.fonts.heading);this.text('Rinde der Korkeiche',x+65,y+58,8.6,this.fonts.regular,muted);this.rect(x+w/2+15,y+37,33,48,c('#93a389'));for(let i=0;i<3;i++)this.rule(x+w/2+17,y+57+i*9,29,forest,.7);this.text('Schrauber',x+w/2+65,y+36,12,this.fonts.heading);this.text('Einfach wieder verschließen',x+w/2+65,y+58,8.1,this.fonts.regular,muted);this.text('Der Verschluss allein sagt nichts über die Qualität des Weins.',x+pad,y+108,8.2,this.fonts.regular,muted);
  }else{
   const stages=[['01','Pressen','Aus Trauben wird Most.'],['02','Gären','Hefe wandelt Zucker um.'],['03','Ausbauen','Der Wein entwickelt sich.']];stages.forEach(([n,title,body],i)=>{const left=x+pad+i*(w-2*pad)/3;this.text(n,left,y+17,8,this.fonts.bold,muted);this.text(title,left,y+39,13,this.fonts.heading);this.wrap(body,8.1,(w-2*pad)/3-12).forEach((l,j)=>this.text(l,left,y+66+j*12,8.1,this.fonts.regular,muted));});
  }
 }
 profile(facts:NonNullable<PdfArticle['profile']>){
  const gap=12,cell=(CW-gap)/2,pad=14,inner=cell-pad*2;
  for(let index=0;index<facts.length;index+=2){
   const row=facts.slice(index,index+2).map(fact=>({label:this.wrap(fact.label,8,inner,this.fonts.bold),value:this.wrap(fact.value,9.3,inner)}));
   const height=Math.max(...row.map(item=>item.label.length*11+6+item.value.length*13))+pad*2;
   this.ensure(height+(index===0?23:0)+8);if(index===0)this.eyebrow('AUF EINEN BLICK',18);
   const top=this.y;row.forEach((item,column)=>{const x=M+column*(cell+gap);this.rect(x,top,cell,height,c('#eef2e7'));let y=top+pad;for(const text of item.label){this.text(text,x+pad,y,8,this.fonts.bold,muted);y+=11;}y+=6;for(const text of item.value){this.text(text,x+pad,y,9.3);y+=13;}});
   this.y+=height+7;
  }
  this.y+=8;
 }
 fact(text:string){if(!text)return;const lines=this.wrap(text,9.3,CW-32);const height=36+lines.length*13;this.ensure(height+5);this.rect(M,this.y,CW,height,lime);this.text('GUT ZU WISSEN',M+16,this.y+11,7.4,this.fonts.bold,muted);lines.forEach((l,i)=>this.text(l,M+16,this.y+27+i*13,9.3));this.y+=height+14;}
 cover(){this.newPage('',true);this.rect(0,0,W,365,forest);this.text('sip happens.',M,37,15,this.fonts.heading,white);this.text('DEIN PERSÖNLICHES TASTING-HEFT',M,107,8.2,this.fonts.bold,lime);this.text('Dein',M,146,59,this.fonts.heading,white);this.text('Weinabend.',M,214,59,this.fonts.heading,lime);this.text('Die Weine. Das Wissen. Deine Eindrücke.',M,309,11.5,this.fonts.regular,c('#d0dcc8'));
  const photo=this.book.entries.find(e=>e.type==='article'&&e.article.slug==='pfalz');if(photo?.type==='article'&&this.pictures.has(photo.article.image))this.image(photo.article.image,0,365,W,218,'cover',photo.article.imagePosition,photo.article.credit);else{this.rect(0,365,W,218,lime);for(let i=0;i<3;i++)this.glass(115+i*140,397,55,tones[i],i===0?3:0);}
  this.y=616;this.eyebrow('FÜR '+this.book.participant);let titleSize=25;while(this.wrap(this.book.name,titleSize,CW,this.fonts.heading).length*titleSize*1.23>64)titleSize--;this.title(this.book.name,titleSize);this.paragraph('Vier Weine, ihre Herkunft und deine persönlichen Notizen. In der Reihenfolge unserer Weinprobe.',11,9,muted);this.text('Exportiert am '+new Intl.DateTimeFormat('de-DE',{day:'numeric',month:'long',year:'numeric'}).format(new Date(this.book.exportedAt)),M,758,8.3,this.fonts.regular,muted);
 }
 overview(){
  this.newPage('Die Weinfolge');this.eyebrow('UNSER ABEND IM ÜBERBLICK');this.title('Was im Glas war.');this.paragraph('Die Kapitel folgen unserer Weinprobe. Deine Notizen findest du jeweils direkt beim Wein.',11,22,muted);
  this.book.wines.forEach((wine,i)=>{
   const titles=this.wrap(wine.name,17,CW-133,this.fonts.heading);
   const producers=this.wrap(wine.producer,9.1,CW-133);
   const infos=this.wrap([wine.region,wine.grape,wine.style,wine.vintage].filter(Boolean).join(' · '),8.6,CW-133);
   const height=Math.max(132,47+titles.length*21+producers.length*13+infos.length*12.5);
   this.ensure(height+12);const top=this.y;this.rect(M,top,CW,height,tones[i]);this.text('0'+(i+1),M+14,top+13,11,this.fonts.heading);
   const shown=this.image(wine.bottleImage||'',M+37,top+(height-107)/2,53,107,'contain','center',{text:wine.bottleCredit||wine.producer,url:wine.bottleSource});if(!shown)this.glass(M+47,top+28,30,c('#94536c'));
   const x=M+108;let ty=top+14;for(const l of titles){this.text(l,x,ty,17,this.fonts.heading);ty+=21;}ty+=5;
   for(const l of producers){this.text(l,x,ty,9.1);ty+=13;}ty+=4;
   for(const l of infos){this.text(l,x,ty,8.6,this.fonts.regular,muted);ty+=12.5;}
   const own=this.book.entries.find(e=>e.type==='notes'&&e.wine===i);const label=own?.type==='notes'&&own.note.rating?`Deine Bewertung: ${own.note.rating} / 5`:'Deine Notizen beim Wein';this.text(label,x,top+height-25,8.2,this.fonts.bold,muted);
   this.links.push({page:this.page,x:M,top,width:CW,height,target:()=>this.chapterPages.get(i)??0});this.y=top+height+13;
  });
 }

 landscape(profile:NonNullable<PdfArticle['landscape']>,slug:string){
  const scale=CW/600,gap=15,cell=(CW-gap*2)/3;
  const textHeight=Math.max(...profile.parts.map(p=>this.wrap(p.title,9.1,cell,this.fonts.bold).length*13+this.wrap(p.body,8.5,cell).length*12));
  this.ensure(270+textHeight);this.heading(profile.title,13);const top=this.y;
  this.rect(M,top,CW,205*scale,c('#eef2e7'));
  const path=(d:string,color:string,stroke?:string,width=1)=>this.page.drawSvgPath(d,{x:M,y:H-top,scale,...(color?{color:c(color)}:{}),...(stroke?{borderColor:c(stroke),borderWidth:width}:{})});
  if(slug==='rheinhessen'){
   path('M32 99Q150 64 265 98V182H32Z','#c9b389');path('M335 98Q454 60 568 98V182H335Z','#abb09b');
   path('M145 101V60m0 16q-21-20-34-7 14 18 34 12m0-8q20-23 34-11-10 20-34 19M451 98V57m0 15q-22-18-34-5 13 15 34 12m0-10q21-22 34-9-11 20-34 20M145 103v49m0-30-24 23m24-9 21 20m285-55v51m0-29-23 20m23-8 24 20','','#607060',2);
   for(const[x,y]of[[67,120],[96,151],[199,130],[231,161],[178,170],[217,111],[45,164],[110,115],[82,173]])this.circle(M+x*scale,top+y*scale,2*scale,c('#8b754e'));
   for(const[x,y]of[[362,122],[403,156],[493,129],[540,158],[481,169],[529,112],[351,167],[417,114],[380,176]])path(`M${x},${y}l12-5 8 8-10 5Z`,'#e3e3cd');
   this.text('Löss',M+130*scale,top+28*scale,9,this.fonts.bold);this.text('Kalkmergel',M+414*scale,top+27*scale,9,this.fonts.bold);
  }else{
   path(slug==='pfalz'?'M0 106Q38 60 72 81Q111 18 164 77Q203 38 247 101L600 165V205H0Z':'M0 166L147 135L287 39Q307 29 324 51L471 172H600V205H0Z','#bac5aa');
   path(slug==='pfalz'?'M0 172Q123 116 257 116Q350 116 433 166H600V205H0Z':'M0 183L137 162L296 71L464 188H600V205H0Z','#d6ddc6');
   if(slug==='pfalz'){
    for(const[x,y]of[[54,96],[83,85],[113,74],[143,88],[173,81]])path(`M${x},${y+36}v-32m-14 20 14-29 14 29Z`,'#8c9d7b','#607060');
    path('M499 160q-28 12 1 20t-8 25','','#7aacae',15);this.text('Rhein',M+480*scale,top+132*scale,8,this.fonts.bold);
   }else{this.circle(M+499*scale,top+45*scale,19*scale,c('#e4c67c'));path('M425 197q70-18 175-4','','#7aacae',15);path('m301 130 22 11m-34 5 22 11m16-3 22 11m-30 5 22 11','','#82907b',2);}
   for(const[x,y]of(slug==='pfalz'?[[226,132],[254,135],[282,139],[310,145],[338,151],[366,158]]:[[318,90],[342,111],[365,134],[389,155],[410,174]]))path(`M${x},${y+15}v-19m0 5q-10-7-13 1m13-2q8-9 12-1`,'','#405c46',1.7);
  }
  this.y=top+205*scale+13;const row=this.y;
  profile.parts.forEach((part,i)=>{const x=M+i*(cell+gap);this.text('0'+(i+1),x,row,7.5,this.fonts.bold,muted);let y=row+15;for(const l of this.wrap(part.title,9.1,cell,this.fonts.bold)){this.text(l,x,y,9.1,this.fonts.bold);y+=13;}y+=4;for(const l of this.wrap(part.body,8.5,cell)){this.text(l,x,y,8.5,this.fonts.regular,muted);y+=12;}});
  this.y=row+textHeight+29;this.paragraph(profile.caption,7.5,15,muted);
 }
 companion(story:NonNullable<PdfArticle['companion']>){
  const photoW=182,textX=M+photoW+24,textW=CW-photoW-24,photoH=218;
  const blocks=story.milestones.map(m=>({m,title:this.wrap(m.title,9.7,textW,this.fonts.bold),body:this.wrap(m.body,9.1,textW)}));
  const timelineH=blocks.reduce((n,b)=>n+14+b.title.length*13+4+b.body.length*12.6+16,0);
  const height=Math.max(photoH,timelineH),captionH=this.wrap(story.caption,8.2,CW).length*11.7;
  this.ensure(35+height+captionH+20);this.heading(story.title,13);const top=this.y;
  this.image(story.image,M,top,photoW,photoH,'contain','center top',story.credit);
  let cursor=top;
  for(const b of blocks){this.text(b.m.year,textX,cursor,8.1,this.fonts.bold,muted);cursor+=14;for(const l of b.title){this.text(l,textX,cursor,9.7,this.fonts.bold);cursor+=13;}cursor+=4;for(const l of b.body){this.text(l,textX,cursor,9.1,this.fonts.regular,muted);cursor+=12.6;}cursor+=16;}
  this.y=top+height+9;this.paragraph(story.caption,8.2,15,muted);
 }
 additionalInfo(sections:NonNullable<PdfArticle['additionalInfo']>){
  this.ensure(105);this.y+=12;this.rule(M,this.y,CW);this.y+=17;this.eyebrow('Zusatzinfos',23);
  for(const section of sections){this.ensure(75);if(section.title)this.heading(section.title,12.1);for(const paragraph of section.body.split(/\n\s*\n/).filter(Boolean))this.paragraph(paragraph);}
  this.y+=10;
 }
 article(a:PdfArticle,wineIndex:number,interlude:boolean){const wine=this.book.wines[wineIndex];const continuePage=!interlude&&this.lastArticleWine===wineIndex&&this.y<350;if(continuePage){this.y+=24;this.rule(M,this.y,CW);this.y+=28;}else this.newPage(interlude?'Weinwissen zwischendurch':`0${wineIndex+1} · ${wine.name}`);this.lastArticleWine=interlude?-1:wineIndex;if(!interlude&&!this.chapterPages.has(wineIndex))this.chapterPages.set(wineIndex,this.pages.length-1);this.rect(0,this.y,5,65,interlude?lime:tones[wineIndex]);this.eyebrow(a.label,17);this.title(a.title,26);this.paragraph(a.intro,10.6,10,muted);this.visual(a);if(a.profile)this.profile(a.profile);for(const p of a.paragraphs)this.paragraph(p);if(a.landscape)this.landscape(a.landscape,a.slug);if(a.companion)this.companion(a.companion);for(const [i,section] of (a.sections||[]).entries()){if(i===(a.sections?.length||0)-1){const sectionHeight=this.wrap(section.title,12.1,CW,this.fonts.heading).length*15.73+6+this.wrap(section.body,10.2,CW).length*14.28+7;const factHeight=a.fact?36+this.wrap(a.fact,9.3,CW-32).length*13:0;if(sectionHeight+factHeight<600)this.ensure(sectionHeight+factHeight+5);}this.heading(section.title,12.1);this.paragraph(section.body);}this.fact(a.fact);if(a.additionalInfo?.length)this.additionalInfo(a.additionalInfo);}
 pending(wineIndex:number,sections:{title:string;body:string}[]){const wine=this.book.wines[wineIndex];this.newPage(`0${wineIndex+1} · ${wine.name}`);this.chapterPages.set(wineIndex,this.pages.length-1);this.eyebrow('UNSER VIERTER WEIN');this.title(wine.name);const defined=wine.name!=='Rotwein'||wine.producer!=='Die Flasche wird noch ausgewählt'||sections.length>0;this.paragraph(defined?[wine.producer,wine.region,wine.grape,wine.vintage].filter(x=>x&&x!=='Noch offen').join(' · '):'Die Flasche steht noch nicht fest. Hier bleiben die Angaben offen, bis sie für das Tasting ergänzt wurden.',11.5,25,muted);this.rect(M,this.y,CW,115,tones[3]);this.glass(M+25,this.y+17,45,c('#91526b'));this.text('Das rote Finale',M+105,this.y+32,22,this.fonts.heading);this.text('Region → Weingut → Rebsorte → Weinart',M+105,this.y+70,9,this.fonts.regular,muted);this.y+=144;for(const s of sections){this.heading(s.title);this.paragraph(s.body);}if(!sections.length)this.paragraph('Die allgemeinen Inhalte zur Rotweinbereitung und deine persönlichen Notizen findest du auf den nächsten Seiten.',11,10,muted);}
 notes(wineIndex:number,note:TastingNote){const wine=this.book.wines[wineIndex];this.newPage(`0${wineIndex+1} · Deine Verkostung`);this.notePages.set(wineIndex,this.pages.length-1);this.eyebrow('DEINE VERKOSTUNG · 0'+(wineIndex+1));this.title(wine.name,28);this.paragraph([wine.producer,wine.vintage].filter(Boolean).join(' · '),10.7,12,muted);if(wine.hint)this.paragraph(wine.hint,10.2,20,muted);const top=this.y;this.rect(M,top,CW,139,tones[wineIndex]);this.text('DEIN GESAMTEINDRUCK',M+18,top+15,8,this.fonts.bold,muted);for(let i=0;i<5;i++)this.star(M+18+i*23,top+36,i<note.rating);this.text(note.rating?`${note.rating} von 5`:'Noch nicht bewertet',M+153,top+36,10,this.fonts.bold);
  for(const [label,value,i]of[['Süße',note.sweetness,0],['Säure',note.acidity,1]]as const){const left=M+18+i*CW/2;this.text(label,left,top+77,9,this.fonts.bold);this.text(value?`${value} / 5`:'Nicht eingeschätzt',left+57,top+77,8.5,this.fonts.regular,muted);for(let n=0;n<5;n++)this.rect(left+n*30,top+101,24,5,n<value?forest:white);}this.text('1 = wenig · 5 = deutlich',M+18,top+119,7.1,this.fonts.regular,muted);this.y=top+162;
  this.heading('Deine Aromen',14);this.paragraph(note.aromas.length?note.aromas.join(' · '):'Keine Aromen ausgewählt.',11,23,note.aromas.length?ink:muted);this.heading('Deine Worte',17);if(note.text.trim())this.paragraph(note.text,11.5,20);else{this.paragraph('Zu diesem Wein hast du keine Notiz festgehalten.',11,26,muted);for(let n=0;n<6;n++){this.ensure(28);this.rule(M,this.y,CW);this.y+=28;}}this.y+=8;this.ensure(45);this.rule(M,this.y,CW);this.y+=14;this.paragraph('Dein persönlicher Eindruck. Die Skalen beschreiben deine Wahrnehmung, keine gemessenen Analysewerte.',8.7,0,muted);
 }
 credits(){this.newPage('Bildnachweise');this.eyebrow('FOTOGRAFIE & GESTALTUNG');this.title('Die Bilder im Heft.',25);this.paragraph('Die Produktfotos zeigen die Flaschen der Weingüter. Etikett und Jahrgang können von der ausgeschenkten Flasche abweichen.',9.5,23,muted);
  for(const credit of this.usedCredits.values()){this.ensure(65);this.paragraph(credit.text,9.2,5);if(credit.url){this.externalLink('Originalbild & Nutzungsangaben',credit.url);const match=credit.text.match(/CC BY-SA ([0-9.]+)/);if(match)this.externalLink('Lizenz: Creative Commons BY-SA '+match[1],'https://creativecommons.org/licenses/by-sa/'+match[1]+'/');}this.y+=7;}
  this.paragraph('Fotos teilweise verkleinert oder als Ausschnitt. Kartengrundlage: Natural Earth, Public Domain. Ortskoordinaten: © OpenStreetMap-Mitwirkende. Erklärgrafiken: eigene schematische Vektorgrafiken.',8.5,8,muted);this.externalLink('OpenStreetMap · Nutzungsangaben','https://www.openstreetmap.org/copyright');
 }
 externalLink(label:string,url:string){this.ensure(17);this.text(label,M,this.y,7.8,this.fonts.regular,muted);const annotation=this.doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[M,H-this.y-12,M+this.width(label,7.8),H-this.y],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url)}});this.page.node.addAnnot(this.doc.context.register(annotation));this.y+=13;}
 finish(){const count=this.pages.length;for(let i=0;i<count;i++){const{page}=this.pages[i];this.page=page;this.rule(M,802,CW);this.text('SIP HAPPENS · DEINE WEINPROBE',M,813,6.8,this.fonts.bold,muted);const n=String(i+1).padStart(2,'0')+' / '+String(count).padStart(2,'0');this.text(n,W-M-this.width(n,7.4),812,7.4,this.fonts.regular,muted);}
  for(const l of this.links){const target=this.pages[l.target()]?.page;if(!target)continue;const annotation=this.doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[l.x,H-l.top-l.height,l.x+l.width,H-l.top],Border:[0,0,0],Dest:[target.ref,PDFName.of('XYZ'),null,null,null]});l.page.node.addAnnot(this.doc.context.register(annotation));}
 }
}

export async function renderTastingPdf(book:TastingBook,onProgress:(message:string)=>void=()=>{}){
 onProgress('Schriften und Bilder werden geladen …');const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
 const fontPaths=['dm-sans-print-regular','dm-sans-print-bold','manrope-print-bold'];const embedded=await Promise.all(fontPaths.map(async name=>doc.embedFont(await bytes('/fonts/'+name+'.ttf'),{subset:true})));
 const fonts={regular:embedded[0],bold:embedded[1],heading:embedded[2]};
 const urls=[...new Set([...book.wines.map(w=>w.bottleImage||''),...book.entries.flatMap(e=>e.type==='article'?[e.article.image,e.article.companion?.image||'']:[])].filter(Boolean))];const pictures=new Map<string,Picture>();const failedImages:string[]=[];let cursor=0;
 await Promise.all(Array.from({length:3},async()=>{while(cursor<urls.length){const url=urls[cursor++];try{pictures.set(url,await picture(url,doc));}catch{failedImages.push(url);}}}));
 // Inline fallback glyphs preserve e.g. a participant's emoji without replacing their words.
 const supported=new Set(fonts.regular.getCharacterSet());const glyphs=new Map<string,Glyph>();const allText='→ '+book.name+'\n'+book.participant+'\n'+book.wines.map(w=>[w.name,w.producer,w.grape,w.region,w.vintage,w.hint,w.bottleCredit||''].join(' ')).join('\n')+'\n'+book.entries.map(e=>e.type==='notes'?[e.note.text,...e.note.aromas].join(' '):e.type==='article'?[e.article.title,e.article.intro,...e.article.paragraphs,...(e.article.sections||[]).flatMap(s=>[s.title,s.body]),...(e.article.additionalInfo||[]).flatMap(s=>[s.title,s.body]),...(e.article.scene?[e.article.scene.title,e.article.scene.caption,...e.article.scene.items.flatMap(s=>[s.label,s.title,s.body])]:[]),e.article.fact,e.article.credit.text,...(e.article.profile?e.article.profile.flatMap(fact=>[fact.label,fact.value]):[]),...(e.article.companion?[e.article.companion.title,e.article.companion.caption,...e.article.companion.milestones.flatMap(m=>[m.year,m.title,m.body])]:[]),...(e.article.landscape?[e.article.landscape.title,e.article.landscape.caption,...e.article.landscape.parts.flatMap(p=>[p.title,p.body])]:[])].join(' '):e.sections.flatMap(s=>[s.title,s.body]).join(' ')).join('\n');
 for(const char of new Set(chars(tidy(allText)))){if(char==='\n'||[...char].every(c=>supported.has(c.codePointAt(0)!)))continue;const canvas=document.createElement('canvas');const context=canvas.getContext('2d')!;context.font='48px sans-serif';const measured=context.measureText(char);canvas.width=Math.max(12,Math.ceil(measured.width)+4);canvas.height=64;context.font='48px sans-serif';context.textBaseline='alphabetic';context.fillStyle='#263c30';context.fillText(char,2,49);const blob=await new Promise<Blob>(resolve=>canvas.toBlob(b=>resolve(b!),'image/png'));glyphs.set(char,{image:await doc.embedPng(await blob.arrayBuffer()),ratio:canvas.width/48});}
 onProgress('Dein Tasting-Heft wird gestaltet …');const layout=new BookLayout(doc,fonts,pictures,glyphs,book);layout.cover();layout.overview();
 for(let i=0;i<book.entries.length;i++){const entry=book.entries[i];if(entry.type==='article')layout.article(entry.article,entry.wine,entry.interlude);else if(entry.type==='pending')layout.pending(entry.wine,entry.sections);else layout.notes(entry.wine,entry.note);if(i%3===0)await new Promise(resolve=>setTimeout(resolve,0));}
 layout.credits();layout.finish();doc.setTitle(book.name+' · '+book.participant);doc.setAuthor('Sip Happens');doc.setSubject('Dein persönliches Tasting-Heft mit Weinwissen und eigenen Notizen');doc.setCreator('Sip Happens');doc.setProducer('Sip Happens');doc.setCreationDate(new Date(book.exportedAt));doc.catalog.set(PDFName.of('Lang'),PDFString.of('de-DE'));doc.catalog.getOrCreateViewerPreferences().setDisplayDocTitle(true);
 onProgress('PDF wird vorbereitet …');const data=await doc.save();return{bytes:data,pages:doc.getPageCount(),missingImages:failedImages.length};
}
