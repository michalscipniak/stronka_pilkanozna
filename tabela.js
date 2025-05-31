document.addEventListener('DOMContentLoaded', function () {
  const players = [
    { name: "Erling Haaland", team: "Manchester City", goals: 27, matches_goals: 31, assists: 5, matches_assists: 31, yellow: 3, red: 0, minutes: 2800 },
    { name: "Harry Kane", team: "Bayern Monachium", goals: 30, matches_goals: 30, assists: 6, matches_assists: 30, yellow: 2, red: 0, minutes: 2750 },
    { name: "Kylian Mbappé", team: "Paris SG", goals: 28, matches_goals: 32, assists: 4, matches_assists: 32, yellow: 1, red: 0, minutes: 2700 },
    { name: "Jude Bellingham", team: "Real Madrid", goals: 18, matches_goals: 27, assists: 6, matches_assists: 27, yellow: 5, red: 0, minutes: 2500 },
    { name: "Mohamed Salah", team: "Liverpool", goals: 17, matches_goals: 30, assists: 8, matches_assists: 30, yellow: 2, red: 0, minutes: 2600 },
    { name: "Victor Osimhen", team: "Napoli", goals: 15, matches_goals: 29, assists: 3, matches_assists: 29, yellow: 3, red: 0, minutes: 2400 },
    { name: "Phil Foden", team: "Manchester City", goals: 14, matches_goals: 31, assists: 9, matches_assists: 31, yellow: 1, red: 0, minutes: 2650 },
    { name: "Lautaro Martínez", team: "Inter Mediolan", goals: 21, matches_goals: 30, assists: 5, matches_assists: 30, yellow: 4, red: 0, minutes: 2700 },
    { name: "Vinícius Júnior", team: "Real Madrid", goals: 12, matches_goals: 26, assists: 7, matches_assists: 26, yellow: 4, red: 0, minutes: 2300 },
    { name: "Robert Lewandowski", team: "FC Barcelona", goals: 16, matches_goals: 30, assists: 5, matches_assists: 30, yellow: 2, red: 0, minutes: 2550 }
  ];

  const tbody = document.querySelector('#players-table tbody');

  players.forEach((player, index) => {
    const tr = document.createElement('tr');

    
    const goalsAvg = (player.goals / player.matches_goals).toFixed(2);
    const assistsAvg = (player.assists / player.matches_assists).toFixed(2);

    tr.innerHTML = `
      <td>${player.name}</td>
      <td>${player.team}</td>
      <td>${player.goals}</td>
      <td>${player.matches_goals}</td>
      <td>${goalsAvg}</td>
      <td>${player.assists}</td>
      <td>${player.matches_assists}</td>
      <td>${assistsAvg}</td>
      <td>${player.yellow}</td>
      <td>${player.red}</td>
      <td>${player.minutes}</td>
    `;

    tbody.appendChild(tr);
  });

  
  if (tbody.children.length >= 2) {
    const lastRow = tbody.children[tbody.children.length - 2];
    const secondLastCell = lastRow.children[0];
    secondLastCell.rowSpan = 2;
    tbody.children[tbody.children.length - 1].removeChild(tbody.children[tbody.children.length - 1].children[0]);
  }

  
  const rows = document.querySelectorAll('#players-table tbody tr');
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => row.classList.add('highlight'));
    row.addEventListener('mouseleave', () => row.classList.remove('highlight'));
  });
});
