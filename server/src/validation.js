export function isValidUrl(value) {
  try {
    const url = new URL(value);
    const okProtocol = url.protocol === 'http:' || url.protocol === 'https:';
    const okHost = url.hostname === 'localhost' || url.hostname.includes('.');
    return okProtocol && okHost;
  } catch {
    return false;
  }
}

export function validateSubmission(body = {}) {
  const data = {
    name: String(body.name ?? '').trim(),
    registrationNumber: String(body.registrationNumber ?? '').trim(),
    assignmentTitle: String(body.assignmentTitle ?? '').trim(),
    submissionUrl: String(body.submissionUrl ?? '').trim(),
  };

  const errors = {};
  if (!data.name) errors.name = 'Name is required';
  // if (!data.registrationNumber) errors.registrationNumber = 'Registration number is required';
  if (!data.assignmentTitle) errors.assignmentTitle = 'Assignment title is required';
  if (!data.submissionUrl) errors.submissionUrl = 'Submission URL is required';
  else if (!isValidUrl(data.submissionUrl)) errors.submissionUrl = 'Submission URL is not a valid http(s) URL';

  return { valid: Object.keys(errors).length === 0, errors, data };
}