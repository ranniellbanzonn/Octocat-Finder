function myFunction() {
    let text = document.getElementById("myInput").value;
    let userName = text.split(' ').join('');

    if (text.length > 0) {
        fetch("https://api.github.com/users/" + userName, {
            headers: {
                'Authorization': 'API HERE'
            }
        })
        .then(response => {
            if (response.status === 403) {
                throw new Error('Rate limit exceeded or forbidden access.');
            } else if (response.status === 404) {
                throw new Error('User not found.');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('result').innerHTML = `
                <div class="flex-column d-flex justify-content-center">
                    <img id='img-result' class="pb-3" src="${data.avatar_url}" alt="User Avatar"/>
                    <a href="${data.html_url}" target="_blank" class="text-decoration-none d-flex justify-content-center">
                        <button class="w-100 btn btn-primary">View Profile</button>
                    </a>
                </div>
                <div>
                    <p class="text-light fw-bold">Username: ${data.login}</p>
                    <p class="text-light fw-bold">Bio: ${data.bio}</p>
                </div>
            `;

            document.getElementById('result2').innerHTML = `
                <button class="px-3 py-1 btn btn-success" id="followers">Followers: ${data.followers}</button>
                <button class="px-3 py-1 btn btn-warning" id="following">Following: ${data.following}</button>
            `;

            document.getElementById('result3').innerHTML = `
            <ul class="list-group w-100" id="user-info-container">
                <li class="list-group-item  fw-bold text-light border-0" id="user-information">User Information</li>
                <li class="list-group-item border border-dark fw-bold ">Company: ${data.company}</li>
                <li class="list-group-item border border-dark fw-bold ">Email address: ${data.email}</li>
                <li class="list-group-item border border-dark fw-bold ">Location: ${data.location}</li>
                <li class="list-group-item border border-dark fw-bold ">Public repositories: ${data.public_repos}</li>
            </ul>
        `;


            
        });

        return fetch(`https://api.github.com/users/${userName}/repos?type=all&page=1&per_page=10&sort=created`, {
            headers: {
                'Authorization': 'API HERE'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching repositories.');
            }
            return response.json();
        })
        .then(repos => {
            let reposList = repos.map(repo => `
                <li class="list-group-item border border-dark d-flex flex-column flex-lg-row justify-content-between">
                    <span class="fw-bold px-2 py-2">${repo.name}</span> 
                    <div class="d-flex flex-column flex-lg-row gap-1">
                        <button class="px-3 py-1 btn btn-dark mb-2 mb-lg-0" id="followers">Stars: ${repo.stargazers_count} </button>
                        <button class="px-3 py-1 btn btn-dark mb-2 mb-lg-0" id="following">Forks: ${repo.forks_count} </button>
                        <button class="px-3 py-1 btn btn-dark" id="following">Watchers: ${repo.watchers_count} </button>
                    </div> 
                </li>`).join('');
            document.getElementById('result4').innerHTML = `
                <ul class="list-group w-100">
                    <li class="list-group-item fw-bold border-0 text-light" id="repo">Public Repositories</li>
                    ${reposList}
                </ul>
            `;
        
        })
        .catch(error => {
            document.getElementById('result').innerHTML = `
                <p class="text-light">${error.message}</p>
            `;
            console.error('Error fetching user data:', error);
        });
    } else {
        document.getElementById('result').innerHTML = ""; // Clear the result when input is empty
    }
}
