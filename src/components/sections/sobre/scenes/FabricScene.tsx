import Image from "next/image";

import { Counter } from "@/components/sections/sobre/Counter";
import { sobreMetricas } from "@/data/sobre";

export function FabricScene({ active }: { active: boolean }) {
  return (
    <section
      aria-labelledby="story-fabric-heading"
      className="story-scene story-scene--fabric"
      data-story-scene="fabric"
    >
      <div aria-hidden="true" className="story-fabric__layers">
        <div
          className="story-fabric__layer story-fabric__layer--back"
          data-fabric-layer="back"
        />
        <div
          className="story-fabric__layer story-fabric__layer--middle"
          data-fabric-layer="middle"
        />
        <div
          className="story-fabric__layer story-fabric__layer--front"
          data-fabric-layer="front"
        />
      </div>

      <div className="story-fabric__image-frame">
        <Image
          alt="Detalhe de vestido estampado e do caimento do tecido em editorial de moda"
          className="story-fabric__image"
          data-fabric-image
          fill
          sizes="(min-width: 900px) 45vw, 70vw"
          src="/images/conjuntos/hero-conjuntos-essence.webp"
          style={{ objectPosition: "72% center" }}
        />
        <span aria-hidden="true" className="story-fabric__image-shade" />
      </div>

      <div className="story-fabric__copy">
        <h2 className="story-scene__title" id="story-fabric-heading">
          <span className="story-title-mask">
            <span data-fabric-title-line>O que se sente,</span>
          </span>
          <span className="story-title-mask">
            <span data-fabric-title-line>também se vê.</span>
          </span>
        </h2>
        <p className="story-fabric__description">
          Um bom tecido acompanha o movimento. Um bom detalhe transforma o
          conjunto.
        </p>

        <div aria-label="Métricas da Essence" className="story-fabric__stats">
          {sobreMetricas.map((metrica) => (
            <Counter
              active={active}
              key={metrica.chave}
              label={metrica.rotulo}
              placeholder={metrica.placeholder}
              value={metrica.valor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
