import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useGroundStore } from "@/stores/groundStore";

export function useHandPress(fadeIn: number, fadeOut: number) {
  const press = useRef({ reveal: 0, drop: 1, press: 0 });
  const touching = useGroundStore((s) => s.touching);

  useEffect(() => {
    const move = press.current;
    const timeline = gsap.timeline();

    if (touching) {
      timeline
        .to(move, { reveal: 1, duration: fadeIn * 0.85, ease: "power1.out" }, 0)
        .to(move, { drop: 0, duration: fadeIn, ease: "back.out(1.2)" }, 0)
        .to(move, { press: 1, duration: fadeIn * 0.9, ease: "power2.in" }, 0);
    } else {
      timeline
        .to(move, { drop: 1, duration: fadeOut, ease: "power2.in" }, 0)
        .to(move, { reveal: 0, duration: fadeOut * 0.9, ease: "power1.in" }, fadeOut * 0.1)
        // Longer than the hand takes to leave, and the wobble is what the grass springs back with.
        .to(move, { press: 0, duration: fadeOut * 3, ease: "elastic.out(1, 0.55)" }, 0);
    }

    return () => void timeline.kill();
  }, [touching, fadeIn, fadeOut]);

  return press;
}
