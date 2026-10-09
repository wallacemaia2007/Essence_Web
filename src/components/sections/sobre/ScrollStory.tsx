"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

import { DoorScene } from "@/components/sections/sobre/scenes/DoorScene";
import { FabricScene } from "@/components/sections/sobre/scenes/FabricScene";
import { FittingRoomScene } from "@/components/sections/sobre/scenes/FittingRoomScene";
import { InstagramScene } from "@/components/sections/sobre/scenes/InstagramScene";
import { VisitScene } from "@/components/sections/sobre/scenes/VisitScene";
import { gsap } from "@/lib/gsap";

export function ScrollStory() {
  const storyRef = useRef<HTMLElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const [activeScene, setActiveScene] = useState(0);

  useGSAP(
    () => {
      const root = storyRef.current;
      if (!root) return;

      const select = gsap.utils.selector(root);
      const scenes = gsap.utils.toArray<HTMLElement>(
        "[data-story-scene]",
        root,
      );
      const media = gsap.matchMedia();
      const door = select('[data-story-scene="door"]')[0] as HTMLElement;
      const fitting = select('[data-story-scene="fitting"]')[0] as HTMLElement;
      const fabric = select('[data-story-scene="fabric"]')[0] as HTMLElement;
      const instagram = select(
        '[data-story-scene="instagram"]',
      )[0] as HTMLElement;
      const visit = select('[data-story-scene="visit"]')[0] as HTMLElement;
      let visitPulse: gsap.core.Tween | null = null;

      media.add("(prefers-reduced-motion: no-preference)", () => {
        root.classList.add("is-animated");
        gsap.set(scenes, { autoAlpha: 0, filter: "blur(8px)" });
        gsap.set(door, { autoAlpha: 1, filter: "blur(0px)" });
        gsap.set(select("[data-door-subtitle]"), {
          autoAlpha: 0,
          y: 22,
          filter: "blur(5px)",
        });

        const scrollProgress = { value: 0 };
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=1200%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const sceneIndex = Math.min(4, Math.floor(self.progress * 5));
              setActiveScene((current) =>
                current === sceneIndex ? current : sceneIndex,
              );
              const sceneLabel = `0${sceneIndex + 1} / 05`;
              root.dataset.currentScene = sceneLabel;
              root.dataset.storyProgress = self.progress.toFixed(3);
              root.dataset.pinActive = String(self.isActive);
              if (progressFillRef.current) {
                const mobileProgress =
                  window.matchMedia("(max-width: 680px)").matches;
                const axis = mobileProgress ? "X" : "Y";
                progressFillRef.current.style.transform = `scale${axis}(${Math.max(0.015, self.progress)})`;
              }
              if (
                progressLabelRef.current &&
                progressLabelRef.current.textContent !== sceneLabel
              ) {
                progressLabelRef.current.textContent = sceneLabel;
              }
              if (self.progress >= 0.94) {
                visitPulse?.play();
              } else {
                visitPulse?.pause(0);
              }
            },
          },
        });

        timeline.to(scrollProgress, { value: 1, duration: 5, ease: "none" }, 0);

        timeline.to(
          select("[data-door-title-line]"),
          {
            yPercent: -115,
            clipPath: "inset(0% 0% 100% 0%)",
            autoAlpha: 0,
            duration: 0.2,
            stagger: 0.08,
            ease: "power2.in",
          },
          0.38,
        );
        timeline.to(
          select("[data-door-subtitle]"),
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.24,
            ease: "power3.out",
          },
          0.43,
        );
        timeline.fromTo(
          fitting,
          { autoAlpha: 0, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.24,
            ease: "power2.inOut",
          },
          0.66,
        );
        timeline.to(
          select('[data-door-panel="left"]'),
          { xPercent: -108, duration: 0.34, ease: "power2.inOut" },
          0.65,
        );
        timeline.to(
          select('[data-door-panel="right"]'),
          { xPercent: 108, duration: 0.34, ease: "power2.inOut" },
          0.65,
        );
        timeline.to(
          door,
          {
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.16,
            ease: "power2.inOut",
          },
          0.84,
        );

        timeline.fromTo(
          select("[data-fitting-rack]"),
          { xPercent: 10, rotation: -1.5 },
          { xPercent: 0, rotation: 0, duration: 0.42, ease: "power3.out" },
          1.04,
        );
        timeline.fromTo(
          select("[data-fitting-title-line]"),
          { yPercent: 110, clipPath: "inset(0% 0% 100% 0%)" },
          {
            yPercent: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.32,
            stagger: 0.08,
            ease: "expo.out",
          },
          1.02,
        );
        timeline.fromTo(
          select("[data-fitting-look]"),
          { autoAlpha: 0, y: 32, scale: 0.88 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.34,
            stagger: 0.11,
            ease: "expo.out",
          },
          1.12,
        );
        timeline.fromTo(
          select("[data-curation-word]"),
          { autoAlpha: 0, y: 12, filter: "blur(4px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.2,
            stagger: 0.035,
            ease: "power3.out",
          },
          1.48,
        );

        timeline.to(
          fitting,
          {
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.2,
            ease: "power2.inOut",
          },
          1.8,
        );
        timeline.fromTo(
          fabric,
          { autoAlpha: 0, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.2,
            ease: "power2.inOut",
          },
          1.8,
        );
        timeline.fromTo(
          select("[data-fabric-image]"),
          { scale: 1 },
          { scale: 1.4, duration: 0.84, ease: "power2.inOut" },
          2.02,
        );
        timeline.fromTo(
          select("[data-fabric-title-line]"),
          { yPercent: 110, clipPath: "inset(0% 0% 100% 0%)" },
          {
            yPercent: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.32,
            stagger: 0.08,
            ease: "expo.out",
          },
          2.04,
        );
        timeline.fromTo(
          select('[data-fabric-layer="back"]'),
          { yPercent: -5 },
          { yPercent: 8, duration: 0.92, ease: "none" },
          2.02,
        );
        timeline.fromTo(
          select('[data-fabric-layer="middle"]'),
          { yPercent: 8 },
          { yPercent: -7, duration: 0.92, ease: "none" },
          2.02,
        );
        timeline.fromTo(
          select('[data-fabric-layer="front"]'),
          { yPercent: 3 },
          { yPercent: -12, duration: 0.92, ease: "none" },
          2.02,
        );

        timeline.to(
          fabric,
          {
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.2,
            ease: "power2.inOut",
          },
          2.8,
        );
        timeline.fromTo(
          instagram,
          { autoAlpha: 0, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.2,
            ease: "power2.inOut",
          },
          2.8,
        );
        timeline.fromTo(
          select("[data-instagram-post]"),
          { autoAlpha: 0, rotationY: -14, y: 26, scale: 0.9 },
          {
            autoAlpha: 1,
            rotationY: 0,
            y: 0,
            scale: 1,
            duration: 0.32,
            stagger: 0.075,
            ease: "expo.out",
          },
          3.04,
        );
        timeline.fromTo(
          select("[data-instagram-title-line]"),
          { yPercent: 110, clipPath: "inset(0% 0% 100% 0%)" },
          {
            yPercent: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.32,
            stagger: 0.08,
            ease: "expo.out",
          },
          3.12,
        );
        timeline.fromTo(
          select("[data-instagram-handle]"),
          { autoAlpha: 0, yPercent: 70, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power3.out",
          },
          3.23,
        );
        timeline.fromTo(
          select("[data-instagram-copy]"),
          { x: 18, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.34, ease: "power3.out" },
          3.08,
        );

        timeline.to(
          instagram,
          {
            autoAlpha: 0,
            filter: "blur(8px)",
            duration: 0.2,
            ease: "power2.inOut",
          },
          3.8,
        );
        timeline.fromTo(
          visit,
          { autoAlpha: 0, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.2,
            ease: "power2.inOut",
          },
          3.8,
        );
        timeline.fromTo(
          select("[data-visit-map]"),
          { scale: 1.12, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.42, ease: "power2.inOut" },
          4.04,
        );
        timeline.fromTo(
          select("[data-visit-copy]"),
          { x: 20, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.38, ease: "power3.out" },
          4.1,
        );
        timeline.fromTo(
          select("[data-visit-title-line]"),
          { yPercent: 110, clipPath: "inset(0% 0% 100% 0%)" },
          {
            yPercent: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.32,
            stagger: 0.08,
            ease: "expo.out",
          },
          4.12,
        );
        timeline.fromTo(
          select("[data-map-pin]"),
          { y: -120, autoAlpha: 0, scale: 0.78 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "bounce.out" },
          4.28,
        );

        const pinHalo = select("[data-map-pin-halo]")[0] as
          HTMLElement | undefined;
        if (pinHalo) {
          visitPulse = gsap.fromTo(
            pinHalo,
            { scale: 0.65, autoAlpha: 0.8 },
            {
              scale: 1.9,
              autoAlpha: 0,
              duration: 1.05,
              ease: "power2.inOut",
              repeat: -1,
              repeatDelay: 0.12,
              paused: true,
              transformOrigin: "center center",
            },
          );
        }

        return () => {
          visitPulse?.kill();
          timeline.scrollTrigger?.kill();
          timeline.kill();
          root.classList.remove("is-animated");
        };
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(scenes, { autoAlpha: 1, clearProps: "filter,transform" });
        setActiveScene(2);
      });

      return () => {
        media.revert();
      };
    },
    { scope: storyRef },
  );

  return (
    <section
      aria-label="Scroll Story: uma viagem pelo universo da Essence"
      className="scroll-story"
      id="scroll-story"
      ref={storyRef}
    >
      <div className="scroll-story__stage">
        <DoorScene />
        <FittingRoomScene />
        <FabricScene active={activeScene === 2} />
        <InstagramScene />
        <VisitScene />

        <div aria-label="Progresso da história" className="story-progress">
          <span
            className="story-progress__label"
            ref={progressLabelRef}
            role="status"
          >
            01 / 05
          </span>
          <span aria-hidden="true" className="story-progress__track">
            <span className="story-progress__fill" ref={progressFillRef} />
          </span>
        </div>
      </div>
    </section>
  );
}
