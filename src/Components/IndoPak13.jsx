import React, { useState, useEffect, useMemo } from "react";
import translation from './Translation.json';
import translation4 from './Translation4.json';
import FlexSearch from 'flexsearch';

export default function IndoPak13() {

  const [trans1, setTrans1] = useState(false);
  const [trans2, setTrans2] = useState(false);
  const [inputText, setInputText] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handlePress = (text) => {
    if (text === 'Translation1') {
      setTrans1(true);
      setTrans2(false);
      setQuery("");
      setInputText("");
    } else {
      setTrans2(true);
      setTrans1(false);
      setQuery("");
      setInputText("");
    }
  };

  const DataTranslation = trans1 ? translation : translation4;

  const index = useMemo(() => new FlexSearch({
    encode: "icase",
    split: /\s+/,
    tokenize: 'full',
  }), []);

  useEffect(() => {
    DataTranslation.forEach((Translation, idx) => {
      index.add(idx, `${Translation}`);
    });
  }, [index, DataTranslation]);

  useEffect(() => {
    if (query === '') {
      setResults([]);
    } else {
      const searchResults = index.search(query, { limit: 10 });
      setResults(searchResults.map(i => ({ translation: DataTranslation[i] })));
    }
  }, [query, index, DataTranslation]);

  const handleQueryChange = e => {
    setInputText(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setQuery(inputText);
  };

  const highlightText = (text, highlight) => {
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.replace(regex, match => `<span style="color: red;">${match}</span>`);
  };

  return (
    <>
      <div className="container">
        <button onClick={() => handlePress('Translation1')} className={trans1 ? 'active' : ''}>
          Translation1
        </button>
        <button onClick={() => handlePress('Translation2')} className={trans2 ? 'active' : ''}>
          Translation2
        </button>
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          className="input"
          placeholder="Search"
          value={inputText}
          onChange={handleQueryChange}
        />
        <button type="submit">Search</button>
      </form>
      <div className="subcontainer">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className="textContainer">
              <p className="TranslationData" dangerouslySetInnerHTML={{ __html: highlightText(item.translation, query) }} />
            </div>
          ))
        ) : (
          query === '' ? (
            DataTranslation.map((item, index) => (
              <div key={index} className="textContainer">
                <p className="TranslationData">
                  {DataTranslation[index]}
                </p>
              </div>
            ))
          ) : null
        )}
      </div>
    </>
  );
}
