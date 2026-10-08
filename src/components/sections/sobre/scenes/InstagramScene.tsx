import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { MagneticButton } from "@/components/sections/sobre/MagneticButton";
import { externalLinks } from "@/constants/routes";

const posts = [
  { id: "look-1", kind: "photo", position: "69% 48%" },
  { id: "bastidores", kind: "note", copy: "BASTIDORES\nDA CURADORIA" },
  { id: "look-2", kind: "photo", position: "84% 47%" },
  { id: "novidades", kind: "note", copy: "CHEGOU\nNA ESSENCE" },
  { id: "look-3", kind: "photo", position: "96% 47%" },
] as const;

export function InstagramScene() {
  return (
    <section
      aria-labelledby="story-instagram-heading"
      className="story-scene story-scene--instagram"
      data-story-scene="instagram"
    >
      <div aria-hidden="true" className="story-instagram__mosaic">
        {posts.map((post, index) => (
          <article
            className={`story-instagram__post story-instagram__post--${index + 1} ${post.kind === "note" ? "story-instagram__post--note" : ""}`}
            data-instagram-post
            key={post.id}
          >
            {post.kind === "photo" ? (
              <Image
                alt=""
                className="story-instagram__photo"
                fill
                sizes="(min-width: 900px) 15vw, 35vw"
                src="/images/conjuntos/hero-conjuntos-essence.webp"
                style={{ objectPosition: post.position }}
              />
            ) : (
              <span className="story-instagram__post-copy">{post.copy}</span>
            )}
          </article>
        ))}
      </div>

      <div className="story-instagram__copy" data-instagram-copy>
        <h2 className="story-scene__title" id="story-instagram-heading">
          <span className="story-title-mask">
            <span data-instagram-title-line>A Essence</span>
          </span>
          <span className="story-title-mask">
            <span data-instagram-title-line>no seu feed.</span>
          </span>
        </h2>
        <p className="story-instagram__handle" data-instagram-handle>
          @essencepassos
        </p>
        <p className="story-instagram__description">
          Acompanhe lançamentos, bastidores e novidades — e continue essa
          conversa com a gente.
        </p>
        <MagneticButton href={externalLinks.instagram}>
          <svg
            aria-hidden="true"
            className="story-instagram__icon size-4"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="18" rx="5" width="18" x="3" y="3" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="18" cy="6" fill="currentColor" r="1" stroke="none" />
          </svg>
          <span>Seguir no Instagram</span>
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </MagneticButton>
      </div>
    </section>
  );
}
