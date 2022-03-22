<script>
  let linkedinIcon = 'images/linkedin_icon.png'
  let twitterIcon = 'images/twitter_icon.png'
  let githubIcon = 'images/github_icon.png'
</script>
<div class="background">
  <div class="content">
    <h1>Tamara Snyder</h1>
    <h2>Software Developer</h2>

    <nav>
      <a href="https://www.linkedin.com/in/tamara-snyder-a6a1391b7/" target="_blank">
        <img class="media-icon" src={linkedinIcon} alt="LinkedIn profile"/>
      </a>
      <a href="https://github.com/tamara-snyder" target="_blank">
        <img class="media-icon" src={githubIcon} alt="Github profile"/>
      </a>
      <a href="https://twitter.com/dev_tamara" target="_blank">
        <img class="media-icon" src="{twitterIcon}" alt="Twitter profile"/>
      </a>
    </nav>
  </div>
</div>

<style>
    .background {
    padding: 5vh 0;
    margin: 0 auto;
    width: 100%;
    height: 90vh;
    background-image: linear-gradient( 109.6deg,  rgba(247,253,166,1) 11.2%, rgba(128,255,221,1) 57.8%, rgba(255,128,249,1) 85.9% );
    color: black;
  }

  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  img {
    width: 150px;
    height: auto;
    border-radius: 50%;
  }

  nav {
    margin: 6vh auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 6rem;
    text-align: center;
    margin: 5vh auto;
  }

  h2 {
    font-size: 3rem;
    text-align: center;
    margin: 5vh auto;
  }

  .media-icon {
    width: 64px;
    height: auto;
    padding: 0 20px;
    transition: 0.2s ease-in-out;
  }

  .media-icon:hover {
    transform: scale(1.1);
  }
</style>