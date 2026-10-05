import { Crest } from "@/components/common/crest";

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
      <div className="text-primary mb-4">
        <Crest className="h-12 w-12" />
      </div>
      {eyebrow ? (
        <p className="text-primary text-xs font-semibold tracking-[0.26em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading mt-2 text-3xl leading-tight uppercase md:text-4xl">
        {title}
      </h2>
      <div className="mt-3 h-px w-32 bg-primary" />
      {description ? (
        <p className="text-muted-foreground mt-3 max-w-2xl">{description}</p>
      ) : null}
    </div>
  );
}