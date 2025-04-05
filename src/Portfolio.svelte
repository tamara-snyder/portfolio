<script>
  import ProjectCard from "./ProjectCard.svelte";

  let projects = [
    {
      title: 'Mastermind',
      link: 'https://github.com/tamara-snyder/Mastermind',
      imageSource: 'images/mastermind_screenshot.png',
      imageAlt: 'Screenshot of Mastermind app for iPhone',
      description: 'Basically Wordle, but with the objective of guessing a random sequence of colors instead of a five-letter word</a>.',
      technologies: 'Swift, SwiftUI',
    },
    {
      title: 'Sweather',
      link: 'https://github.com/tamara-snyder/Sweather',
      imageSource: 'images/sweather_screenshot.png',
      imageAlt: 'Screenshot of Sweather app for iPhone',
      description: 'A simple weather app. With user permission, it fetches the local weather for the user\'s current location. There is also an option for the user to search for a specific city or zip code. A table view displays weather forecasts in three-hour time intervals for the next five days. Uses MVC architecture. Background art courtesy of <a href="freepik.com">freepik.com</a>.',
      technologies: 'Swift, UIKit, CoreLocation, OpenWeatherMap API',
    },
    {
      title: 'Aeropress Timer',
      link: 'https://github.com/tamara-snyder/Aeropress-Timer',
      imageSource: 'images/aerotimer_screenshot.png',
      imageAlt: 'Screenshot of my custom Aeropress timer',
      description: 'A custom Aeropress timer for brewing my morning Aeropress recipe. It runs two timers in succession with the ability to pause and resume or restart the brewing process at any time. A bell rings after the first timer to signal the next step in the process.',
      technologies: 'Swift, UIKit'
    },
    {
      title: 'iOS Calculator Clone',
      link: 'https://tamara-snyder.github.io/Calculator/',
      imageSource: 'images/calculator_screenshot.png',
      imageAlt: 'Screenshot of the iOS calculator replicated for the web',
      description: 'A web-based replica of the iOS calculator. The challenge in this was to match the functionality exactly to Apple\'s version.',
      technologies: 'Javascript, HTML, CSS'
    },
    {
      title: 'Tic-Tac-Toe',
      link: 'https://tamara-snyder.github.io/Tic-Tac-Toe-JS/',
      imageSource: 'images/tictactoe_screenshot.png',
      imageAlt: 'Screenshot of Tic-Tac-Toe with an unbeatable AI',
      description: 'The classic game of Tic-Tac-Toe with the twist of an unbeatable AI. Created in plain JavaScript, HTML, and CSS.',
      technologies: 'Javascript, HTML, CSS'
    },
    {
      title: 'Hangman',
      link: 'https://github.com/tamara-snyder/hangman',
      imageSource: 'images/hangman_screenshot.png',
      imageAlt: 'Screenshot of my Hangman game for the command line',
      description: 'Chooses a random word from the dictionary. You have 10 tries to guess it! Built in Ruby for the command line.',
      technologies: 'Ruby'
    }
  ]
</script>

<h1>Portfolio</h1>
<div id="portfolio">
  {#each projects as project}
    <ProjectCard {project}/>
  {/each}
</div>

<style>
  h1 {
    margin: 10vh auto 5vh auto;
    font-size: 4rem;
    letter-spacing: 0.3rem;
  }

  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
</style>