import re

from sqlalchemy.orm import Session

from app.models.skill import Skill


# Common variations used in resumes.
# Keys must match the canonical skill names stored in the database.
SKILL_ALIASES = {
    "Machine Learning": [
        "ml",
        "machine-learning",
        "machine learning",
        "machine learning algorithms",
        "machine learning models",
        "ml models",
    ],
    "Power BI": [
        "powerbi",
        "power-bi",
        "power bi",
        "microsoft power bi",
    ],
    "Python": [
        "python",
        "python programming",
        "python programming language",
    ],
    "SQL": [
        "sql",
        "structured query language",
        "sql programming",
    ],
    "Communication": [
        "communication",
        "communication skills",
        "verbal communication",
        "written communication",
    ],
}


def extract_text_from_file(file_path: str) -> str:
    """
    Extract readable text from PDF or DOCX files.
    """

    if file_path.lower().endswith(".pdf"):
        from pypdf import PdfReader

        reader = PdfReader(file_path)

        text = []

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text.append(page_text)

        return "\n".join(text)

    elif file_path.lower().endswith(".docx"):
        from docx import Document

        document = Document(file_path)

        return "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

    else:
        raise ValueError(
            "Unsupported file type. Only PDF and DOCX files are supported."
        )


def normalize_text(text: str) -> str:
    """
    Normalize text so that small formatting differences
    do not prevent skill detection.
    """

    text = text.lower()

    # Normalize common separators.
    text = text.replace("-", " ")
    text = text.replace("_", " ")

    # Keep letters, numbers, +, # and periods.
    text = re.sub(r"[^a-z0-9+#.\s]", " ", text)

    # Remove repeated whitespace.
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def phrase_exists(text: str, phrase: str) -> bool:
    """
    Safely check whether a complete phrase exists in text.
    """

    normalized_phrase = normalize_text(phrase)

    if not normalized_phrase:
        return False

    pattern = (
        r"(?<!\w)"
        + re.escape(normalized_phrase)
        + r"(?!\w)"
    )

    return re.search(pattern, text) is not None


def get_skill_aliases(skill_name: str) -> list[str]:
    """
    Return known variations for a canonical skill.
    """

    aliases = SKILL_ALIASES.get(skill_name, [])

    # Always include the canonical skill name.
    if skill_name not in aliases:
        aliases = [skill_name] + aliases

    return aliases


def calculate_confidence(
    skill_name: str,
    matched_phrase: str,
) -> float:
    """
    Assign a lightweight confidence score.

    Exact canonical skill name receives the highest confidence.
    Known aliases receive slightly lower confidence.
    """

    canonical = normalize_text(skill_name)
    matched = normalize_text(matched_phrase)

    if matched == canonical:
        return 0.98

    # Short acronyms such as ML are less explicit.
    if len(matched) <= 3:
        return 0.88

    return 0.94


def extract_skills(
    db: Session,
    text: str,
):
    """
    Detect skills from resume text using the central
    database skill taxonomy and known NLP-style variations.
    """

    normalized_text = normalize_text(text)

    skills = (
        db.query(Skill)
        .order_by(Skill.name)
        .all()
    )

    detected_skills = []

    for skill in skills:

        skill_name = skill.name.strip()

        if not skill_name:
            continue

        aliases = get_skill_aliases(skill_name)

        matched_phrase = None

        for alias in aliases:

            if phrase_exists(normalized_text, alias):
                matched_phrase = alias
                break

        if matched_phrase:

            confidence = calculate_confidence(
                skill_name,
                matched_phrase,
            )

            source = (
                "exact_match"
                if normalize_text(matched_phrase)
                == normalize_text(skill_name)
                else "alias_match"
            )

            detected_skills.append(
                {
                    "id": skill.id,
                    "name": skill.name,
                    "category": skill.category,
                    "confidence": confidence,
                    "matched_phrase": matched_phrase,
                    "source": source,
                }
            )

    return detected_skills