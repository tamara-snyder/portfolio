<script>
  import ProjectCard from "./ProjectCard.svelte";

  let projects = [
    {
      title: 'Mastermind',
      imageSource: 'images/mastermind_screenshot.png',
      imageAlt: 'Screenshot of Mastermind app for iPhone',
      description: 'A color-based guessing game built using SwiftUI.'
    },
    {
      title: 'Calculator',
      imageSource: 'images/calculator_screenshot.png',
      imageAlt: 'Screenshot of the iOS calculator replicated for the web',
      description: 'A web-based replica of the iOS calculator created using plain JavaScript, HTML, and CSS.'
    }
  ]
</script>

<div id="portfolio">
  {#each projects as project}
    <ProjectCard {project}/>
  {/each}
</div>

<style>
  div {
    margin: 10vh auto;
    display: flex;
    justify-content: center;
  }
</style>