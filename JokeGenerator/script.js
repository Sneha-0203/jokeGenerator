const jokeContainer = document.getElementById("joke");
const btn = document.getElementById("btn");
const url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,explicit&type=single";

let getJoke = () => {
    fetch(url)
        .then(data => data.json())
        .then(item => {
            jokeContainer.textContent = item.joke; // Display the joke
        })
        .catch(error => {
            jokeContainer.textContent = "Oops! Couldn't fetch a joke right now.";
            console.error("Error fetching joke:", error);
        });
};

// Initial joke on page load
getJoke();

// Joke on button click
btn.addEventListener("click", getJoke);
const jokeContainer = document.getElementById("joke");
const btn = document.getElementById("btn");
const url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,explicit&type=single";

let getJoke = () => {
    fetch(url)
        .then(data => data.json())
        .then(item => {
            jokeContainer.textContent = item.joke; // Display the joke
        })
        .catch(error => {
            jokeContainer.textContent = "Oops! Couldn't fetch a joke right now.";
            console.error("Error fetching joke:", error);
        });
};

// Initial joke on page load
getJoke();

// Joke on button click
btn.addEventListener("click", getJoke);
