<template>
  <div>
    <Nuxt />
  </div>
</template>

<style>
html {
  font-family: "Delius", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 10px;
  color: #004;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  background-image: linear-gradient(
      to right,rgba(255,255,255,0.8),rgba(255,255,255,0.8)
    ),
    url("~@/assets/cooking.jpg");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  min-width: 100vh;
  padding: 2rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}


@media only screen and (max-width: 600px) {
  body {
  background-image: linear-gradient(
      to right,rgba(255,255,255,0.8),rgba(255,255,255,0.8)
    ),
    url("~@/assets/cooking-mobile.jpg");
}
}
</style>
