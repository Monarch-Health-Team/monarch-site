/**
 * Server-only helpers for reading MDX articles from /content/journal.
 *
 * Articles live in `<repo>/content/journal/<slug>.mdx`. Each file has
 * YAML frontmatter and an MDX body — the body is parsed at the page
 * level via next-mdx-remote, while this module only reads the file
 * system, parses frontmatter, and exposes typed metadata.
 *
 * Categories are kept as a closed union to match the design system's
 * filter chips. Adding a category here also requires adding a chip
 * style in components/sections/journal/.
 */

import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

import {
  JOURNAL_CATEGORIES,
  type JournalAuthor,
  type JournalCategory,
  type JournalPost,
} from "@/lib/journal-types";

export {
  JOURNAL_CATEGORIES,
  type JournalAuthor,
  type JournalCategory,
  type JournalPost,
};

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

function isJournalCategory(value: unknown): value is JournalCategory {
  return (
    typeof value === "string" &&
    (JOURNAL_CATEGORIES as readonly string[]).includes(value)
  );
}

function isValidIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function readPostFile(filename: string): JournalPost {
  const filepath = path.join(JOURNAL_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const slug = filename.replace(/\.mdx?$/i, "");

  // Validate frontmatter — fail loudly during build if anything is off
  // rather than rendering a half-broken article.
  if (typeof data.title !== "string" || data.title.length === 0) {
    throw new Error(`Journal: ${filename} is missing a 'title' field`);
  }
  if (typeof data.excerpt !== "string" || data.excerpt.length === 0) {
    throw new Error(`Journal: ${filename} is missing an 'excerpt' field`);
  }
  if (!isValidIsoDate(data.publishedAt)) {
    throw new Error(
      `Journal: ${filename} has an invalid or missing 'publishedAt' (expected ISO date)`,
    );
  }
  if (!isJournalCategory(data.category)) {
    throw new Error(
      `Journal: ${filename} has an invalid 'category' (got ${String(
        data.category,
      )})`,
    );
  }
  if (
    !data.author ||
    typeof data.author !== "object" ||
    typeof (data.author as JournalAuthor).name !== "string"
  ) {
    throw new Error(`Journal: ${filename} is missing an 'author' object`);
  }
  if (
    !data.coverImage ||
    typeof data.coverImage !== "object" ||
    typeof (data.coverImage as { src?: string }).src !== "string"
  ) {
    throw new Error(`Journal: ${filename} is missing a 'coverImage' object`);
  }

  const rt = readingTime(content);
  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    publishedAt: data.publishedAt,
    author: data.author as JournalAuthor,
    review:
      data.review &&
      typeof data.review === "object" &&
      typeof (data.review as { name?: string }).name === "string" &&
      isValidIsoDate((data.review as { date?: string }).date)
        ? (data.review as JournalPost["review"])
        : undefined,
    category: data.category,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    coverImage: data.coverImage as JournalPost["coverImage"],
    content,
    readTime: `${Math.max(1, Math.round(rt.minutes))} min read`,
    readMinutes: Math.max(1, Math.round(rt.minutes)),
  };
}

/** All posts, ordered by `publishedAt` descending (newest first). */
export function getAllPosts(): JournalPost[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];
  const filenames = fs
    .readdirSync(JOURNAL_DIR)
    .filter((name) => /\.mdx?$/i.test(name));
  const posts = filenames.map(readPostFile);
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPostBySlug(slug: string): JournalPost | null {
  try {
    return readPostFile(`${slug}.mdx`);
  } catch {
    return null;
  }
}

/**
 * Returns the next-newest and next-oldest articles relative to a slug.
 * `previous` is the older article, `next` is the newer one — same
 * direction the article-template Prev/Next nav uses (← Previous shows
 * older content, Next → shows newer).
 */
export function getAdjacentPosts(slug: string): {
  previous: JournalPost | null;
  next: JournalPost | null;
} {
  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return { previous: null, next: null };
  return {
    previous: posts[idx + 1] ?? null,
    next: posts[idx - 1] ?? null,
  };
}

export function getRelatedPosts(
  slug: string,
  category: JournalCategory,
  limit = 3,
): JournalPost[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.category === category)
    .slice(0, limit);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
