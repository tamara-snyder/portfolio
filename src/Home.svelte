<script>
  let linkedinIcon = 'images/linkedin_icon.png'
  let twitterIcon = 'images/twitter_icon.png'
  let githubIcon = 'images/github_icon.png'
</script>

<h1>Tamara Snyder</h1>
<h2>iOS Developer</h2>

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


<style>
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@800&display=swap');

  h1 {
    font-size: 7rem;
  }

  h2 {
    font-size: 4rem;
  }

  nav {
    background-image: url('images/snyder_pressphoto.JPG');
    display: flex;
    align-items: center;
    justify-content: center;
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