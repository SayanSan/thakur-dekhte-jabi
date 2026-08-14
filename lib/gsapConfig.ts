import gsap from "gsap";

// Snap to real elapsed time instead of easing back in after a tab is
// backgrounded mid-animation — prevents the one-shot cinematic transition
// from appearing to hang if focus is lost for a moment.
gsap.ticker.lagSmoothing(0);
