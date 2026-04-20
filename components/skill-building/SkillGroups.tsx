import { skills } from "./list-of-groups";

interface SkillGroupsProps {
  summary?: any;
}

export default function SkillGroups({ summary }: SkillGroupsProps) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Build Your Skills</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the skills portal! Here, you can practice your skills in
            isolation to truly identify your strengths and weaknesses. More
            skills coming soon!
          </p>
        </div>

        {/* Skills List */}
        <div className="space-y-2 mb-8">
          {skills.map((skill) => {
            const IconComponent = skill.icon;
            return (
              <a key={skill.id} href={skill.link}>
                <div className="rounded-lg  transition-shadow duration-200 p-6 flex items-start gap-4 cursor-pointer">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{skill.title}</h3>
                      {skill.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-xs font-semibold rounded">
                          New!
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 font-medium">
                      {skill.description}
                    </p>
                    {skill.scoreKey && summary && summary[skill.scoreKey] && (
                      <p className="text-[#64748b] text-[13.5px] font-medium mt-1">
                        {summary[skill.scoreKey].formatted}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
