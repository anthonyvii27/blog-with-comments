import remark from 'remark'
import html from 'remark-html'
import { VFileCompatible } from 'vfile';

export default async function markdownToHtml(markdown: VFileCompatible) {
  const result = await remark().use(html).process(markdown);

  return result.toString();
}