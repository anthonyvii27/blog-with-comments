import matter from 'gray-matter';
import { join } from 'path';
import fs from 'fs';

import { IPost } from '../interfaces/IPosts';

const postsDirectory: string = join(process.cwd(), '_posts');

export function getPostSlugs() {
    return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
    const formattedSlug: string = slug.replace(/\.md$/, '');
    const path: string = join(postsDirectory, `${formattedSlug}.md`);
    const fileContents = fs.readFileSync(path, 'utf8');
    const { data, content } = matter(fileContents);

    const items: IPost = {};

    fields.forEach((field) => {
        if (field === 'slug') {
            items[field] = formattedSlug;
        }

        if (field === 'content') {
            items[field] = content;
        }

        if (typeof data[field] !== 'undefined') {
            items[field] = data[field];
        }
    });

    return items;
}

export function getAllPosts(fields: string[] = []) {
    const slugs = getPostSlugs();
    const posts = slugs.map(slug => getPostBySlug(slug, fields)).sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    
    return posts;
}