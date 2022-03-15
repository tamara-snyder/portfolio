<script>
  export let project
</script>

<div class='project'>
  <h3>{project.title}</h3>
  <img src={project.imageSource} alt={project.imageAlt}>
  <p>{project.description}</p>
</div>

<style>
  div {
    padding: 30px;
    margin: 0 auto 10vh auto;
    border-radius: 10px;
    background-color: #f2f3f4;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    transition: 0.3s;
    position: relative;
    flex: 0 1 0;
  }

  div:hover {
    background-color: #f6f9fc;
  }

  h3 {
    font-size: 1.5rem;
  }

  img {
    max-width: 290px;
    transition: 0.3s;
    border-radius: 15px;
  }

  img:hover {
    transform: scale(1.03);
  }

  p {

  }
</style>