<script>
  import MediaQuery from "./MediaQuery.svelte"
  import Overview from "./Overview.svelte"
</script>

<MediaQuery query="(max-width: 480px)" let:matches>
	{#if matches}
	<div class="mobile">
		<Overview/>
	</div>
	{/if}
</MediaQuery>

<MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
	{#if matches}
	<div class="tablet">
		<Overview/>
	</div>
	{/if}
</MediaQuery>

<MediaQuery query="(min-width: 1281px)" let:matches>
	{#if matches}
	<div class="desktop">
		<Overview/>
	</div>
	{/if}
</MediaQuery>

<!-- <nav>
  <a href="https://www.linkedin.com/in/tamara-snyder-a6a1391b7/" target="_blank">
    <img class="media-icon" src={linkedinIcon} alt="LinkedIn profile"/>
  </a>
  <a href="https://github.com/tamara-snyder" target="_blank">
    <img class="media-icon" src={githubIcon} alt="Github profile"/>
  </a>
  <a href="https://twitter.com/dev_tamara" target="_blank">
    <img class="media-icon" src="{twitterIcon}" alt="Twitter profile"/>
  </a>
</nav> -->


<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@800&display=swap');

  .mobile {
    text-align: center;
  }

  .mobile h1 {
    font-size: 2rem;
  }

  .mobile h2 {
    font-size: 1.5rem;
  }

  

  h1 {
    font-size: 7rem;
    text-align: center;
    margin: 0 auto;
  }

  h2 {
    font-size: 4rem;
    text-align: center;
    margin: 0 auto;
  }

  .mobile .media-icon {
    width: 64px;
    height: auto;
    padding: 0 20px;
    transition: 0.2s ease-in-out;
  }
</style>