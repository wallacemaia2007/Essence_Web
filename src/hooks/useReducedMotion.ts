"use client";

import { useEffect, useState } from "react";

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Acompanha a preferência de movimento reduzido do sistema operacional e
 * reage a mudanças em tempo real (o usuário pode alternar durante a sessão).
 */
export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia(REDUCE_MOTION_QUERY);

    const update = () => setReduceMotion(motionQuery.matches);

    update();
    motionQuery.addEventListener("change", update);

    return () => motionQuery.removeEventListener("change", update);
  }, []);

  return reduceMotion;
}
