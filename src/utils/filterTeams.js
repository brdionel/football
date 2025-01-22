// src/utils/filterTeams.js
export const filterTeams = (teams, filters) => {
  return teams.filter(team => {
    const byCountry = filters.country ? team.country === filters.country : true;
    const byLeague = filters.league ? team.league === filters.league : true;
    const byTitles = filters.titles ? team.titles >= filters.titles : true;
    const byColors = filters.colors.length > 0
      ? filters.colors.some(color => team.colors.includes(color))
      : true;

    return byCountry && byLeague && byTitles && byColors;
  });
};
