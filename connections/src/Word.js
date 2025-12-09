import clsx from 'clsx';

const Word = ({ word, handleSelectWord, selectLimitReached }) => {
    return (
        <div key={word.word} className={
            clsx("Game-cell",
                word.isSelected && "Game-cell-selected",
                selectLimitReached && !word.isSelected && "Game-cell-disabled")}
            onClick={() => handleSelectWord(word)}
        >{word.word}</div>
    );
};

export default Word;