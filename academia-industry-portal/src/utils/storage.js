export function saveAssessmentResults(results) {
  localStorage.setItem(
    "assessmentResults",
    JSON.stringify(results)
  );
}

export function getAssessmentResults() {
  const results = localStorage.getItem("assessmentResults");

  if (!results) {
    return null;
  }

  return JSON.parse(results);
}

export function saveApplications(applications) {
  localStorage.setItem(
    "applications",
    JSON.stringify(applications)
  );
}

export function getApplications() {
  const applications = localStorage.getItem("applications");

  if (!applications) {
    return [];
  }

  return JSON.parse(applications);
}

export function saveProfile(profile) {
  localStorage.setItem(
    "studentProfile",
    JSON.stringify(profile)
  );
}

export function getProfile() {
  const profile = localStorage.getItem("studentProfile");

  if (!profile) {
    return null;
  }

  return JSON.parse(profile);
}


export function savePortfolio(portfolio) {
  localStorage.setItem(
    "studentPortfolio",
    JSON.stringify(portfolio)
  );
}

export function getPortfolio() {
  const portfolio = localStorage.getItem(
    "studentPortfolio"
  );

  if (!portfolio) {
    return {
      projects: [],
      certifications: [],
      achievements: []
    };
  }

  return JSON.parse(portfolio);
}

export function saveCompany(company) {
  localStorage.setItem(
    "industryCompany",
    JSON.stringify(company)
  );
}

export function getCompany() {
  const company = localStorage.getItem(
    "industryCompany"
  );

  if (!company) {
    return null;
  }

  return JSON.parse(company);
}

export function saveIndustryOpportunities(opportunities) {
  localStorage.setItem(
    "industryOpportunities",
    JSON.stringify(opportunities)
  );
}

export function getIndustryOpportunities() {
  const opportunities = localStorage.getItem(
    "industryOpportunities"
  );

  if (!opportunities) {
    return [];
  }

  return JSON.parse(opportunities);
}