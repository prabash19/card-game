import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card.js";

const initialCards = [
  { src: "/images/1.png", matched: false },
  { src: "/images/2.png", matched: false },
  { src: "/images/3.png", matched: false },
  { src: "/images/4.png", matched: false },
  { src: "/images/5.png", matched: false },
  { src: "/images/6.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turn, setTurn] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(true); // so that user does not select more than 2 cards
  const [startFlip, setStartFlip] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStartFlip(false);
    }, 5000);
    shuffleCards();
  }, []);

  function shuffleCards() {
    const shuffledCards = [...initialCards, ...initialCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurn(0);
    setDisabled(false);
    setStartFlip(true);
    setTimeout(() => {
      setStartFlip(false);
    }, 1000);
  }

  function handleChoice(card) {
    choiceOne
      ? choiceOne.id !== card.id && setChoiceTwo(card)
      : setChoiceOne(card);
  }

  function resetTurn() {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurn((prevTurn) => prevTurn + 1);
    setDisabled(false);
  }

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  return (
    <div className="container">
      <button onClick={shuffleCards}>New Game</button>
      <div className="grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={
              card === choiceOne ||
              card === choiceTwo ||
              card.matched ||
              startFlip
            }
            disabled={disabled}
            matched={card.matched}
          />
        ))}
      </div>
      <p>Turns: {turn}</p>
    </div>
  );
}

export default App;
