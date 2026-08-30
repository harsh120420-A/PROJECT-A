const APPLICATIONS_KEY = "applications";


function getStoredApplications() {

  const stored =
    localStorage.getItem(APPLICATIONS_KEY);

  if (!stored) {
    return [];
  }

  try {

    return JSON.parse(stored);

  } catch {

    return [];

  }

}


function saveApplications(applications) {

  localStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify(applications)
  );

}


/*
 * Student applies to an opportunity
 */

export function applyToOpportunity(
  opportunity,
  studentId = 1
) {

  const applications =
    getStoredApplications();


  const alreadyApplied =
    applications.some(
      (application) =>
        application.opportunityId ===
          opportunity.id &&
        application.studentId ===
          studentId
    );


  if (alreadyApplied) {
    return false;
  }


  const application = {

    id: Date.now(),

    opportunityId:
      opportunity.id,

    opportunityTitle:
      opportunity.title,

    company:
      opportunity.company ||
      "Industry Partner",

    studentId,

    status:
      "Applied",

    appliedDate:
      new Date().toISOString(),

    updatedDate:
      new Date().toISOString(),

    matchScore:
      opportunity.match || 0

  };


  saveApplications([
    ...applications,
    application
  ]);


  return true;

}


/*
 * Get all applications
 */

export function getApplications() {

  return getStoredApplications();

}


/*
 * Get applications for one student
 */

export function getApplicationsForStudent(
  studentId = 1
) {

  return getStoredApplications()
    .filter(
      (application) =>
        application.studentId ===
        studentId
    );

}


/*
 * Get applications for an opportunity
 */

export function getApplicationsForOpportunity(
  opportunityId
) {

  return getStoredApplications()
    .filter(
      (application) =>
        application.opportunityId ===
        opportunityId
    );

}


/*
 * Update recruitment status
 */

export function updateApplicationStatus(
  applicationId,
  status
) {

  const applications =
    getStoredApplications();


  const updated =
    applications.map(
      (application) => {

        if (
          application.id !==
          applicationId
        ) {

          return application;

        }


        return {

          ...application,

          status,

          updatedDate:
            new Date().toISOString()

        };

      }
    );


  saveApplications(updated);

  return updated;

}


/*
 * Find one application
 */

export function getApplicationById(
  applicationId
) {

  return getStoredApplications()
    .find(
      (application) =>
        application.id ===
        applicationId
    );

}