async function getUserData() {
  const input = document.getElementById("inputUser").value;

  try {
    const response = await fetch(`https://api.github.com/users/${input}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.statusText}`);
    }

    const data = await response.json();
    setUserData(data);
  } catch (error) {
    console.error("Error in getUserData", error);
  }
}

function setUserData(data) {
  try {
    const img = document.getElementById("profileImage");
    const name = document.querySelector("#details h1");
    const bio = document.querySelector("#details p");
    const twitter = document.querySelector("#details .twitter");
    const anchor = document.getElementById("anchor");
    const location = document.getElementById("location");

    img.setAttribute("src", data.avatar_url);
    name.textContent = data.name;
    bio.textContent = data.bio || "N/A";
    location.textContent = data.location || "N/A";
    anchor.setAttribute("href", data.html_url);
    anchor.textContent = "View Profile";
    twitter.textContent = `@${data.twitter_username || "N/A"}`;
    twitter.setAttribute("href", `https://x.com/${data.twitter_username}`);

    const paginationList = document.getElementById("paginationList");
    for (let i = 1; i <= 10; i++) {
      var listItem = document.createElement("li");
      listItem.textContent = i;
      paginationList.appendChild(listItem);

      listItem.addEventListener("click", () => {
        clearRepoData();
        getRepoData(
          `https://api.github.com/users/${data.login}/repos?page=${i}&per_page=10`
        );
      });
    }
  } catch (error) {
    console.error("Error: in setUserData", error);
  }
}

async function getRepoData(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch repo data: ${response.statusText}`);
    }

    const allRepoData = await response.json();

    console.log(allRepoData);
    setRepoData(allRepoData);
  } catch (error) {
    console.error("Error in getRepoData", error);
  }
}

function setRepoData(data) {
  try {
    const allRepoSection = document.getElementById("allrepo");

    data.forEach((repo) => {
      const mainElement = document.createElement("main");

      mainElement.innerHTML = `
        <main id="repo">  
          <h4>${repo.name}</h4>
          <p>${repo.description || "No Description available"}</p>
          <h6 id="langs">${
            repo.language ? ` ${repo.language}` : "No language available"
          }</h6>
        </main>
      `;
      allRepoSection.appendChild(mainElement);
    });
  } catch (error) {
    console.error("Error: in setRepoData", error);
  }
}

// Function to clear previous repo data
function clearRepoData() {
  const allRepoSection = document.getElementById("allrepo");
  allRepoSection.innerHTML = "";
}
