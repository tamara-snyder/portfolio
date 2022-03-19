<script>
  import ProjectCard from "./ProjectCard.svelte";

  let projects = [
    {
      title: 'Mastermind',
      link: '',
      imageSource: 'images/mastermind_screenshot.png',
      imageAlt: 'Screenshot of Mastermind app for iPhone',
      description: 'A color-based guessing game built using SwiftUI.'
    },
    {
      title: 'Aeropress Timer',
      link: 'https://github.com/tamara-snyder/Aeropress-Timer',
      imageSource: 'images/aerotimer_screenshot.png',
      imageAlt: 'Screenshot of my custom Aeropress timer',
      description: 'A custom Aeropress timer for brewing my morning Aeropress recipe. Built with UIKit.'
    },
    {
      title: 'iOS Calculator Clone',
      link: 'https://tamara-snyder.github.io/Calculator/',
      imageSource: 'images/calculator_screenshot.png',
      imageAlt: 'Screenshot of the iOS calculator replicated for the web',
      description: 'A web-based replica of the iOS calculator created in plain JavaScript, HTML, and CSS.'
    },
    {
      title: 'Tic-Tac-Toe',
      link: 'https://tamara-snyder.github.io/Tic-Tac-Toe-JS/',
      imageSource: 'images/tictactoe_screenshot.png',
      imageAlt: 'Screenshot of Tic-Tac-Toe with an unbeatable AI',
      description: 'The classic game of Tic-Tac-Toe, but with the twist of an unbeatable AI implemented using the minimax algorithm. Created in plain JavaScript, HTML, and CSS.'
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
  }

  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    /* align-items: stretch; */
  }
</style>