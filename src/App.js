import React, { useEffect, useState } from 'react';
import './App.scss';
import { observer, inject } from 'mobx-react'

const App = ({ store }) => {
  useEffect(() => { store.fetchData() }, [store]);

  const { notes = [] } = store;
  const [inputValue, setInputValue] = useState(0);
  const handleChange = (e) => setInputValue(e.currentTarget.value);
  const handleSubmit = (e) => {
    store.createNote(inputValue);
  };
  return (
    <div className="App">
      <ul className="notes-list">
        {notes.map((note) => {
          return (
            <div className="note" key={'note-' + note.createdAt}>
              <p>{note.text}</p>
              <span>{note.author}&nbsp;{new Date(note.createdAt).toLocaleString()}</span>
            </div>
          )})}
      </ul>
      <div>
        <textarea onChange={handleChange}></textarea>
        <div><button onClick={handleSubmit}>Add Note</button></div>
      </div>
    </div>
  );
}

export default inject(({ store }) => ({ store }))(observer(App));