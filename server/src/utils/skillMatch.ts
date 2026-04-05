/**
 * Calculates how well a user's skills match a job's required skills.
 * Returns a score from 0 to 100.
 */
export function calculateSkillMatch(
  userSkills: string[],
  jobSkills: string[]
): number {
  if (jobSkills.length === 0) return 0;

  // Normalize both arrays to lowercase for fair comparison
  const normalizedUser = userSkills.map(s => s.toLowerCase().trim());
  const normalizedJob  = jobSkills.map(s => s.toLowerCase().trim());

  // Find skills that match
  const matched = normalizedJob.filter(skill =>
    normalizedUser.includes(skill)
  );

  return Math.round((matched.length / normalizedJob.length) * 100);
}