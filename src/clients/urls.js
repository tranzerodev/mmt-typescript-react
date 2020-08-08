export const baseApiUrl =
  process.env.BASE_API_URL || 'https://api-staging.lightout.com';

export const apiUrls = {
  usersUrl: `${baseApiUrl}/users`,
  driversUrl: `${baseApiUrl}/drivers`,
  sessionsUrl: `${baseApiUrl}/sessions`,
  locationsUrl: `${baseApiUrl}/locations`,
};
