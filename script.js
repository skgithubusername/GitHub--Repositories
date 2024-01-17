const perPage = 10;
let currentPage = 1;

async function getRepositories(page) {
    const username = document.getElementById('username').value;
    const loaderContainer = document.getElementById('loader-container');
    const  repositoriesList = document.getElementById('repositories');
    const paginationDiv = document.getElementById('pagination');

    loaderContainer.innerHTML = '<div class="loader"></div>';
    repositoriesList.innerHTML = '';
    paginationDiv.innerHTML = '';

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`);
        const repositories = await response.json();

        repositories.forEach(repo => {
            const listItem = document.createElement('li');
            listItem.classList.add('repository');
            listItem.innerHTML = `<strong>${repo.name}</strong> - ${repo.description || 'No description available'}`;
            
            // Display topics if available
            if (repo.topics && repo.topics.length > 0) {
                const topicsDiv = document.createElement('div');
                topicsDiv.classList.add('topics');
                topicsDiv.textContent = `Topics: ${repo.topics.join(', ')}`;
                listItem.appendChild(topicsDiv);
            }

            repositoriesList.appendChild(listItem);
        });

        // Create pagination controls
        const totalRepositories = response.headers.get('Link').match(/page=(\d+)>; rel="last"/)[1];
        createPaginationControls(totalRepositories);
    } catch (error) {
        console.error('Error fetching repositories', error);
    } finally {
        loaderContainer.innerHTML = '';
    }
}

function createPaginationControls(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => getRepositories(i);
        paginationDiv.appendChild(button);
    }
}