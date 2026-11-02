import Link from "@/components/site/live-link";
import { ArrowRight } from "lucide-react";

import { FORUM_TOPICS, type ForumTopic } from "@/content/community";
import type { JournalPost } from "@/lib/journal-types";
import { Photo } from "@/components/site/photo";
import { cardCta } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { SHOW_COMMUNITIES_PAGE } from "@/content/site-flags";

/**
 * Two columns: what people can talk about, and what we have written.
 *
 * Replaced the single carousel of three articles that stood here
 * (client, 21 Sep 2026: "I want this section entirely revamped ... five
 * topics each, two columns ... remove the images"). The carousel is in
 * the git history; components/site/insights-carousel.tsx still exists
 * and is now used by nothing.
 *
 * The two columns are deliberately not the same thing (client, 22 Sep
 * 2026: "the right side to look more like articles and the left side
 * more like a community server"). A community is a room with people in
 * it, so it is one line: a mark and a name. An article is a piece of
 * writing, so it is three: a kicker, a title and a date. Both sit on
 * tiles of frosted glass ("an apple glass tile", 21 Sep 2026), which is
 * all the two share.
 *
 * NO COMMUNITY IS OPEN YET: see the note at the top of
 * content/community.ts. The member counts that stood against the right
 * edge (client, 22 Sep 2026) were invented, and were removed on 26 Sep
 * 2026 with nothing in their place. "Top" still implies a ranking, and
 * is still to be settled before launch.
 *
 * Seven of ten, in the order content/community.ts holds them, so nothing
 * here decides which seven and the file stays the single source.
 */

/**
 * Eight of the ten (seven until 7 Oct 2026, when "Show all articles" went
 * under the other column so both columns carry a link): the number that
 * makes the list END level with the articles beside it (client, 22 Sep
 * 2026, re-tuned 7 Oct 2026).
 *
 * Seven and not eight because only this column carries a link under its
 * list: a row is 68px with its gap, the link block is 68px, and eight
 * rows plus the link overhung the articles by exactly one row.
 *
 * Tuned to five single-line article titles. A title that wraps, a sixth
 * article, or a link appearing under the other column moves the number -
 * measure rather than assume.
 */
const FORUMS = FORUM_TOPICS.slice(0, 8);

