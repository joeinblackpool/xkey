// /downloads/xkey-seo-fixer.zip – the WordPress plugin (wordpress-plugin/xkey-seo-fixer), zipped on
// first request (stored, not compressed: it's small) and kept in memory.
import { WP_FILES } from "./wp-plugin-files.js";

let zip = null;
export function pluginZip() {
  if (zip) return zip;
  const enc = new TextEncoder(), parts = [], central = [];
  let offset = 0;
  const u16 = (n) => [n & 255, (n >> 8) & 255], u32 = (n) => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];
  for (const [name, text] of Object.entries(WP_FILES)) {
    const data = enc.encode(text), nm = enc.encode(name), crc = crcBytes(data);
    const common = [...u16(10), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(nm.length), ...u16(0)];
    const local = Uint8Array.from([...u32(0x04034b50), ...common]);
    parts.push(local, nm, data);
    central.push(Uint8Array.from([...u32(0x02014b50), ...u16(20), ...common, ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset)]), nm);
    offset += local.length + nm.length + data.length;
  }
  const cdSize = central.reduce((a, b) => a + b.length, 0), n = Object.keys(WP_FILES).length;
  const end = Uint8Array.from([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(n), ...u16(n), ...u32(cdSize), ...u32(offset), ...u16(0)]);
  const all = [...parts, ...central, end], out = new Uint8Array(all.reduce((a, b) => a + b.length, 0));
  let p = 0; for (const b of all) { out.set(b, p); p += b.length; }
  return (zip = out);
}
// zlib crc32 of raw bytes
function crcBytes(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
const TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
