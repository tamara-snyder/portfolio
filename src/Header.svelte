<nav class="nav">
  <ul class="nav-list">
    <li class="nav-item"><a href="#" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Portfolio</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
  </ul>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    min-height: 50px;
    border-bottom: solid 2px #eee;
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
    font-size: 1.3rem;
    color: #303030;
  }

  a:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        transform: scaleX(0);
        background-color: pink;

        transition: transform 0.3s;

  }
  a:hover:after {
    transform: scaleX(1);    
  }
</style>