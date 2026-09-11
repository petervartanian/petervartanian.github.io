const sharp=require('sharp');
const path=require('node:path').resolve(__dirname,'../preview-cards');
(async()=>{for(const key of ['home','writing','cv','contact']){
const art=await sharp(`${path}/${key}-art.svg`,{density:144}).png().toBuffer();
const composed=await sharp(`${path}/${key}-type.png`).composite([{input:art,left:0,top:0}]).png().toBuffer();
await sharp(composed).resize(1200,630).png().toFile(`${path}/${key}.png`);
}
const cards=await Promise.all(['home','writing','cv','contact'].map(key=>sharp(`${path}/${key}.png`).resize(600,315).toBuffer()));
await sharp({create:{width:1248,height:678,channels:3,background:'#e9e5e3'}}).composite(cards.map((input,i)=>({input,left:16+(i%2)*616,top:16+Math.floor(i/2)*331}))).png().toFile(`${path}/all-four.png`);
})();
