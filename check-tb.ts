import { renderMermaidSync } from './src/index.ts';
import { writeFileSync } from 'node:fs';

const code = 'graph TB\n开始[开始] --> 判断{条件判断}\n判断 -->|是| 处理[处理]\n判断 -->|否| 结束[结束]';
const svg = renderMermaidSync(code);
writeFileSync('output/flowchart_TB.svg', svg);

console.log('=== flowchart_TB.svg shapes ===');
for (const tag of svg.match(/<(rect|polygon)[^>]*\/>/g) || []) {
  const x = tag.match(/\sx="([^"]+)"/)?.[1];
  const y = tag.match(/\sy="([^"]+)"/)?.[1];
  const w = tag.match(/\swidth="([^"]+)"/)?.[1];
  const h = tag.match(/\sheight="([^"]+)"/)?.[1];
  const pts = tag.match(/\spoints="([^"]+)"/)?.[1];
  if (pts) {
    const coords = pts.split(' ').map(p => p.split(',').map(Number));
    const xs = coords.map(c => c[0]); const ys = coords.map(c => c[1]);
    console.log('  polygon cx=' + ((Math.min(...xs)+Math.max(...xs))/2).toFixed(1) + ' cy=' + ((Math.min(...ys)+Math.max(...ys))/2).toFixed(1) + ' w=' + (Math.max(...xs)-Math.min(...xs)).toFixed(1));
  } else if (x && w) {
    console.log('  rect x=' + x + ' y=' + y + ' w=' + w + ' center=' + (parseFloat(x)+parseFloat(w)/2).toFixed(1));
  }
}
console.log('\n=== texts ===');
for (const m of svg.matchAll(/<text[^>]*>(.*?)<\/text>/gs)) {
  const inner = m[0].match(/<text([^>]*)>/)?.[1] || '';
  const tx = inner.match(/\sx="([^"]+)"/)?.[1];
  const ty = inner.match(/\sy="([^"]+)"/)?.[1];
  const anchor = inner.match(/text-anchor="(\w+)"/)?.[1] || 'start';
  console.log('  ' + anchor + ' x=' + tx + ' y=' + ty + ' "' + m[1].trim().substring(0, 20) + '"');
}
