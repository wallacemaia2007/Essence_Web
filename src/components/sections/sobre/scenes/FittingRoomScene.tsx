import Image from "next/image";

const looks = [
  {
    id: "floral",
    label: "Estampa leve",
    alt: "Modelo com vestido claro estampado em editorial de moda",
    position: "69% 48%",
  },
  {
    id: "alfaiataria",
    label: "Alfaiataria essencial",
    alt: "Modelo com conjunto branco de alfaiataria em editorial de moda",
    position: "84% 47%",
  },
  {
    id: "verde",
    label: "Cor que fica",
    alt: "Modelo com vestido verde em editorial de moda",
    position: "96% 47%",
  },
] as const;

const curation =
  "Cada peça é escolhida para combinar estilo, conforto e personalidade.";

export function FittingRoomScene() {
  return (
    <section
      aria-labelledby="story-fitting-heading"
      className="story-scene story-scene--fitting"
      data-story-scene="fitting"
    >
      <div className="story-fitting__inner">
        <div className="story-fitting__intro">
          <h2 className="story-scene__title" id="story-fitting-heading">
            <span className="story-title-mask">
              <span data-fitting-title-line>O provador.</span>
            </span>
          </h2>
          <p className="story-fitting__aside">
            Texturas, formas e combinações para descobrir sem pressa.
          </p>
        </div>

        <div className="story-fitting__rack" data-fitting-rack>
          <span aria-hidden="true" className="story-fitting__rail" />
          {looks.map((look) => (
            <article
              className="story-fitting__look"
              data-fitting-look
              key={look.id}
            >
              <span aria-hidden="true" className="story-fitting__hanger">
                <span className="story-fitting__hanger-hook" />
                <span className="story-fitting__hanger-shoulders" />
              </span>
              <div className="story-fitting__image-wrap">
                <Image
                  alt={look.alt}
                  className="story-fitting__image"
                  fill
                  sizes="(min-width: 900px) 20vw, 31vw"
                  src="/images/conjuntos/hero-conjuntos-essence.webp"
                  style={{ objectPosition: look.position }}
                />
              </div>
              <p className="story-fitting__look-label">{look.label}</p>
            </article>
          ))}
        </div>

        <p
          aria-label={curation}
          className="story-fitting__curation"
          data-fitting-curation
        >
          {curation.split(" ").map((word, index) => (
            <span
              aria-hidden="true"
              data-curation-word
              key={`${word}-${index}`}
            >
              {word}
              {index < curation.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
