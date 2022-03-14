<script>
  let linkedinIcon = 'images/linkedin_icon.png'
  let twitterIcon = 'images/twitter_icon.png'
  let githubIcon = 'images/github_icon.png'
</script>

<h1>Tamara Snyder</h1>
<h2>iOS Developer</h2>

<img id="avatar" src="images/snyder_pressphoto.JPG" alt="">

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

  img {
    width: 150px;
    height: auto;
    border-radius: 50%;
  }

  #avatar {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }

  nav {
    margin: 6vh auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 4rem;
    text-align: center;
    margin: 0 auto;
  }

  h2 {
    font-size: 3rem;
    text-align: center;
    margin: 0 auto;
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