export function HomeReading({ posts }: { posts: JournalPost[] }) {
  return (
    // While SHOW_COMMUNITIES_PAGE is off (content/site-flags.ts, 25 Oct
    // 2026) the communities column is not rendered and the articles take
    // the full width of the section, as a row of three upright cards
    // (Jeffrey, 25 Oct 2026). Switched back on, the two columns return
    // with the original article strips.
    <div
      className={cn(
        "grid gap-12 lg:gap-16",
        SHOW_COMMUNITIES_PAGE && "lg:grid-cols-2",
      )}
    >
      {/* min-w-0 on both columns.
          A grid item's automatic minimum is its min-content width, and
          the community name is set with `truncate`, which is
          white-space: nowrap - so its min-content is the whole string,
          not the first word. The track sized itself to the longest name
          and the column asked for 573px inside a 335px container, which
          the section's overflow-hidden then clipped. Invisible at two
          columns, where the names fit. */}
      {SHOW_COMMUNITIES_PAGE && (
      <section aria-labelledby="forums-title" className="min-w-0">
        <h2
          id="forums-title"
          className="text-heading-3 leading-tight text-navy-900"
        >
          Online Communities
        </h2>
        <ul className="mt-5 flex flex-col gap-3">
          {FORUMS.map((topic) => (
            <li key={topic.slug}>
              <ForumCard topic={topic} />
            </li>
          ))}
        </ul>
        {/* Centred while this column spans the page, right-aligned from lg
            where it sits beside the articles column, flush with the column's
            right edge (docs/changes/button-alignment, F4). */}
        <div className="mt-5 flex justify-center lg:justify-end">
          <Link href="/community" className={cardCta}>
            All Communities
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>
      )}

      <section aria-labelledby="recent-title" className="min-w-0">
        <h2
          id="recent-title"
          className="text-heading-3 leading-tight text-navy-900"
        >
          Recently Published
        </h2>
        {SHOW_COMMUNITIES_PAGE ? (
          <ul className="mt-5 flex flex-col gap-3 lg:gap-[14px]">
            {posts.map((post) => (
              <li key={post.slug}>
                <ArticleCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-5 grid gap-4 md:grid-cols-3 lg:gap-5">
            {posts.map((post) => (
              <li key={post.slug} className="flex">
                <ArticleTile post={post} />
              </li>
            ))}
          </ul>
        )}
        {/* The same link row as under the communities, so the two links
            sit on one line (Jeffrey, 7 Oct 2026). */}
        <div className="mt-5 flex justify-center lg:justify-end">
          <Link href="/journal" className={cardCta}>
            Show all articles
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

/**
 * One community, as a row on a board.
 *
 * Not the article card below it (client, 22 Sep 2026: "I wanted to show
 * that we are looking at a forum board"). A board row is a mark and a
 * name on ONE line, which is what makes a list of them scan as a
 * directory of rooms rather than as a stack of headlines. The count that
 * stood against the right edge was removed on 26 Sep 2026 (no community
 * is open, so it was invented), and nothing took its place: no arrow,
 * no status line.
 *
 * The mark sits in a tinted well rather than loose against the name, so
 * a row of them lines up down the left the way avatars do on a board.
 */
function ForumCard({ topic }: { topic: ForumTopic }) {
  return (
    <Link
      href={`/community/${topic.slug}`}
      className="group/card flex items-center gap-3 rounded-2xl bg-white/55 px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_10px_30px_-14px_rgba(0,20,77,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-brand hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-body"
      >
        {topic.emoji}
      </span>
      {/* Two lines on a phone, one from sm up. Beside the mark (and,
          until 26 Sep 2026, a count) a name got 211px here, and most
          of them want 250, so truncating cut five of the seven
          mid-word. Wrapping costs a few pixels of row height, which
          only matters where the column has to end level with the
          articles - and that is sm and up. */}
      <span className="line-clamp-2 min-w-0 flex-1 text-heading-5 leading-snug font-semibold text-navy-900 transition-colors duration-brand group-hover/card:text-orange-700 sm:truncate">
        {topic.label}
      </span>
    </Link>
  );
}

/**
 * One article, as a strip with its own photograph.
 *
 * The picture and a two-line summary were added on 23 Sep 2026, on the
 * condition that the column not grow past the communities beside it.
 *
 * The numbers are chosen so that it lands on exactly the height it had:
 * a 128px thumbnail inside 20px of padding is a 168px card, and three of
 * those on a 12px gap come to 528, which is what five of the old cards
 * came to and what seven communities plus their link come to. Change the
 * thumbnail or the padding and the column stops ending level with the
 * one beside it.
 *
 * Those numbers are for sm and up. Below it the card is the full width
 * of a phone rather than half a column, and a 128px picture left 151px
 * for the words - enough to clip the title to "The measureme...". So the
 * picture comes down to 80px there and the title wraps to two lines
 * instead of truncating. None of that touches the arithmetic above,
 * which only has to hold where the two columns sit side by side.
 *
 * The summary is clamped rather than trimmed in the content, because
 * every excerpt is also the meta description and the card is not the
 * thing that should decide how long those are.
 */
function ArticleCard({ post }: { post: JournalPost }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group/card flex gap-4 rounded-2xl bg-white/55 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_10px_30px_-14px_rgba(0,20,77,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-brand hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 sm:p-5"
    >
      <Photo
        {...post.coverImage}
        alt=""
        aspect="square"
        className="size-20 shrink-0 rounded-xl sm:size-32"
        sizes="(min-width: 40rem) 128px, 80px"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-label-sm tracking-[0.14em] text-orange-700 uppercase">
          {post.category}
        </p>
        <p className="mt-1 line-clamp-2 text-heading-5 leading-snug font-semibold text-navy-900 transition-colors duration-brand group-hover/card:text-orange-700 sm:truncate">
          {post.title}
        </p>
        <p className="mt-1 line-clamp-2 text-body-sm leading-snug text-neutral-700">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-1">
          <p className="text-label-sm text-neutral-700">
            {new Date(post.publishedAt).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <ArrowRight
            aria-hidden
            className="mb-0.5 size-4 shrink-0 text-orange-700 transition-transform duration-brand group-hover/card:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

/**
 * One article, as an upright card: photograph on top, then category,
 * title, summary, date and arrow (Jeffrey, 25 Oct 2026). Used while the
 * articles stand alone across the section (SHOW_COMMUNITIES_PAGE off),
 * three to a row from md, stacked on a phone.
 *
 * The same frosted plate, hover and focus ring as ArticleCard; only the
 * arrangement changes. The picture is 16:9 (2:1 on a phone) so the row stays short, the
 * title clamps to two lines and the summary to two, and the date row
 * sits at the foot so the three cards end level whatever their titles.
 */
function ArticleTile({ post }: { post: JournalPost }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group/card flex w-full flex-col overflow-hidden rounded-2xl bg-white/55 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_10px_30px_-14px_rgba(0,20,77,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-brand hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <Photo
        {...post.coverImage}
        alt=""
        aspect="wide"
        rounded={false}
        // 2:1 on a phone, where the cards stack, to keep the column short.
        className="w-full aspect-[2/1] md:aspect-[16/9]"
        sizes="(min-width: 48rem) 33vw, 100vw"
      />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <p className="text-label-sm tracking-[0.14em] text-orange-700 uppercase">
          {post.category}
        </p>
        <p className="mt-1 line-clamp-2 text-heading-5 leading-snug font-semibold text-navy-900 transition-colors duration-brand group-hover/card:text-orange-700">
          {post.title}
        </p>
        <p className="mt-1 line-clamp-2 text-body-sm leading-snug text-neutral-700">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-3">
          <p className="text-label-sm text-neutral-700">
            {new Date(post.publishedAt).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <ArrowRight
            aria-hidden
            className="mb-0.5 size-4 shrink-0 text-orange-700 transition-transform duration-brand group-hover/card:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

/**
 * One tile.
 *
 * The same frosted glass the hero's secondary button is made of, which
 * is the site's only other piece of it: a translucent white plate, a
 * blur behind it, saturate to stop what comes through going grey, and
 * an inset highlight along the top edge. The blur is what makes it a
 * material rather than a tint - it carries the colour and shape of the
 * photograph behind without letting any of the detail through to fight
 * the type. No border: the highlight is the edge.
 *
 * white/55 rather than the hero's 70 because the ground here is already
 * veiled to near-white, so less is needed to sit on it. Navy-900 on it
 * measures 12.1:1 over the darkest pixel the veil lets through.
 *
 * The arrow is the only thing saying it is a link, so it is not
 * decoration and it does not disappear until hover - a card whose
 * affordance only exists under a pointer has none on a phone.
 */
function ReadingCard({
  href,
  title,
  line,
  kicker,
}: {
  href: string;
  title: string;
  line: string;
  /** An article's category, set above its title. */
  kicker?: string;
}) {
  return (
    <Link
      href={href}
      className="group/card block rounded-2xl bg-white/55 px-4 py-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_10px_30px_-14px_rgba(0,20,77,0.35)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-brand hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      {kicker && (
        <p className="text-label-sm tracking-[0.14em] text-orange-700 uppercase">
          {kicker}
        </p>
      )}
      <p
        className={cn(
          "text-heading-5 leading-snug font-semibold text-navy-900 transition-colors duration-brand group-hover/card:text-orange-700",
          kicker && "mt-1",
        )}
      >
        {title}
      </p>
      <div className="mt-1 flex items-end justify-between gap-4">
        <p className="text-body-sm leading-snug text-neutral-700">{line}</p>
        <ArrowRight
          aria-hidden
          className="mb-0.5 size-4 shrink-0 text-orange-700 transition-transform duration-brand group-hover/card:translate-x-1"
        />
      </div>
    </Link>
  );
}
