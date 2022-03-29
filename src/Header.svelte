<nav class="nav">
  <ul class="nav-list">
    <li class="nav-item"><a href="#home" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="#portfolio" class="nav-link">Portfolio</a></li>
    <li class="nav-item"><a href="#contact" class="nav-link">Contact</a></li>
  </ul>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 50;
    min-height: 50px;
    border-bottom: solid 2px #ddd;
    background-color: rgba(242, 243, 244, 0.9);
  }

  .nav-list {
    display: flex;
    justify-content: flex-end;
  }

  .nav-item {
    list-style: none;
    padding: 3px 20px;
  }

  .nav-link {
    font-size: 3vh;
    color: #303030;
    transition: 0.2s;
  }

  a:hover {
    color: #bbb;
  }

  a:hover {
    transform: scaleX(1.1);    
  }
</style>