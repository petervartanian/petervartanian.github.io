import ast, json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[1]
out=root/'preview-cards'
out.mkdir(exist_ok=True)
tree=ast.parse((root/'build.py').read_text())
parts=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='mobile_parts' for t in n.targets))
scales=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='piece_scales' for t in n.targets))
fontpath=str(root/'assets/fonts/SortsMillGoudy-Regular.ttf')
S=2
palettes={'home':('#ffffff','#3f3544','#755276'),'writing':('#efeafa','#483639','#884d5a'),'cv':('#fff0df','#303d4e','#46698a'),'contact':('#eaf5ef','#473b50','#785987')}

def smallcaps(draw,text,pos,size,fill):
 x,y=pos
 for c in text:
  font=ImageFont.truetype(fontpath,round(size*S*(.78 if c.islower() else 1)))
  draw.text((round(x*S),round(y*S)),c.upper(),font=font,fill=fill,anchor='ls')
  x+=draw.textlength(c.upper(),font=font)/S + .45
 return x

def shape(i,x,y,scale=1,rotate=0):
 name,home,mount,(ax,ay),svg=parts[i]
 s=scale*scales.get(i,1)
 return f'<g transform="translate({x} {y}) rotate({rotate}) scale({s})">{svg}</g>'

for key,(paper,ink,accent) in palettes.items():
 canvas=Image.new('RGB',(1200*S,630*S),paper)
 # Center the visible glyph bounds, rather than the font's line box.
 name_layer=Image.new('RGBA',(1200*S,150*S))
 smallcaps(ImageDraw.Draw(name_layer),'Peter H. Vartanian',(0,90),62,ink)
 name_layer=name_layer.crop(name_layer.getbbox())
 layers=[name_layer]
 if key!='home':
  label={'writing':'Writing','cv':'Curriculum Vitæ','contact':'Contact'}[key]
  label_layer=Image.new('RGBA',(1200*S,120*S))
  ImageDraw.Draw(label_layer).text((0,75*S),label,font=ImageFont.truetype(fontpath,44*S),fill=accent,anchor='ls')
  layers.append(label_layer.crop(label_layer.getbbox()))
 gap=25*S
 total_h=sum(layer.height for layer in layers)+gap*(len(layers)-1)
 y=(canvas.height-total_h)//2
 for layer in layers:
  canvas.paste(layer,((canvas.width-layer.width)//2,y),layer)
  y+=layer.height+gap
 canvas.save(out/f'{key}-type.png')
 art=[]
 if key=='home':
  # The same suspended construction, enlarged past the right edge of the card.
  art.append('<g transform="translate(-44 -65) scale(.75)">')
  art.append('<g fill="none" stroke="#8b7b8e" stroke-width="1.25"><path d="M266-20V68 M117 114Q191 48 266 68Q352 48 421 118 M266 68V216 M47 282Q133 205 266 216Q366 221 455 282 M266 216L260 340 M130 351Q215 321 260 340Q305 322 330 365Q389 359 425 380"/>')
  for i,(_, (x,y),(mx,my),(ax,ay),_) in enumerate(parts):
   scale=scales.get(i,1)
   art.append(f'<path d="M{mx} {my}L{x+ax*scale} {y+ay*scale}"/>')
  art.append('</g>')
  for i,(_, (x,y),_,_,_) in enumerate(parts):art.append(shape(i,x,y))
  art.append('</g>')
 else:
  # Each companion card quotes a different fragment of the same mobile.
  positions={
   'writing':[(0,991,189,1.9,8),(8,813,394,1.1,-12),(13,1050,505,1.7,8),(9,720,476,1.15,-9)],
   'cv':[(2,987,306,2.05,-9),(6,826,459,1.6,0),(10,795,188,1.25,6),(11,1121,482,1.5,0)],
   'contact':[(1,1020,280,1.95,-10),(4,788,428,1.2,8),(14,1102,464,1.45,-7),(12,889,550,1.1,7)]
  }[key]
  # Join every hanging piece to a single bent arm entering the image edge.
  art.append('<g fill="none" stroke="#8b7b8e" stroke-width="1.25"><path d="M947-10V72M702 120Q815 38 947 72Q1069 17 1195 88"/>')
  import math
  for i,x,y,s,r in positions:
   ax,ay=parts[i][3];s*=scales.get(i,1);rad=math.radians(r)
   tx=x+s*(ax*math.cos(rad)-ay*math.sin(rad));ty=y+s*(ax*math.sin(rad)+ay*math.cos(rad))
   art.append(f'<path d="M947 72L{tx:.3f} {ty:.3f}"/>')
  art.append('</g>')
  art += [shape(i,x,y,s,r) for i,x,y,s,r in positions]
 if key!='home':
  corner={'writing':'translate(480 -90) scale(.6)','cv':'translate(720 630) scale(-.6 -.6)','contact':'translate(1620 630) scale(-.6 -.6)'}[key]
  art=['<g transform="'+corner+'">']+art+['</g>']
 svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">'+''.join(art)+'</svg>'
 (out/f'{key}-art.svg').write_text(svg)
print(out)
