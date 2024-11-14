(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // worker.js
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  async function handleRequest(request) {
    const url = new URL(request.url);
    if (url.pathname === "/data.json") {
      return await fetchData();
    }
    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
  __name(handleRequest, "handleRequest");
  async function fetchData() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/weiiiiiu/some-stars/main/data.json");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      return response;
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  __name(fetchData, "fetchData");
  var html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Github Star \u5BFC\u822A</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/gh/weiiiiiu/Better_Alist@main/alist.css" rel="stylesheet" type="text/css">
    <style>
      .container { margin: 0 auto; max-width: 1800px; padding: 0 20px; overflow-x: hidden; }
      #language-select { width: 100%; max-width: 200px; padding: 8px; border-radius: 8px; border: 1px solid rgba(226, 232, 240, 0.8); background-color: rgba(255, 255, 255, 0.7); margin-right: 10px; }
      #main-content { width: 100%; padding: 20px 0; }
      .repo-card { width: 250px; height: 300px; display: flex; flex-direction: column; align-items: center; background-color: rgba(255, 255, 255, 0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 20px; transition: transform 0.2s, box-shadow 0.2s; border: 1px solid rgba(226, 232, 240, 0.8); cursor: pointer; }
      .repo-card-image { width: 100%; height: 100px; object-fit: contain; background-color: rgba(255, 255, 255, 0.8); margin-bottom: 10px; border-radius: 5px; } /* Image on top */
      @media (max-width: 768px) {
        .repo-card { width: 100%; max-width: 250px; height: 200px; }
        .container { padding: 0 10px; }
      }
      .highlight { background-color: rgba(255, 255, 0, 0.5); }
      .sticky-header { position: fixed; top: 0; left: 0; right: 0; z-index: 10; background-color: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); border-bottom: 1px solid rgba(226, 232, 240, 0.8); }
      .search-container { display: none; position: fixed; top: 80px; left: 50%; transform: translateX(-50%); z-index: 100; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 15px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); align-items: center; gap: 10px; }
      #search { width: 150px; padding: 8px; border-radius: 8px; border: 1px solid rgba(226, 232, 240, 0.8); background-color: rgba(255, 255, 255, 0.7); transition: all 0.3s ease; }
      @media (max-width: 640px) {
        .search-container { width: 90%; flex-wrap: wrap; justify-content: center; }
        #search, #language-select { width: 100%; max-width: none; margin: 5px 0; }
      }
      .repo-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); }
      #language-select:hover, #search:hover { border-color: #4299e1; box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1); }
      #language-select:focus, #search:focus { outline: none; border-color: #4299e1; box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2); }
      .category h2 { position:relative; padding-bottom: 0.5rem; margin-bottom: 1.5rem; color: #1e40af; font-weight: 700; }
      .category h2::after { content: ''; position: absolute; bottom: 0; left: 0; width: 50px; height: 3px; background: linear-gradient(90deg, #4299e1, #667eea); border-radius: 3px; }
      header h1 a { background: linear-gradient(45deg, #2563eb, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700; }
      .repo-card h3 a { color: #1e40af; transition: color 0.2s; }
      .repo-card h3 a:hover { color: #3b82f6; }
      .repo-card .description { color: #475569; }
      .repo-card .text-gray-600 a { color: #64748b; transition: color 0.2s; }
      .repo-card .text-gray-600 a:hover { color: #3b82f6; }
      .repo-card .bg-blue-100 { background-color: rgba(59, 130, 246, 0.1); color: #1e40af; }
      #search, #language-select { color: #334155; }
      #search::placeholder { color: #94a3b8; }
      .repo-details-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: none; justify-content: center; align-items: center; z-index: 1000; }
      .repo-details-modal-content { background: white; border-radius: 20px; max-width: 600px; width: 90%; padding: 30px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); position: relative; }
      .repo-details-modal-close { position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 24px; color: #718096; }
    </style>
    <script src="https://cdn.jsdelivr.net/gh/TheSmallHanCat/Better_Alist@main/jq.js"><\/script>
  </head>
  <body class="bg-gray-100">
    <div class="st-Container">
      <a style='display:none' class="st-Menu closed" id="st-Menu" href="javascript:void(0);"></a>
    </div>
    <div class="sw-Hennnyano" id="sw-Hennnyano">
      <div class="layer body w100" data-depth="0.1"></div>
      <div the "layer eyes w100" data-depth="0.2"></div>
    </div>
    <header class="sticky-header flex justify-between items-center px-4 py-2 shadow-md">
      <h1 class="text-xl md:text-2xl font-bold">
        <a href="/">Github Star \u5BFC\u822A</a>
      </h1>
      <div class="flex items-center">
        <select id="language-select" class="text-sm md:text-base mr-4">
          <option value="">\u9009\u62E9\u8BED\u8A00</option>
        </select>
        <input id="search" type="text" placeholder="\u641C\u7D22..." class="text-sm md:text-base w-40" />
      </div>
    </header>
    <div class="container mx-auto py-16">
      <div id="main-content">
        <div id="categories-container"></div>
      </div>
    </div>
    <div id="repo-details-modal" class="repo-details-modal">
      <div class="repo-details-modal-content">
        <span class="repo-details-modal-close">&times;</span>
        <div id="repo-details-content"></div>
      </div>
    </div>
    <div id="jsi-flying-fish-container" the "fish-container"></div>
    <script>
      async function fetchData() {
        try {
          const response = await fetch("/data.json");
          if (!response.ok) throw new Error('Failed to fetch data');
          return response.json();
        } catch (error) {
          console.error('Error fetching data:', error);
          return {};
        }
      }

      function generateHTML(data) {
        const repoCardsHtml = (repos) => repos
          .map((repo) => {
            const truncatedDescription = repo.description && repo.description.length > 50 
              ? repo.description.slice(0, 50) + "..." 
              : repo.description;
            return \`
              <div class="repo-card shadow-md overflow-hidden flex m-2" data-repo='\${JSON.stringify(repo)}'>
                <img src="\${repo.owner.avatar_url}" alt="\${repo.owner.login}" class="repo-card-image" style="background-color: rgba(255, 255, 255, 0.8);"> <!-- Image on top -->
                <div class="p-4 flex-grow flex flex-col">
                  <div class="mb-4">
                    <h3 class="text-lg font-bold text-blue-600 truncate">
                      <a href="https://github.com/\${repo.full_name}" target="_blank">\${repo.name}</a>
                    </h3>
                    <p class="text-sm text-gray-600 truncate mb-2">
                      <a href="https://github.com/\${repo.owner.login}" target="_blank">\${repo.owner.login}</a>
                    </p>
                    <p class="text-sm text-gray-700 line-clamp-2">\${truncatedDescription}</p>
                  </div>
                  <div class="mt-auto">
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Stars: \${repo.stargazers_count}
                    </span>
                  </div>
                </div>
              </div>\`;
          })
          .join("");

        const categoriesHtml = Object.keys(data)
          .map(language => \`
            <div id="\${language}" class="mb-8 category">
              <h2 class="text-xl font-bold mb-4">\${language}</h2>
              <div class="flex flex-wrap justify-center">
                \${repoCardsHtml(data[language])}
              </div>
            </div>\`)
          .join("");

        const languageSelect = document.getElementById("language-select");
        Object.keys(data).forEach(language => {
          const option = document.createElement("option");
          option.value = language;
          option.textContent = language;
          languageSelect.appendChild(option);
        });

        document.getElementById("categories-container").innerHTML = categoriesHtml;
      }

      document.addEventListener("DOMContentLoaded", async function () {
        const searchInput = document.getElementById("search");
        const languageSelect = document.getElementById("language-select");
        const categoriesContainer = document.getElementById("categories-container");
        const repoDetailsModal = document.getElementById("repo-details-modal");
        const repoDetailsContent = document.getElementById("repo-details-content");
        const repoDetailsModalClose = document.querySelector(".repo-details-modal-close");
        const data = await fetchData();
        generateHTML(data);

        // \u6DFB\u52A0\u5361\u7247\u70B9\u51FB\u4E8B\u4EF6
        categoriesContainer.addEventListener('click', function(event) {
          const repoCard = event.target.closest('.repo-card');
          if (repoCard) {
            const repoData = JSON.parse(repoCard.dataset.repo);
            repoDetailsContent.innerHTML = \`
              <div class="text-center">
                <img src="\${repoData.owner.avatar_url}" alt="\${repoData.owner.login}" class="mx-auto mb-4" style="width: 100px; height: 100px; object-fit: contain; background-color: rgba(255, 255, 255, 0.8); border-radius: 10px;">
                <h2 class="text-2xl font-bold mb-2">\${repoData.name}</h2>
                <p class="text-gray-600 mb-4">
                  <a href="https://github.com/\${repoData.owner.login}" target="_blank">\${repoData.owner.login}</a>
                </p>
                <p class="text-gray-700 mb-4">\${repoData.description || '\u6682\u65E0\u63CF\u8FF0'}</p>
                <div class="flex justify-center space-x-4">
                  <a href="https://github.com/\${repoData.full_name}" target="_blank" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    \u67E5\u770B\u4ED3\u5E93
                  </a>
                  <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded">
                    Stars: \${repoData.stargazers_count}
                  </span>
                </div>
              </div>
            \`;
            repoDetailsModal.style.display = 'flex';
          }
        });

        // \u5173\u95ED\u6A21\u6001\u6846
        repoDetailsModalClose.addEventListener('click', function() {
          repoDetailsModal.style.display = 'none';
        });

        // \u70B9\u51FB\u6A21\u6001\u6846\u5916\u90E8\u5173\u95ED
        repoDetailsModal.addEventListener('click', function(event) {
          if (event.target === repoDetailsModal) {
            repoDetailsModal.style.display = 'none';
          }
        });

        languageSelect.addEventListener("change", function() {
          const selectedLanguage = this.value;
          if (selectedLanguage) {
            document.getElementById(selectedLanguage)?.scrollIntoView({ behavior: "smooth" });
          }
        });

        function searchRepositories(query) {
          const normalizedQuery = query.toLowerCase();
          return Object.values(data)
            .flat()
            .filter(repo => 
              repo.full_name.toLowerCase().includes(normalizedQuery) ||
              (repo.description && repo.description.toLowerCase().includes(normalizedQuery)) ||
              (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(normalizedQuery)))
            );
        }

        function escapeRegExp(string) {
          return string.replace(/[$()*+?.^{}|[\\]\\\\]/g, '\\\\$&');
        }

        function highlightText(text, query) {
          if (!text) return '';
          const escapedQuery = escapeRegExp(query);
          return text.replace(new RegExp(escapedQuery, "gi"), match => \`<span class="highlight">\${match}</span>\`);
        }

        searchInput.addEventListener("input", function () {
          const query = this.value.trim();
          if (query) {
            const matchedRepos = searchRepositories(query);
            categoriesContainer.innerHTML = \`
              <div class="mb-8">
                <h2 class="text-xl font-bold mb-4">\u641C\u7D22\u7ED3\u679C</h2>
                <div class="flex flex-wrap justify-center">
                  \${matchedRepos.map(repo => {
                    const truncatedDescription = repo.description && repo.description.length > 50 
                      ? repo.description.slice(0, 50) + "..." 
                      : repo.description;
                    return \`
                      <div class="repo-card shadow-md overflow-hidden flex m-2" data-repo='\${JSON.stringify(repo)}'>
                        <img src="\${repo.owner.avatar_url}" alt="\${repo.owner.login}" class="repo-card-image" style="background-color: rgba(255, 255, 255, 0.8);"> <!-- Image on top -->
                        <div class="p-4 flex-grow flex flex-col">
                          <div class="mb-4">
                            <h3 class="text-lg font-bold text-blue-600 truncate">
                              <a href="https://github.com/\${repo.full_name}" target="_blank">\${highlightText(repo.name, query)}</a>
                            </h3>
                            <p class="text-sm text-gray-600 truncate mb-2">
                              <a href="https://github.com/\${repo.owner.login}" target="_blank">\${highlightText(repo.owner.login, query)}</a>
                            </p>
                            <p class="text-sm text-gray-700 line-clamp-2">
                              \${repo.description ? highlightText(truncatedDescription, query) : ''}
                            </p>
                          </div>
                          <div class="mt-auto">
                            <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Stars: \${repo.stargazers_count}
                            </span>
                          </div>
                        </div>
                      </div>\`
                  }).join('')}
                </div>
              </div>
            \`;
          } else {
            generateHTML(data);
          }
        });
      });
    <\/script>
    <script src="https://cdn.jsdelivr.net/gh/TheSmallHanCat/Better_Alist@main/js/lib.js"><\/script>
    <script src="https://cdn.jsdelivr.net/gh/TheSmallHanCat/Better_Alist@main/js/parallax.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/gh/TheSmallHanCat/Better_Alist@main/js/app.bundle.js"><\/script>
    <script src='https://cdn.jsdelivr.net/gh/TheSmallHanCat/Better_Alist@main/fish.js'><\/script>
  </body>
</html>
`;
})();
//# sourceMappingURL=worker.js.map
