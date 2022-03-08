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
    text-align: center;
  }

  .mobile {
    width: 100%;
  }
  
  .tablet {
    width: 70%;
  }

  .desktop {
    width: 40%;
  }

  @media only screen and (min-width: 1200px) {
    p {
      width: 40%;
      margin: auto;
    }
  }
</style>