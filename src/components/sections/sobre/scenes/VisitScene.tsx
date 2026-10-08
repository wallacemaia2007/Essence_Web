import { ArrowUpRight, Clock3, MapPin } from "lucide-react";

import { localizacaoLoja } from "@/data/localizacao";

export function VisitScene() {
  return (
    <section
      aria-labelledby="story-visit-heading"
      className="story-scene story-scene--visit"
      data-story-scene="visit"
    >
      <div className="story-visit__layout">
        <div
          aria-label="Mapa ilustrado da região da loja Essence em Passos, Minas Gerais"
          className="story-visit__map"
          data-visit-map
          role="img"
        >
          <svg
            aria-hidden="true"
            className="story-visit__map-drawing"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 760 600"
          >
            <rect height="600" width="760" fill="#ffffff" />
            <g
              className="story-visit__blocks"
              fill="#000000"
              fillOpacity={0.07}
            >
              <rect height="85" rx="14" width="142" x="48" y="66" />
              <rect height="112" rx="14" width="120" x="236" y="45" />
              <rect height="78" rx="14" width="163" x="446" y="64" />
              <rect height="96" rx="14" width="138" x="76" y="225" />
              <rect height="122" rx="14" width="154" x="537" y="220" />
              <rect height="94" rx="14" width="166" x="37" y="422" />
              <rect height="84" rx="14" width="140" x="273" y="458" />
              <rect height="101" rx="14" width="142" x="500" y="408" />
            </g>
            <g
              className="story-visit__roads"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="22"
            >
              <path d="M-30 178 C150 175 188 208 311 202 S553 161 790 178" />
              <path d="M184 -40 C181 86 208 113 210 241 S177 433 188 640" />
              <path d="M443 -35 C441 109 464 160 446 280 S435 466 459 634" />
              <path d="M-25 363 C128 348 240 386 366 368 S572 334 790 362" />
            </g>
            <path
              className="story-visit__main-road"
              d="M-20 284 C147 274 241 315 363 293 S577 260 782 281"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeWidth="34"
            />
            <path
              d="M-20 284 C147 274 241 315 363 293 S577 260 782 281"
              fill="none"
              stroke="#ffffff"
              strokeDasharray="5 16"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
          <p className="story-visit__map-label">
            PASSOS <span>· MG</span>
          </p>
          <p className="story-visit__street-label">
            Av. Com. Francisco Avelino Maia
          </p>
          <div className="story-visit__pin" data-map-pin>
            <span
              aria-hidden="true"
              className="story-visit__pin-halo"
              data-map-pin-halo
            />
            <span className="story-visit__pin-mark">
              <MapPin
                aria-hidden="true"
                className="size-7"
                fill="currentColor"
              />
            </span>
          </div>
        </div>

        <div className="story-visit__copy" data-visit-copy>
          <h2 className="story-scene__title" id="story-visit-heading">
            <span className="story-title-mask">
              <span data-visit-title-line>Venha nos</span>
            </span>
            <span className="story-title-mask">
              <span data-visit-title-line>visitar.</span>
            </span>
          </h2>
          <p className="story-visit__intro">
            A última cena é ao vivo. Esperamos por você em Passos.
          </p>

          <div className="story-visit__details">
            <div className="story-visit__detail">
              <MapPin aria-hidden="true" className="story-visit__detail-icon" />
              <div>
                <p className="story-visit__detail-label">Endereço</p>
                <address className="story-visit__address">
                  <span>{localizacaoLoja.endereco[0]}</span>
                  <span>{localizacaoLoja.endereco[1]}</span>
                </address>
              </div>
            </div>
            <div className="story-visit__detail">
              <Clock3 aria-hidden="true" className="story-visit__detail-icon" />
              <div>
                <p className="story-visit__detail-label">Horários</p>
                <p className="story-visit__hours">{localizacaoLoja.horario}</p>
              </div>
            </div>
          </div>

          <a
            className="story-visit__directions"
            href={localizacaoLoja.comoChegarUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Como chegar
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
