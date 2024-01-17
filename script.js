var repo_url;

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
    bio.textContent = data.bio;
    location.textContent = data.location;
    anchor.setAttribute("href", data.html_url);
    anchor.textContent = "View Profile";
    twitter.textContent = `@${data.twitter_username || "N/A"}`;
    twitter.setAttribute("href", `https://x.com/${data.twitter_username}`);

    // Clear previous repo data before fetching new data
    clearRepoData();

    // Corrected property name from data.repo_url to data.repos_url
    handleUrlPagination(data.repos_url, 1);

    const paginationList = document.getElementById("paginationList");
    for (let i = 1; i <= 10; i++) {
      var listItem = document.createElement("li");
      listItem.textContent = i;
      paginationList.appendChild(listItem);

      // Use a function to capture the current value of i
      listItem.addEventListener(
        "click",
        ((index) => () => {
          repo_url = data.repos_url;
          handleUrlPagination(repo_url, index);
        })(i)
      );
    }
  } catch (error) {
    console.error("Error: in setUserData", error);
  }
}

function handleUrlPagination(url, Index) {
  return url + `?per_page=10&page=${Index || 1}`;
}

async function getRepoData() {
  try {
    const response = await fetch(handleUrlPagination(repo_url));

    if (!response.ok) {
      throw new Error(`Failed to fetch repo data: ${response.statusText}`);
    }

    const allRepoData = await response.json();

    setRepoData(allRepoData);
    console.log(allRepoData);
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
      <main
      id="repo"
      >  
      <h4>${repo.name}</h4>
        <p>${repo.description || "No Description available"}</p>
        <h6
        id="langs"
        >${repo.language ? ` ${repo.language}` : "No language available"}</h6>
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
