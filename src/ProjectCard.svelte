<script>
  export let project
</script>

<div class='project'>
  <h3>{project.title}</h3>
  <a href={project.link} target="_blank">
    <img src={project.imageSource} alt={project.imageAlt}>
  </a>
  <div class="project-info">
    <p>{@html project.description}</p>
    <p><strong>Technologies:</strong> {project.technologies}</p>
  </div>
</div>

<style>
  .project {
    padding: 10px 30px;
    margin: 0 auto 10vh auto;
    border-radius: 10px;
    background-color: #f2f3f4;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    transition: 0.3s;
    position: relative;
    flex: 0 1 25%;
    max-height: 120vh;
  }

  div:hover {
    background-color: #f6f9fc;
  }

  h3 {
    font-size: 3vh;
    letter-spacing: 0.1rem;
    margin-bottom: 30px;
  }

  img {
    max-width: 290px;
    height: 45%;
    transition: 0.3s;
    border-radius: 15px;
  }

  img:hover {
    transform: scale(1.03);
  }

  .project-info {
    margin-top: 25px;
    border-top: solid 1px #ddd;
    line-height: 1.5em;
  }
</style>