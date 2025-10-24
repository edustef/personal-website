import {Badge} from '@/components/ui/badge'

type Skill = {
  _id: string
  name: string
}

type SkillsSectionProps = {
  skills: Skill[]
}

export default function SkillsSection({skills}: SkillsSectionProps) {
  if (!skills || skills.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Skills</h2>
            <p className="text-xl text-muted-foreground">Technologies I work with</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {skills.map((skill) => (
              <Badge key={skill._id} variant="secondary" className="text-base px-4 py-2">
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
