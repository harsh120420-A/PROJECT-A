import {
  getApplications,
  saveApplications
} from "./storage";

export function applyToOpportunity(job) {
  const applications = getApplications();

  const alreadyApplied = applications.some(
    (application) =>
      application.opportunityId === job.id
  );

  if (alreadyApplied) {
    return false;
  }

  const newApplication = {
    id: Date.now(),
    opportunityId: job.id,
    title: job.title,
    company: job.company,
    status: "Applied",
    appliedDate: new Date().toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    ),
  };

  saveApplications([
    ...applications,
    newApplication
  ]);

  return true;
}