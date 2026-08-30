export function calculateMatch(
  studentSkills,
  requiredSkills
) {

  if (
    !studentSkills ||
    !requiredSkills ||
    requiredSkills.length === 0
  ) {
    return 0;
  }


  let totalScore = 0;


  requiredSkills.forEach(
    (requiredSkill) => {

      const requiredName =
        typeof requiredSkill === "string"
          ? requiredSkill
          : requiredSkill.name;


      const requiredScore =
        typeof requiredSkill === "string"
          ? 50
          : Number(
              requiredSkill.requiredScore
            ) || 50;


      const studentSkill =
        studentSkills.find(
          (skill) =>
            skill.name
              .toLowerCase()
              .trim() ===
            requiredName
              .toLowerCase()
              .trim()
        );


      if (studentSkill) {

        const studentScore =
          Number(studentSkill.score) || 0;


        const contribution =
          Math.min(
            studentScore /
              requiredScore,
            1
          ) * 100;


        totalScore += contribution;

      }

    }
  );


  return Math.round(
    totalScore /
      requiredSkills.length
  );

}


export function getMatchedSkills(
  studentSkills,
  requiredSkills
) {

  if (
    !studentSkills ||
    !requiredSkills
  ) {
    return [];
  }


  return requiredSkills
    .map(
      (requiredSkill) => {

        const requiredName =
          typeof requiredSkill === "string"
            ? requiredSkill
            : requiredSkill.name;


        const requiredScore =
          typeof requiredSkill === "string"
            ? 50
            : Number(
                requiredSkill.requiredScore
              ) || 50;


        const studentSkill =
          studentSkills.find(
            (skill) =>
              skill.name
                .toLowerCase()
                .trim() ===
              requiredName
                .toLowerCase()
                .trim()
          );


        if (
          studentSkill &&
          Number(studentSkill.score) >=
            requiredScore
        ) {

          return requiredName;

        }

        return null;

      }
    )
    .filter(Boolean);

}


export function getMissingSkills(
  studentSkills,
  requiredSkills
) {

  if (
    !studentSkills ||
    !requiredSkills
  ) {
    return [];
  }


  return requiredSkills
    .map(
      (requiredSkill) => {

        const requiredName =
          typeof requiredSkill === "string"
            ? requiredSkill
            : requiredSkill.name;


        const requiredScore =
          typeof requiredSkill === "string"
            ? 50
            : Number(
                requiredSkill.requiredScore
              ) || 50;


        const studentSkill =
          studentSkills.find(
            (skill) =>
              skill.name
                .toLowerCase()
                .trim() ===
              requiredName
                .toLowerCase()
                .trim()
          );


        if (
          !studentSkill ||
          Number(studentSkill.score) <
            requiredScore
        ) {

          return requiredName;

        }

        return null;

      }
    )
    .filter(Boolean);

}


export function getSkillGapDetails(
  studentSkills,
  requiredSkills
) {

  if (
    !studentSkills ||
    !requiredSkills
  ) {
    return [];
  }


  return requiredSkills.map(
    (requiredSkill) => {

      const requiredName =
        typeof requiredSkill === "string"
          ? requiredSkill
          : requiredSkill.name;


      const requiredScore =
        typeof requiredSkill === "string"
          ? 50
          : Number(
              requiredSkill.requiredScore
            ) || 50;


      const studentSkill =
        studentSkills.find(
          (skill) =>
            skill.name
              .toLowerCase()
              .trim() ===
            requiredName
              .toLowerCase()
              .trim()
        );


      const studentScore =
        studentSkill
          ? Number(studentSkill.score) || 0
          : 0;


      return {

        skill: requiredName,

        requiredScore,

        studentScore,

        gap: Math.max(
          requiredScore -
            studentScore,
          0
        ),

        meetsRequirement:
          studentScore >=
          requiredScore

      };

    }
  );

}