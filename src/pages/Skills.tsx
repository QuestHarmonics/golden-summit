import { useProgressStore } from '../store/progressStore';
import { SkillTree } from '../components/skills/SkillTree';
import { SkillNode } from '../types/skills';

export default function Skills() {
  const { skills, updateSkill } = useProgressStore();

  // Transform skills data into tree format
  const skillTreeData = {
    nodes: skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      level: skill.level,
      maxLevel: skill.maxLevel,
      experience: skill.experience,
      maxExperience: skill.maxExperience,
      category: skill.category,
      icon: skill.icon,
      prerequisites: skill.prerequisites || [],
      children: skill.children || [],
      unlocked: skill.unlocked
    })),
    connections: skills.flatMap(skill => 
      (skill.prerequisites || []).map(prereq => ({
        source: prereq,
        target: skill.id
      }))
    )
  };

  const handleNodeClick = (node: SkillNode) => {
    // Handle skill node click - could show details, allow upgrades, etc.
    console.log('Clicked skill:', node);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Skills</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <SkillTree
          data={skillTreeData}
          onNodeClick={handleNodeClick}
        />
      </div>
    </div>
  );
} 