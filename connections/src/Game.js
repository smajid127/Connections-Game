import React, { useState, useCallback } from 'react';
import './Game.css';
import Word from './Word';

function Game() {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const GROUP_LENGTH = 4;
    const GROUPS_NEEDED = 4;
    const MAX_MISTAKES = 4;

    const [words, setWords] = useState([
        { word: "eye", difficulty: "blue", group: "Palindromes" },
        { word: "ear", difficulty: "purple", group: "Starts of Planet Names" },
        { word: "yak", difficulty: "yellow", group: "Chat, Informally" },
        { word: "hen", difficulty: "green", group: "Female Animals" },
        { word: "mar", difficulty: "purple", group: "Starts of Planet Names" },
        { word: "gab", difficulty: "yellow", group: "Chat, Informally" },
        { word: "pop", difficulty: "blue", group: "Palindromes" },
        { word: "ewe", difficulty: "green", group: "Female Animals" },
        { word: "sat", difficulty: "purple", group: "Starts of Planet Names" },
        { word: "yap", difficulty: "yellow", group: "Chat, Informally" },
        { word: "bib", difficulty: "blue", group: "Palindromes" },
        { word: "mer", difficulty: "purple", group: "Starts of Planet Names" },
        { word: "doe", difficulty: "green", group: "Female Animals" },
        { word: "gag", difficulty: "blue", group: "Palindromes" },
        { word: "jaw", difficulty: "yellow", group: "Chat, Informally" },
        { word: "cow", difficulty: "green", group: "Female Animals" }
    ]);

    const [mistakesRemaining, setMistakesRemaining] = useState(MAX_MISTAKES);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    const [groupsFound, setGroupsFound] = useState([]);
    const [numSelected, setNumSelected] = useState(0);


    // Reveal all remaining solutions when the game is lost
    const revealSolutions = useCallback(() => {
        let groupedWords = {};
        words.forEach((word) => {
            if (word.group in groupedWords) {
                groupedWords[word.group].push(word);
            } else groupedWords[word.group] = [word];
        });
        let groupsToReveal = [];
        Object.values(groupedWords).forEach(group => {
            if (!groupsFound.some(g => g.group === group[0].group)) {
                groupsToReveal.push({
                    words: group.map(w => w.word).join(", "),
                    group: group[0].group,
                    difficulty: group[0].difficulty
                });
            }
        });
        setWords([]);
        setGroupsFound(prev => [...prev, ...groupsToReveal]);

    }, [groupsFound, words]);

    const shuffleWords = useCallback(() => {
        setWords(prevWords => {
            const shuffled = [...prevWords];
            shuffled.sort(() => Math.random() - 0.5);
            return shuffled;
        });
    }, [setWords])

    const deselectAll = useCallback(() => {
        setWords(prevWords => prevWords.map(word => ({ ...word, isSelected: false })));
        setNumSelected(0);
    }, [setWords]);


    const handleSelectWord = useCallback((word) => {
        // Toggle selection state for a word and update count of selected words
        setWords(prevWords => {
            const updatedWords = prevWords.map(w =>
                w.word === word.word ? { ...w, isSelected: !w.isSelected } : w
            );
            setNumSelected(updatedWords.filter(w => w.isSelected).length);
            return updatedWords;
        });
    }, [setWords]);


    let handleSubmit = useCallback(() => {

        let selected = words.filter(word => word.isSelected);
        let group = selected[0].group;
        let validGroup = selected.every(word => word.group === group);
        // If every selected word belongs to the same group, it's valid
        if (validGroup) {
            const foundGroup = {
                words: selected.map(w => w.word).join(", "),
                group: group,
                difficulty: selected[0].difficulty
            };
            setGroupsFound([...groupsFound, foundGroup]);
            // Once all four groups are found, end the game with a win
            if (groupsFound.length + 1 === GROUPS_NEEDED) {
                setGameOver(true);
                setGameWon(true);
            }
            setWords(words.filter(word => !word.isSelected));

        } else {
            setWords(words.map(word => ({ ...word, isSelected: false })));
            setMistakesRemaining(prev => prev - 1);
            // If no mistakes remain, end the game and reveal solutions
            if (mistakesRemaining - 1 === 0) {
                setGameOver(true);
                revealSolutions();
            }
        }
        setNumSelected(0);
    }, [words, groupsFound, mistakesRemaining, revealSolutions]);


    const getGroupColor = (difficulty) => {
        switch (difficulty) {
            case 'purple': return '#ba81c5';
            case 'green': return '#a0c35a';
            case 'blue': return '#b0c4ef';
            case 'yellow': return '#f9df6d';
            default: return 'gray';
        }
    }

    const generateGameMessage = (gameOver, gameWon) => {
        if (!gameOver) return <p className='Game-instruction'>Create four groups of four!</p>;
        if (gameWon) return <h1>Great!</h1>;
        return <h1>Next time!</h1>;
    }

    return (
        <div className='Game-container'>
            <div className='Game-header'>
                <h1>Connections</h1>
                <p className='Game-date'>{formattedDate}</p>
            </div>
            <div className='Game'>
                {generateGameMessage(gameOver, gameWon)}

                <div className='Game-board'>
                    {/* Display found groups at the top, if any */}
                    {groupsFound.length > 0 && groupsFound.map((group, index) => (
                        <div key={index}
                            style={{ backgroundColor: getGroupColor(group.difficulty) }}
                            className='Game-group-found'>
                            <strong>{group.group}</strong>{group.words}
                        </div>
                    ))
                    }
                    {/* Display whatever words remain in the game */}
                    {words.map((word, index) => (
                        <Word key={index}
                            word={word}
                            handleSelectWord={handleSelectWord}
                            selectLimitReached={numSelected === GROUP_LENGTH} />
                    ))}
                </div>
                {!gameOver && <>
                    <div className='Game-mistakes'>
                        <span style={{ marginRight: '1rem' }}>Mistakes Remaining:</span>
                        <div style={{ display: "flex", gap: "10px" }}>
                            {Array.from({ length: mistakesRemaining }).map((_, i) => (
                                <div key={i} className='Game-mistake-dot' />
                            ))}
                        </div>
                    </div>
                    <div className='Game-action-btns'>
                        <button type="button" onClick={shuffleWords}>Shuffle</button>
                        <button type="button" disabled={numSelected === 0}
                            onClick={deselectAll}>Deselect All</button>
                        <button type="button"
                            className='Game-submit' disabled={numSelected < GROUP_LENGTH}
                            onClick={handleSubmit}
                        >Submit</button>
                    </div>
                </>}
            </div>
        </div>
    );
}

export default Game;