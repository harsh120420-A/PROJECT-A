from sqlalchemy.orm import Session

from app.models.skill import Skill
from app.models.student_skill import StudentSkill
from app.models.opportunity import Opportunity
from app.models.opportunity_skill import OpportunitySkill
from app.models import (
    Skill,
    StudentSkill,
    Opportunity,
    OpportunitySkill,
    LearningResource,
    StudentLearning,
)

def generate_student_recommendations(
    db: Session,
    student_id: int,
):
    """
    Generate personalized recommendations for a student
    using current skill scores, skill gaps, and industry demand.

    This is a rule-based intelligence layer.
    It will later become the foundation for ML-based recommendations.
    """

    # ---------------------------------------------------------
    # 1. Load student skills
    # ---------------------------------------------------------

    student_skills = (
        db.query(StudentSkill, Skill)
        .join(Skill, StudentSkill.skill_id == Skill.id)
        .filter(StudentSkill.student_id == student_id)
        .all()
    )

    student_skill_map = {
        skill.id: {
            "id": skill.id,
            "name": skill.name,
            "category": skill.category,
            "score": student_skill.score or 0,
        }
        for student_skill, skill in student_skills
    }

    # ---------------------------------------------------------
    # 2. Load active opportunities
    # ---------------------------------------------------------

    opportunities = (
        db.query(Opportunity)
        .filter(Opportunity.status == "Active")
        .all()
    )

    # ---------------------------------------------------------
    # 3. Calculate industry demand for every skill
    # ---------------------------------------------------------

    demand_map = {}

    for opportunity in opportunities:

        opportunity_skills = (
            db.query(OpportunitySkill)
            .filter(
                OpportunitySkill.opportunity_id
                == opportunity.id
            )
            .all()
        )

        for opportunity_skill in opportunity_skills:

            skill_id = opportunity_skill.skill_id

            if skill_id not in demand_map:
                demand_map[skill_id] = {
                    "opportunity_count": 0,
                    "highest_required_score": 0,
                }

            demand_map[skill_id]["opportunity_count"] += 1

            required_score = (
                opportunity_skill.required_score or 50
            )

            demand_map[skill_id]["highest_required_score"] = max(
                demand_map[skill_id]["highest_required_score"],
                required_score,
            )

    # ---------------------------------------------------------
    # 4. Skill recommendations
    # ---------------------------------------------------------

    skill_recommendations = []

    for skill_id, demand in demand_map.items():

        skill = db.query(Skill).filter(
            Skill.id == skill_id
        ).first()

        if not skill:
            continue

        current_score = student_skill_map.get(
            skill_id,
            {}
        ).get("score", 0)

        required_score = demand["highest_required_score"]

        # Ignore skills where the student is already strong
        if current_score >= 70:
            continue

        gap = max(
            0,
            required_score - current_score
        )

        demand_count = demand["opportunity_count"]

        # Priority:
        # 60% skill gap
        # 40% industry demand
        gap_component = min(gap, 100)

        demand_component = min(
            demand_count * 20,
            100
        )

        recommendation_score = round(
            gap_component * 0.6
            + demand_component * 0.4
        )

        if recommendation_score >= 70:
            priority = "High"
        elif recommendation_score >= 40:
            priority = "Medium"
        else:
            priority = "Low"

        skill_recommendations.append(
            {
                "skill_id": skill.id,
                "skill": skill.name,
                "category": skill.category,
                "current_score": current_score,
                "required_score": required_score,
                "gap": gap,
                "industry_demand": demand_count,
                "recommendation_score": recommendation_score,
                "priority": priority,
                "reason": (
                    f"Your current {skill.name} score is "
                    f"{current_score}%, while relevant "
                    f"opportunities require around "
                    f"{required_score}%. "
                    f"{demand_count} active opportunity(s) "
                    f"currently require this skill."
                ),
            }
        )

    # Highest priority first
    skill_recommendations.sort(
        key=lambda item: item["recommendation_score"],
        reverse=True,
    )

    # ---------------------------------------------------------
    # 5. Opportunity recommendations
    # ---------------------------------------------------------

    opportunity_recommendations = []

    for opportunity in opportunities:

        required_skills = (
            db.query(OpportunitySkill, Skill)
            .join(
                Skill,
                OpportunitySkill.skill_id == Skill.id
            )
            .filter(
                OpportunitySkill.opportunity_id
                == opportunity.id
            )
            .all()
        )

        if not required_skills:
            continue

        total_weight = 0
        weighted_score = 0

        missing = []
        partial = []

        for opportunity_skill, skill in required_skills:

            required_score = (
                opportunity_skill.required_score or 50
            )

            current_score = student_skill_map.get(
                skill.id,
                {}
            ).get("score", 0)

            weight = max(required_score, 1)

            skill_match = min(
                current_score / weight * 100,
                100,
            )

            weighted_score += skill_match * weight
            total_weight += weight

            if current_score >= required_score:
                continue

            if current_score > 0:
                partial.append(
                    {
                        "skill_id": skill.id,
                        "skill": skill.name,
                        "current_score": current_score,
                        "required_score": required_score,
                    }
                )
            else:
                missing.append(
                    {
                        "skill_id": skill.id,
                        "skill": skill.name,
                        "required_score": required_score,
                    }
                )

        match_score = (
            round(weighted_score / total_weight)
            if total_weight
            else 0
        )

        if match_score >= 85:
            level = "Excellent"
        elif match_score >= 70:
            level = "Good"
        elif match_score >= 50:
            level = "Partial"
        else:
            level = "Low"

        opportunity_recommendations.append(
            {
                "opportunity_id": opportunity.id,
                "title": opportunity.title,
                "type": opportunity.type,
                "location": opportunity.location,
                "mode": opportunity.mode,
                "match_score": match_score,
                "match_level": level,
                "missing_skills": missing,
                "partial_skills": partial,
            }
        )

    opportunity_recommendations.sort(
        key=lambda item: item["match_score"],
        reverse=True,
    )

        # ---------------------------------------------------------
    # 6. Learning recommendations
    # ---------------------------------------------------------

    progress_records = (
        db.query(StudentLearning)
        .filter(
            StudentLearning.student_id == student_id
        )
        .all()
    )

    progress_map = {
        record.resource_id: record
        for record in progress_records
    }

    learning_resources = (
        db.query(
            LearningResource,
            Skill,
        )
        .join(
            Skill,
            LearningResource.skill_id == Skill.id,
        )
        .all()
    )

    learning_recommendations = []

    for resource, skill in learning_resources:

        current_score = student_skill_map.get(
            skill.id,
            {}
        ).get("score", 0)

        demand = demand_map.get(
            skill.id,
            {}
        )

        industry_demand = demand.get(
            "opportunity_count",
            0
        )

        required_score = demand.get(
            "highest_required_score",
            70
        )

        # ---------------------------------------------
        # Ignore resources for already strong skills
        # ---------------------------------------------

        if current_score >= 70 and industry_demand == 0:
            continue

        # ---------------------------------------------
        # Calculate skill gap
        # ---------------------------------------------

        gap = max(
            0,
            required_score - current_score
        )

        # ---------------------------------------------
        # Learning priority
        # ---------------------------------------------

        gap_component = min(
            gap,
            100
        )

        demand_component = min(
            industry_demand * 20,
            100
        )

        recommendation_score = round(
            gap_component * 0.6
            + demand_component * 0.4
        )

        if recommendation_score >= 70:
            priority = "High Priority"

        elif recommendation_score >= 40:
            priority = "Recommended"

        else:
            priority = "Optional"

        # ---------------------------------------------
        # Existing learning progress
        # ---------------------------------------------

        progress_record = progress_map.get(
            resource.id
        )

        if progress_record:

            status = progress_record.status
            progress = progress_record.progress

        else:

            status = "Not Started"
            progress = 0

        # ---------------------------------------------
        # Add recommendation
        # ---------------------------------------------

        learning_recommendations.append(
            {
                "resource_id": resource.id,
                "title": resource.title,
                "description": resource.description,
                "provider": resource.provider,
                "difficulty": resource.difficulty,
                "duration": resource.duration,
                "url": resource.url,

                "skill_id": skill.id,
                "skill": skill.name,
                "skill_category": skill.category,

                "current_score": current_score,
                "target_score": required_score,
                "skill_gap": gap,
                "industry_demand": industry_demand,

                "recommendation_score":
                    recommendation_score,

                "priority": priority,

                "status": status,
                "progress": progress,

                "reason": (
                    f"This resource helps improve "
                    f"{skill.name}. Your current score "
                    f"is {current_score}%, while relevant "
                    f"opportunities require around "
                    f"{required_score}%. "
                    f"{industry_demand} active "
                    f"opportunity(s) require this skill."
                ),
            }
        )

    # ---------------------------------------------
    # Sort learning recommendations
    # ---------------------------------------------

    learning_recommendations.sort(
        key=lambda item: (
            item["recommendation_score"],
            1 if item["status"] == "In Progress" else 0,
            -item["progress"],
        ),
        reverse=True,
    )
    
    # ---------------------------------------------------------
    # 6. Summary
    # ---------------------------------------------------------

    return {
        "student_id": student_id,

        "summary": {
            "skills_analyzed": len(student_skill_map),

            "priority_skills": len(
                skill_recommendations
            ),

            "opportunities_analyzed": len(
                opportunities
            ),

            "recommended_opportunities": len(
                [
                    item
                    for item in opportunity_recommendations
                    if item["match_score"] >= 50
                ]
            ),

            "learning_resources_analyzed": len(
                learning_resources
            ),

            "recommended_learning_resources": len(
                [
                    item
                    for item in learning_recommendations
                    if item["recommendation_score"] >= 40
                ]
            ),
        },

        "skill_recommendations":
            skill_recommendations[:10],

        "opportunity_recommendations":
            opportunity_recommendations[:10],

        "learning_recommendations":
            learning_recommendations[:10],
    }