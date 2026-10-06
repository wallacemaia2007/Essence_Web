"use client";

import { useEffect, useState } from "react";

/**
 * `navigator.connection` não faz parte do lib.dom, mas existe no Chromium,
 * no Safari e no Firefox. Mantemos o tipo mínimo para não depender de tipos
 * não oficiais (@types/dom-network-information).
 */
type NetworkInformationLike = {
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function readConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === "undefined") {
    return undefined;
  }

  return (navigator as Navigator & { connection?: NetworkInformationLike })
    .connection;
}

/**
 * Indica que o usuário pediu economia de dados (Chrome/Edge/Android).
 * Usado para não baixar o vídeo do hero e ficar só com o poster.
 */
export function usePrefersReducedData() {
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const connection = readConnection();

    if (!connection) {
      return;
    }

    const update = () => setSaveData(connection.saveData === true);

    update();
    connection.addEventListener?.("change", update);

    return () => connection.removeEventListener?.("change", update);
  }, []);

  return saveData;
}
