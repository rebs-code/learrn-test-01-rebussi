//react imports
// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState } from "react";
//components
import GameModeSelector from "./GameModeSelector";
import PlayerChoiceDisplay from "./PlayerChoiceDisplay";
import ChoiceButtons from "./ChoiceButtons";
import GameStatusMessage from "./GameStatusMessage";
import ResultDisplay from "./ResultDisplay";
// ui
import Button from "./ui/Button";
//utils
import { generatePCChoice } from "../lib/gameUtils";

export default function GameArena() {
  const [gameMode, setGameMode] = useState("humanVsPC"); //inizialmente la modalità di gioco è human vs pc
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [pcChoiceGenerated, setPcChoiceGenerated] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1); //inizialmente player01 è il giocatore che comincia, in human vs pc, human è sempre player01
  const [result, setResult] = useState("");
  const [gameEnded, setGameEnded] = useState(false);

  // funzione che gestisce la selezione della modalità di gioco
  const handleModeSelect = (mode) => {
    setGameMode(mode);
    //quando si cambia modalità di gioco, si resetta il gioco
    resetGame();
  };

  //funzione che gestisce la scelta del giocatore
  const handleChoice = (choice) => {
    //se la modalità di gioco è PC vs PC, si generano con un solo click le scelte per entrambi i giocatori
    if (gameMode === "PCvsPC") {
      const pc1Choice = generatePCChoice();
      const pc2Choice = generatePCChoice();
      setPlayer1Choice(pc1Choice);
      setPlayer2Choice(pc2Choice);
      setPcChoiceGenerated(true);
      //se la modalità di gioco è human vs PC, si assegna la scelta del giocatore e si genera la scelta del PC
    } else if (gameMode === "humanVsPC") {
      if (!player1Choice) {
        setPlayer1Choice(choice);
      } else {
        setPlayer2Choice(generatePCChoice());
        setPcChoiceGenerated(true);
      }
    } else if (gameMode === "humanVsHuman") {
      //se la modalità di gioco è human vs human, si assegna la scelta del giocatore e si cambia il giocatore per ripetere il processo
      if (currentPlayer === 1) {
        setPlayer1Choice(choice);
        setCurrentPlayer(2);
      } else {
        setPlayer2Choice(choice);
      }
    }
  };

  //funzione che controlla se la scelta è disabilitata
  const isChoiceDisabled = () => {
    return (
      gameEnded ||
      (gameMode === "PCvsPC" && pcChoiceGenerated) ||
      (gameMode === "humanVsPC" && player1Choice && pcChoiceGenerated) ||
      (gameMode === "humanVsHuman" && player1Choice && player2Choice)
    );
  };

  // relazioni tra le mosse
  const moveRelationships = {
    rock: { beats: ["scissors"] },
    paper: { beats: ["rock"] },
    scissors: { beats: ["paper"] },
  };

  // funzione che determina il vincitore
  const determineWinner = (move1, move2) => {
    if (move1 === move2) return "tie";
    if (moveRelationships[move1].beats.includes(move2)) return "move1";
    return "move2";
  };

  // funzione che inizia il gioco e lo risolve
  const playGame = () => {
    if (player1Choice && player2Choice) {
      const gameResult = determineWinner(player1Choice, player2Choice);
      if (gameResult === "move1") {
        setResult("Player 1 wins!");
      } else if (gameResult === "move2") {
        setResult("Player 2 wins!");
      } else {
        setResult("It's a tie!");
      }
      setGameEnded(true);
    }
  };

  const resetGame = () => {
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setCurrentPlayer(1);
    setResult("");
    setPcChoiceGenerated(false);
    setGameEnded(false);
  };

  return (
    <main className="container px-4 py-8 mx-auto">
      <GameModeSelector
        currentMode={gameMode}
        onSelectMode={handleModeSelect}
      />
      <PlayerChoiceDisplay
        player1Choice={player1Choice}
        player2Choice={player2Choice}
        gameMode={gameMode}
      />
      <ChoiceButtons
        onChoice={handleChoice}
        disabled={isChoiceDisabled()}
        gameMode={gameMode}
        currentPlayer={currentPlayer}
        player1Choice={player1Choice}
        player2Choice={player2Choice}
        pcChoiceGenerated={pcChoiceGenerated}
      />
      {gameEnded ? (
        <ResultDisplay result={result} />
      ) : (
        <GameStatusMessage
          gameMode={gameMode}
          player1Choice={player1Choice}
          player2Choice={player2Choice}
        />
      )}
      <div className="flex justify-center mt-4">
        <Button
          onClick={gameEnded ? resetGame : playGame}
          color="teal"
          disabled={!player1Choice || !player2Choice}
        >
          {gameEnded ? "Play Again" : "Start Game"}
        </Button>
      </div>
    </main>
  );
}
