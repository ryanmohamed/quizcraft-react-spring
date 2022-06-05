import styles from './Option.module.css'
import { Field } from 'formik'

function Option({ parentQuestion, value}) {

  return (
    <div className={styles.Option}>
      <Field type="radio" value={value} name='picked'/> {value} 
    </div>
  );
}

export default Option;
