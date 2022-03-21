<script>
  import MediaQuery from "./MediaQuery.svelte"
  import BioText from "./BioText.svelte"
</script>

<MediaQuery query="(max-width: 480px)" let:matches>
  {#if matches}
  <div class="mobile">
    <BioText/>
  </div>
  {/if}
</MediaQuery>

<MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
  {#if matches}
  <div class="tablet">
    <BioText/>
  </div>
  {/if}
</MediaQuery>

<MediaQuery query="(min-width: 1281px)" let:matches>
  {#if matches}
  <div class="desktop">
    <BioText/>
  </div>
  {/if}
</MediaQuery>

<style>
  div {
    margin: auto;
    height: 100vh;
    display: flex;
    align-items: center;
  }

  .mobile {
    width: 95%;
  }
  
  .tablet {
    width: 70%;
  }

  .desktop {
    width: 50%;
  }
</style>