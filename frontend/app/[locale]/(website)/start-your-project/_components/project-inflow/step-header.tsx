type StepHeaderProps = {
  title: string;
  description?: string;
};

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}

