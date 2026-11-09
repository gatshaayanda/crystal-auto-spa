import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const output = path.join(process.cwd(), "public");
const palette = { background: [6, 21, 45, 255], blue: [28, 117, 232, 255], ice: [166, 229, 255, 255], white: [255, 255, 255, 255] };

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const name = Buffer.from(type), body = Buffer.concat([name, data]);
  const header = Buffer.alloc(4); header.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(body));
  return Buffer.concat([header, body, checksum]);
}
function insideRoundedRect(x, y, size, radius) {
  if (x < 0 || y < 0 || x >= size || y >= size) return false;
  const cx = x < radius ? radius : x >= size - radius ? size - radius - 1 : x;
  const cy = y < radius ? radius : y >= size - radius ? size - radius - 1 : y;
  const dx = x - cx, dy = y - cy;
  return dx * dx + dy * dy <= radius * radius || (x >= radius && x < size - radius) || (y >= radius && y < size - radius);
}
const glyphC = ["01111","11000","10000","10000","10000","11000","01111"];
function insideDrop(x, y, size) {
  const nx = (x / size - .5) / .37, ny = (y / size - .1) / .82;
  return ny >= 0 && ny <= 1 && Math.abs(nx) <= Math.sin(Math.min(1, ny) * Math.PI * .5) * .96;
}
function render(size) {
  const pixels = Buffer.alloc(size * size * 4), radius = Math.round(size * .22);
  const scale = Math.max(1, Math.round(size / 25)), glyphWidth = 5 * scale, glyphHeight = 7 * scale;
  const left = Math.round((size - glyphWidth) / 2), top = Math.round(size * .43 - glyphHeight / 2);
  const put = (x, y, color) => { if (x < 0 || y < 0 || x >= size || y >= size) return; pixels.set(color, (y * size + x) * 4); };
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (!insideRoundedRect(x,y,size,radius)) { put(x,y,[0,0,0,0]); continue; }
    put(x,y,palette.background);
    if (insideDrop(x,y,size*.92)) {
      const blend = Math.min(1,Math.max(0,y/size));
      put(x,y,[Math.round(28+(166-28)*blend),Math.round(117+(229-117)*blend),Math.round(232+(255-232)*blend),255]);
    }
  }
  for (let row = 0; row < glyphC.length; row++) for (let col = 0; col < glyphC[row].length; col++) {
    if (glyphC[row][col] !== "1") continue;
    for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) put(left + col*scale + dx, top + row*scale + dy, palette.white);
  }
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) { const row = y * (1 + size * 4); raw[row] = 0; pixels.copy(raw,row+1,y*size*4,(y+1)*size*4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4); ihdr[8]=8; ihdr[9]=6;
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk("IHDR",ihdr),chunk("IDAT",zlib.deflateSync(raw)),chunk("IEND",Buffer.alloc(0))]);
}
for (const size of [180,192,512]) fs.writeFileSync(path.join(output,`crystal-auto-spa-icon-${size}.png`),render(size));
console.log("Generated Crystal Auto Spa PWA icons (180, 192 and 512 px).");
