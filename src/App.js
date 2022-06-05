import './App.css';
import questions from './questions'
import QuestionCard from './components/QuestionCard/QuestionCard';
import { useEffect, useState } from 'react'
import { useSprings, interpolate, Interpolation } from 'react-spring'
import { useDrag, api } from 'react-use-gesture'
// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
})
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

function App() {

  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, api] = useSprings(questions.length, i => ({
    ...to(i),
    from: from(i),
  })) // Create a bunch of springs using the helpers above

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    api.start(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      }
    })
    if (!down && gone.size === questions.length)
      setTimeout(() => {
        gone.clear()
        api.start(i => to(i))
      }, 600)
  })


  const [score, setScore] = useState(0);
  const [scoreString, setScoreString] = useState('')

  const updateScore = (points) => {
    if(score + points <= questions.length && score + points >= 0){
      setScore(score+points);
    }
  }

  useEffect(() => {
    setScoreString(`${score}/${questions.length}`);
  }, [score]);

  return (
    <div className="App">

      {scoreString && <h1>{scoreString}</h1>}

      <div className="question-container"> 
      { 
        props.map(({ x, y, rot, scale }, i) => {
          return <QuestionCard 
            language={questions[i].language} 
            question={questions[i].question}
            options={questions[i].options}
            correctOption={questions[i].correctOption}
            updateScore={updateScore}
            index={i}
            style={{ props }}
            rot={rot}
            scale={scale}
            trans={trans}
            bind={bind}
            x={x}
            y={y}
            />
        }) 
      }
      </div>

    </div>
  );
}

export default App;
