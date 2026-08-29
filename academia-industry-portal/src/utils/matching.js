export function calculateMatch(studentSkills, requiredSkills) {
  if (!requiredSkills.length) {
    return 0;
  }

  let totalScore = 0;

  requiredSkills.forEach((requiredSkill) => {
    const studentSkill = studentSkills.find(
      (skill) =>
        skill.name.toLowerCase() === requiredSkill.toLowerCase()
    );

    if (studentSkill) {
      totalScore += studentSkill.score;
    }
  });

  return Math.round(
    totalScore / requiredSkills.length
  );
}

export function getMatchedSkills(studentSkills, requiredSkills) {
  return requiredSkills.filter((requiredSkill) => {
    const studentSkill = studentSkills.find(
      (skill) =>
        skill.name.toLowerCase() === requiredSkill.toLowerCase()
    );

    return studentSkill && studentSkill.score >= 50;
  });
}

export function getMissingSkills(studentSkills, requiredSkills) {
  return requiredSkills.filter((requiredSkill) => {
    const studentSkill = studentSkills.find(
      (skill) =>
        skill.name.toLowerCase() === requiredSkill.toLowerCase()
    );

    return !studentSkill || studentSkill.score < 50;
  });
}