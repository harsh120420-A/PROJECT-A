import { skills as studentSkills } from "../data/skills";

/*
  Calculate how well the current student matches
  an opportunity's required skills.

  Each matching skill contributes according to
  the student's proficiency score.

  Example:

  Python        80
  SQL           65
  Power BI      30

  Opportunity requires:
  Python
  SQL
  Power BI

  Match = (80 + 65 + 30) / (100 * 3)
        = 58.3%
*/


export function calculateSkillMatch(opportunity) {

  if (!opportunity) {
    return 0;
  }

  const requiredSkills =
    Array.isArray(opportunity.skills)
      ? opportunity.skills
      : Array.isArray(opportunity.skillRequirements)
        ? opportunity.skillRequirements
        : [];

  if (requiredSkills.length === 0) {
    return 0;
  }


  const studentSkillMap =
    new Map(
      studentSkills.map((skill) => [
        skill.name.toLowerCase().trim(),
        Number(skill.score) || 0,
      ])
    );


  let totalScore = 0;


  requiredSkills.forEach((skill) => {

    const skillName =
      typeof skill === "string"
        ? skill
        : skill?.name;

    if (!skillName) {
      return;
    }


    const studentScore =
      studentSkillMap.get(
        skillName.toLowerCase().trim()
      ) || 0;


    totalScore += Math.min(
      studentScore,
      100
    );

  });


  const percentage =
    (totalScore / (requiredSkills.length * 100)) * 100;


  return Math.round(
    Math.max(0, Math.min(100, percentage))
  );
}


/*
  Return a readable label for the match.
*/

export function getMatchLabel(match) {

  if (match >= 80) {
    return "Strong Match";
  }

  if (match >= 60) {
    return "Good Match";
  }

  if (match >= 40) {
    return "Partial Match";
  }

  return "Skill Gap";
}


/*
  Return the student's missing skills
  for a particular opportunity.
*/

export function getMissingSkills(opportunity) {

  if (!opportunity) {
    return [];
  }


  const requiredSkills =
    Array.isArray(opportunity.skills)
      ? opportunity.skills
      : Array.isArray(opportunity.skillRequirements)
        ? opportunity.skillRequirements
        : [];


  const studentSkillNames =
    new Set(
      studentSkills.map(
        (skill) =>
          skill.name.toLowerCase().trim()
      )
    );


  return requiredSkills
    .map((skill) =>
      typeof skill === "string"
        ? skill
        : skill?.name
    )
    .filter(Boolean)
    .filter(
      (skillName) =>
        !studentSkillNames.has(
          skillName.toLowerCase().trim()
        )
    );
}