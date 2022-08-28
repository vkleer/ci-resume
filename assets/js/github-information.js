function userInformationHTML(user) {
    return `
    <h2 class='text-white'>${user.name}
        <span class='small-name'>
            (@<a href='${user.html_url}' target='_blank'>${user.login}</a>)
        </span>
    </h2>
    <div class='gh-content'>
        <div class='gh-avatar'>
            <a href='${user.html_url} target='_blank'>
                <img src='${user.avatar_url}' height='80' width='80' alt='${user.login}' />
            </a>
        </div>
        <p class='text-white'>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
    </div>`
}

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class='repo-list'>No repositories available.</div>`;
    }

    let listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href='${repo.html_url}' target='_blank'>${repo.name}</a>
                </li>`
    });

    return `<div class='repo-list'>
                <p class='text-white'>Repo list:</p>
                <ul>
                    ${listItemsHTML.join('\n')}
                </ul>
            </div>`;
}

function fetchGitHubInformation() {
    $('#gh-user-data').html('');
    $('#gh-repo-data').html('');

    let username = $('#gh-username').val();
    if (!username) {
        $('#gh-user-data').html(`<h3 class='github-heading'>Please enter a GitHub username</h3>`);
        return;
    }

    $('#gh-user-data').html(
        `<div id='loader'>
            <img src='assets/images/loader.gif' alt='loading...' />
        </div>`
    );

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            let userData = firstResponse[0];
            let repoData = secondResponse[0];
            $('#gh-user-data').html(userInformationHTML(userData));
            $('#gh-repo-data').html(repoInformationHTML(repoData));
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $('#gh-user-data').html(`
                <h3 class='github-heading'>No information found for user ${username}</h3>
                `);
            } else if (errorResponse.status === 403) {
                let resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset') * 1000);
                $('#gh-user-data').html(`<h3 class='github-heading'> Too many requests were made, please wait until ${resetTime.toLocaleTimeString()} before trying again.</h3>`);
            } else {
                console.log(errorResponse);
                $('#gh-user-data').html(
                    `<h3 class='github-heading'>Error: ${errorResponse.responseJSON.message}</h3>`
                );
            }
        }
    )
}

$(document).ready(fetchGitHubInformation);