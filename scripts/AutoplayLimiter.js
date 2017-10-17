function isElementInViewport (el) {
    const fraction = 0.3;

    var rect = el.getBoundingClientRect();
    var w = rect.right - rect.left;
    var h = rect.bottom - rect.top;
    var W = Math.min(rect.right, window.innerWidth || document.documentElement.clientWidth) - Math.max(rect.left, 0);
    var H = Math.min(rect.bottom, window.innerHeight || document.documentElement.clientHeight) - Math.max(rect.top, 0);

    return H*W/(w*h) > fraction;
}

function setupAutoplayLimit() {
    var videos = document.getElementsByTagName("video");
    var documentHidden = false;

    function checkScroll() {
        if(!documentHidden) {
            for(var i = 0; i < videos.length; i++) {
                var video = videos[i];
                if (isElementInViewport(video)) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
    }

    window.addEventListener('scroll', checkScroll, false);
    window.addEventListener('resize', checkScroll, false);

    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    function handleVisibilityChange() {
        documentHidden = document[hidden];
        if (documentHidden) {
            for (var i = 0; i < videos; i++) {
                videos[i].pause();
            }
        } else {
            for (var i = 0; i < videos; i++) {
                videos[i].play();
            }
        }
    }

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
        console.log("This requires a brouser, such as Chrome or Firefox, that supports the Page Visibility API.");
    } else {
        // Handle page visibility change
        document.addEventListener(visibilityChange, handleVisibilityChange, false);
    }
}

window.onload = setupAutoplayLimit // this might be a problem if onload is used form mor than just this
