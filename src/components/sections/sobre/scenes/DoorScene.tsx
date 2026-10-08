export function DoorScene() {
  return (
    <section
      aria-labelledby="story-door-heading"
      className="story-scene story-scene--door"
      data-story-scene="door"
    >
      <div aria-hidden="true" className="story-door__panels">
        <div
          className="story-door__panel story-door__panel--left"
          data-door-panel="left"
        />
        <div
          className="story-door__panel story-door__panel--right"
          data-door-panel="right"
        />
      </div>

      <div className="story-door__content">
        <p className="story-scene__eyebrow" data-door-kicker>
          Uma experiência Essence
        </p>
        <h2
          aria-label="Essence Passos"
          className="story-door__title"
          id="story-door-heading"
        >
          <span aria-hidden="true" className="story-door__line-mask">
            <span data-door-title-line>ESSENCE</span>
          </span>
          <span
            aria-hidden="true"
            className="story-door__line-mask story-door__line-mask--locality"
          >
            <span className="story-door__locality" data-door-title-line>
              {Array.from("PASSOS").map((letter, index) => (
                <span key={`${letter}-${index}`}>{letter}</span>
              ))}
            </span>
          </span>
        </h2>
        <p className="story-door__subtitle" data-door-subtitle>
          Feito para acompanhar seus passos.
        </p>
      </div>
    </section>
  );
}
