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

<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@800&display=swap');
</style>