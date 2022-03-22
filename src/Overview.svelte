<script>
  let linkedinIcon = 'images/linkedin_icon.png'
  let twitterIcon = 'images/twitter_icon.png'
  let githubIcon = 'images/github_icon.png'

  let content = ["iOS Developer", "Web developer", "Software Enthusiast"]
</script>
<div class="background">
  <div class="content">
    <h1>
      <span class="wpr">Tamara</span>
      <span class="wpr">Snyder</span>
    </h1>
    <div class="typing-container">
      <h2>Software Developer</h2>
    </div>

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
    /* background-image: linear-gradient( 109.6deg,  rgba(247,253,166,1) 11.2%, rgba(128,255,221,1) 57.8%, rgba(255,128,249,1) 85.9% ); */
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
    font-size: 12vmin;
    text-align: center;
    margin: 5vh auto;
    letter-spacing: .1em;
    max-width: 47vw;
    /* background-color: #6c5ce7; */
  
  /* Create the gradient. */
   /* background: linear-gradient(
        45deg,
        #CA4246 16.666%, 
        #E16541 16.666%, 
        #E16541 33.333%, 
        #F18F43 33.333%, 
        #F18F43 50%, 
        #8B9862 50%, 
        #8B9862 66.666%, 
        #476098 66.666%, 
        #476098 83.333%, 
        #A7489B 83.333%); */

        /* background: linear-gradient(
        45deg,
        #ff7979 20%, 
        #feca57 20%, 
        #feca57 33.333%, 
        #55efc4 33.333%, 
        #55efc4 50%, 
        #74b9ff 50%, 
        #74b9ff 66.666%, 
        #6c5ce7 66.666%, 
        #6c5ce7 83.333%, 
        #574b90 83.333%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */


    background: #CA4246;
  background-color: #CA4246;
  background: conic-gradient(
    #ff7979 20%, 
        #feca57 20%, 
        #feca57 33.333%, 
        #55efc4 33.333%, 
        #55efc4 50%, 
        #74b9ff 50%, 
        #74b9ff 66.666%, 
        #6c5ce7 66.666%, 
        #6c5ce7 83.333%, 
        #574b90 83.333%);
  
  /* Set thee background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;
  
  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; 
  }

  h2 {
    font-size: 6vmin;
    text-align: center;
    margin: 5vh auto;

    overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: .1em solid orange; /* The typwriter cursor */
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  letter-spacing: .1em; /* Adjust as needed */
  /* animation: 
    typing 3s steps(40, end),
    blink-caret .75s step-end infinite; */
    animation:
      typing 2s steps(40, end) forwards,
      blink-caret step-end .8s infinite;
  }

  .typing-container {
    display: inline-block;
  }

  /* h2::after {
    content: "";
    position: absolute;
    animation: caret infinite;
    animation-duration: 1s;
    animation-timing-function: steps(1, end);
} */

  @keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #ffbe76; }
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