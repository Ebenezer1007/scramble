/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */

function shuffle (words) {
  const copy = [...words]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof words === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const words = ['apple', 'banana', 'orange', 'grape', 'kiwi',
     'mango', 'peach', 'pear', 'strawberry', 'watermelon',
'pineapple', 'blueberry', 'raspberry', 'lemon', 'lime'];


function ScrambleWord({ word }) {
  const characters = word.split('')
  const shuffledCharacters = shuffle(characters)
  const scrambledWord = shuffledCharacters.join('')
  return (
    <div className="scramble_word">
      {scrambledWord}
    </div>
  )
}

function Points({ points }) {
  return (
    <div className="points_container">
      <p>{points}</p>
      <h2 className="points"> Points</h2>
    </div>
  )
}

function Strikes({ strikes }) {
  return (
    <div className="strikes_container">
      <p>{strikes}</p>
      <h2 className="strikes"> Strikes</h2>
    </div>
  )
}

function Message({ message }) {
  return (
    <div>
      {message === 'wrong' && <p className="message wrong">Wrong. Try again</p>}
      {message === 'correct' && <p className="message right">Correct. Next Word</p>}
      {message === 'passed' && <p className="message passed">You passed. Next Word</p>}
      {message === 'lost' && <p className="message lost">You lost</p>}
    </div>
  )
}



function Text({ onGuess, strikes }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
        onGuess(e.target.value)
        e.target.value = ''
    }
  }
  return(
  <form>
      <input className="input_form" type="text" onKeyDown = {handleKeyDown} disabled={strikes === 3}/>
  </form>
  )

}


function PassWord({handlePass, attempts}) {
  return (
    <button className="pass_btn" onClick={handlePass} hidden={attempts === 0} >
     {attempts} Attempt{attempts !== 1 ? 's' : ''} Pass
    </button>
  )
}

function PlayAgain({ onPlayAgain }) {
  return (
    <button className="play_btn" onClick={onPlayAgain} >
      Play again
    </button>
  )
}

function App() {
  const passAttempts = 3
  const max = 3

  const [points, setPoints] = React.useState(JSON.parse(localStorage.getItem('points')) || 0)
  const [strikes, setStrikes] = React.useState(JSON.parse(localStorage.getItem('strikes')) || 0)
  const [currentWord, setCurrentWord] = React.useState(JSON.parse(localStorage.getItem('currentWord')) || 0)
  const [scrambledIndex, setScrambledIndex] = React.useState(JSON.parse(localStorage.getItem('scrambledIndex')) || 0)
  const [message, setMessage] = React.useState('')
  const [attempts, setAttempts] = React.useState(JSON.parse(localStorage.getItem('attempts')) || 3)

  function verifyGuess(guess) {
    const currentScrambledWord = words[scrambledIndex];
    if (guess.toLowerCase() === currentScrambledWord.toLowerCase()) {
      setPoints(points + 1)
      setMessage('correct')
      setCurrentWord(currentWord + 1)
      setScrambledIndex(scrambledIndex + 1)
    } else {
      if (strikes < 2) {
        setStrikes(strikes + 1)
        setMessage('wrong')
      } else {
        setStrikes(max)
        setMessage('lost')
      }
    }
        
  }

        React.useEffect(() => localStorage.setItem('points', JSON.stringify(points)));
        React.useEffect(() => localStorage.setItem('message', JSON.stringify(message)));
        React.useEffect(() => localStorage.setItem('currentWord', JSON.stringify(currentWord)));
        React.useEffect(() => localStorage.setItem('scrambledIndex', JSON.stringify(scrambledIndex)));
        React.useEffect(() => localStorage.setItem('strikes', JSON.stringify(strikes)));
        React.useEffect(() => localStorage.setItem('attempts', JSON.stringify(attempts)));

  function handlePass(){
    if(attempts>0 && strikes < max){
      setCurrentWord(currentWord + 1)
      setScrambledIndex( scrambledIndex + 1)
      setMessage('passed')
      setAttempts(attempts - 1)
    }
  }

  function handlePlayAgain() {
  
      setPoints(0)
      setStrikes(0)
      setCurrentWord(0)
      setScrambledIndex(0)
      setMessage('')
      setAttempts(passAttempts)
    
  }


  return (
    <div className ="container"> 
      <h1>WordGame Scramble</h1>

        <section className="counter">
          <div className="points">
            <Points points={points} />
          </div>

          <div className="strikes">
            <Strikes strikes={strikes} />
          </div>
        </section>
      <Message message={message} />
      {(strikes === max || currentWord === words.length) && (
        <React.Fragment>
          <p className="message game-over">Game Over!</p>
          <PlayAgain onPlayAgain={handlePlayAgain} />
        </React.Fragment>
      )} 
      {currentWord < words.length ? (
        <React.Fragment>
          <ScrambleWord word={words[currentWord]} />
          <Text onGuess={verifyGuess} strikes={strikes} />
          <PassWord handlePass={handlePass} attempts={attempts} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className="message game-over">Game Over!</p>
          <PlayAgain onPlayAgain={handlePlayAgain} />
        </React.Fragment>
      )}
      
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


