type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({
  description,
  eyebrow,
  title,
}: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-primary text-xs font-semibold tracking-[0.26em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading mt-2 text-3xl leading-tight uppercase md:text-4xl">
        {title}
      </h2>
      <div className="bg-primary mt-3 h-px w-32" />
      {description ? (
        <p className="text-muted-foreground mt-3 max-w-2xl">{description}</p>
      ) : null}
    </div>
  );
}
