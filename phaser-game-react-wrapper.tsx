import Phaser from "phaser";
import { useEffect, useRef } from "react";
import { phaserConfig } from "./src/configs/phaser-config";

export default function MatchFightPhaserGameReactWrapper() {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const gameConfig = { ...phaserConfig, parent: containerRef.current };
        const game = new Phaser.Game(gameConfig);
        return () => {
            game.destroy(true);
        };
    }, []);
    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

