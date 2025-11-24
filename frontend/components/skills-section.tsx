import { Badge } from "@/components/ui/badge";

type Skill = {
  _id: string;
  name: string;
};

type SkillsSectionProps = {
  skills: Skill[];
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/50 py-24">
      <div className="container">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
              Skills
            </h2>
            <p className="text-muted-foreground text-xl">
              Technologies I work with
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <Badge
                key={skill._id}
                variant="secondary"
                className="px-4 py-2 text-base"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
