import styles from './QuestionCard.module.css'
import Option from '../Option/Option'
import { useState, useEffect } from 'react'
import { useSprings, animated, config, interpolate } from 'react-spring'
import { Form, Formik } from 'formik'
import { Interpolation } from 'react-spring'

function QuestionCard({ language, question, options, correctOption, updateScore, index, rot, scale, trans, bind, x, y }) {
  const [validChoice, setValidity] = useState(null);
  const [used, setUsed] = useState(false);

  const onSubmit = (values) => {
    (values.picked == correctOption) ? setValidity('Correct') : setValidity('Incorrect');
    if(used == false){
      if(values.picked == correctOption) updateScore(1);
      setUsed(true);
    }
  };

  return (
    <animated.div className={styles.Container} style={{transform:interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),}}>
    <animated.div className={ styles.QuestionCard } 
    {...bind(index)}  
    style={{
        transform: interpolate([rot, scale], trans),
      }}>
        <label>{language}</label>
        <p>{question}</p>

        <Formik 
          initialValues={{'picked': ''}}
          onSubmit={onSubmit}
        >
          
          <Form>
          
          {
            options.map((option, key) => {
              return <Option key={key} parentQuestion={question} value={option} />
            }) 
          }

          <button type="submit">Answer!</button>

          </Form>
        </Formik>

        <div className={styles.results}>
        <span className={styles.lock}>{ used ? '🔒' : '🔓'}</span> 

        { validChoice && 
          <span className={(validChoice == 'Correct') ? styles.correct : styles.incorrect }>{validChoice}</span> 
        }
        </div>
      
    </animated.div>
    </animated.div>
  );

}

export default QuestionCard;
