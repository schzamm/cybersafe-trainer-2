// Local behavior check, using Node's built-in modules. This does not render CSS.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const app = fs.readFileSync('app.js', 'utf8');
const source = app.slice(app.indexOf('const menuToggle ='));
assert.ok(source.length > 100);
for (const width of [320, 390, 430, 1200]) {
  const handlers = {};
  const toggle = {hidden:true, attrs:{'aria-expanded':'false'}, setAttribute(k,v){this.attrs[k]=v;}, getAttribute(k){return this.attrs[k];}, addEventListener(k,f){handlers[k]=f;}, focus(){document.activeElement=this;}};
  const link = {focus(){document.activeElement=this;}};
  const nav = {hidden:false, contains(el){return el===link;}, querySelector(){return link;}, addEventListener(k,f){handlers['nav-'+k]=f;}};
  const media = {matches:width<=600, addEventListener(k,f){handlers.media=f;}};
  const document = {activeElement:null, addEventListener(k,f){handlers[k]=f;}};
  vm.runInNewContext(source,{document,window:{matchMedia(){return media;}},$:id=>id==='menu-toggle'?toggle:nav});
  assert.equal(nav.hidden,width<=600);
  assert.equal(toggle.hidden,width>600);
  if(width<=600){
    handlers.click(); assert.equal(nav.hidden,false); assert.equal(toggle.attrs['aria-expanded'],'true');
    handlers.keydown({key:'Escape'}); assert.equal(nav.hidden,true); assert.equal(document.activeElement,toggle);
    handlers.click(); handlers['nav-click']({target:{closest:()=>link}}); assert.equal(nav.hidden,true);
    media.matches=false; handlers.media(); assert.equal(nav.hidden,false); assert.equal(toggle.hidden,true);
    document.activeElement=link; media.matches=true; handlers.media(); assert.equal(nav.hidden,true); assert.equal(document.activeElement,toggle);
  }
  console.log(`${width}px: menu behavior passed (simulation, not rendered layout)`);
}
