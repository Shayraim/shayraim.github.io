fetch("data.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("tierlist");

    for (const tier in data) {
      // Bloc du tier
      const tierDiv = document.createElement("div");
      tierDiv.classList.add("tier");

      // Add color class based on tier name
      let tierClass = "";
      switch (tier) {
        case "Greatest players in YBA history":
          tierClass = "tier-greatest";
          break;
        case "SSS (The Apex Predators)":
          tierClass = "tier-sss";
          break;
        case "SS":
          tierClass = "tier-ss";
          break;
        case "S+":
          tierClass = "tier-splus";
          break;
        case "S":
          tierClass = "tier-s";
          break;
        case "A+":
          tierClass = "tier-aplus";
          break;
        case "A":
            tierClass = "tier-a";
          break;
        case "B":
          tierClass = "tier-b";
          break;
        case "C":
          tierClass = "tier-c";
          break;
        case "D":
          tierClass = "tier-d";
          break;
        default:
          tierClass = "tier";
      }
      tierDiv.classList.add(tierClass);

      // Titre du tier
      const title = document.createElement("h2");
      title.innerText = tier;
      tierDiv.appendChild(title);

      // Joueurs
      const playersDiv = document.createElement("div");
      playersDiv.classList.add("players");

      data[tier].forEach(name => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("player");
        playerDiv.innerText = name;
        playersDiv.appendChild(playerDiv);
      });

      tierDiv.appendChild(playersDiv);
      container.appendChild(tierDiv);
    }
  });
