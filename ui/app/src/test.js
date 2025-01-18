const conf = {
  api_url: "http://127.0.0.1:8000/"
}

const fetchPosts = () => {
    console.log(`${conf.api_url}post/`)
    fetch(`${conf.api_url}post/`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  }
fetchPosts()