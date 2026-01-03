<script>
  let linkedinIcon = 'images/linkedin_icon.png'
  let githubIcon = 'images/github_icon.png'
</script>
<div class="background">
  <div class="content">
    <h1>
      <span class="wpr">Tamara</span>
      <span class="wpr">Snyder</span>
    </h1>
    <div class="typing-container">
      <h2>iOS Developer</h2>
    </div>

    <nav>
      <a href="https://www.linkedin.com/in/tamara-snyder-a6a1391b7/" target="_blank">
        <img class="media-icon" src={linkedinIcon} alt="LinkedIn profile"/>
      </a>
      <a href="https://github.com/tamara-snyder" target="_blank">
        <img class="media-icon" src={githubIcon} alt="Github profile"/>
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
    margin: clamp(3vh, 6vh, 8vh) auto clamp(2.5vh, 5vh, 7vh) auto;
    font-size: clamp(3rem, 6vw, 4rem);
    letter-spacing: clamp(0.08rem, 0.3vw, 0.3rem);
    text-align: center;
    max-width: 47vw;
    color: #5f27cd;
  }

  h2 {
    font-size: clamp(1.6rem, 5vmin, 3rem);
    text-align: center;
    margin: clamp(3vh, 5vh, 6vh) auto;
    letter-spacing: clamp(0.05em, 0.1em, 0.15em);
    overflow: hidden; /* Ensures the content is not revealed until the animation */
    border-right: 0.1em solid #feca57; /* The typwriter cursor */
    white-space: nowrap; /* Keeps the content on a single line */
    margin: 0; /* Gives that scrolling effect as the typing happens */
    animation:
      typing 2s steps(30, end) forwards,
      blink-caret step-end .8s infinite;
  }

  .typing-container {
    display: inline-block;
    margin: 0 auto;
  }

  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  /* The typewriter cursor effect */
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #feca57; }
  }

  .media-icon {
  width: clamp(40px, 8vw, 64px);
  height: auto;
  padding: 0 clamp(8px, 4vw, 20px);
  transition: 0.2s ease-in-out;
}

  .media-icon:hover {
    transform: scale(1.05);
  }
</style>