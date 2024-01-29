<template>
  <div class="container-xxl">
    <nav class="navbar navbar-expand-lg navbar-light border-bottom mb-3 p-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Home</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                class="nav-link active"
                aria-current="page"
                :to="{ name: 'home' }"
                >Software</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'ProjectList' }"
                >Projects</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'About' }"
                >About</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ path: '/graphs' }"
                >Metrics</router-link
              >
            </li>
          </ul>
          <div class="d-flex">
            <a class="navbar-brand" href="https://www.esciencecenter.nl"
              >Netherlands eScience Center</a
            >
          </div>
        </div>
      </div>
    </nav>
    <blockquote class="blockquote">
      <p>
        This website is powered by the Research Software Directory — the content
        management system for research software.
      </p>
    </blockquote>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
