// call once on page load
filterVideos();
// call every 5 seconds after that, because when I scroll down, new videos are loaded into the page
setInterval(() => filterVideos(), 5e3);

/**
 * scan all the videos on the page, remove the ones that I shouldn't watch
 */
function filterVideos() {
  document
    .querySelectorAll(".inline-metadata-item.style-scope.ytd-video-meta-block") // under each video there are 2 piece of of key info - "x views" and "x ago". They're both little spans with these classes. With this querySelector, I find both
    .forEach((span) => {
      const text = span.textContent || "";
      let keep = true;
      // in case of "x views", if it doesn't contain K, M or B, it's less than 1K views, so don't watch. For many years it rarely happened, but recently youtube pushes this kind to me every day
      if (text.includes("views")) {
        if (!text.includes("K") && !text.includes("M") && !text.includes("B")) {
          keep = false;
        }
      }
      // in case of "x ago", if it's uploaded within a year, don't watch. The rational is, for every video that I feel like clicking, ask myself: will I still click it if I see it a year later? The answer is probably no for many things like geopolitical news / tech news. I should't watch them because in the long run they're a waste of time
      if (text.includes("ago") && !text.includes("year")) {
        keep = false;
      }
      // find the wrapper div of the video
      const videoContainer = findVideoContainer(span);
      if (keep) {
        // if it's a video I should watch, make it visible
        videoContainer.style.opacity = "";
      } else {
        videoContainer.style.opacity = 0.1;
        // videoContainer.remove(); // Tried, not good, every remove causes huge layout shifts and leads to new fetches, very messy. Btw, when doing this, in theory, it can often happen that the video div is removed twice because it met both conditions. But in practice, it didn't throw any error, so I'll just not worry about it
      }
    });
}

/**
 * given a node (often the "x views" or "x ago" text), find topmost container div which is the wrapper of the video.
 */
function findVideoContainer(node) {
  let current = node;
  while (true) {
    current = current.parentNode;
    if (!parent) return null;
    // the top container is a web component with such a tag name:
    if (current.tagName === "YTD-RICH-ITEM-RENDERER") {
      return current;
    }
  }
}
