import "./App.css";
import { useState, useRef } from "react";

// groupby function
function groupBy(objects, property) {
  // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
  // value for property (obj[property])
  if (typeof property !== "function") {
    const propName = property;
    property = (obj) => obj[propName];
  }

  const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
  for (const object of objects) {
    const groupName = property(object);
    //Make sure that the group exists
    if (!groupedObjects.has(groupName)) {
      groupedObjects.set(groupName, []);
    }
    groupedObjects.get(groupName).push(object);
  }

  // Create an object with the results. Sort the keys so that they are in a sensible "order"
  const result = {};
  for (const key of Array.from(groupedObjects.keys()).sort()) {
    result[key] = groupedObjects.get(key);
  }
  return result;
}

// Add "s" or not
function addS(num) {
  if (num === 1) {
    return "";
  } else {
    return "s";
  }
}

function App() {

  const [input, setInput] = useState("");
  const [savedWords, setSvaedWords] = useState([]);
  const [showName, setshowName] = useState("");
  const [showList, setShowList] = useState(<ul></ul>);

  const makeShowList = (data, isRhyme) =>{
    if(data.length ===0){
      setshowName("(no results)")
      return
    }
    if (isRhyme) {
      data = groupBy(data, "numSyllables");
      let result = [];
      for (let ele in data) {
        result.push(
          <div key={Math.random()}>
            <h3 >{ele+' syllable'+addS(Number)}</h3>
            <ul>
              {data[ele].map((item) => {
                return (
                  <li key={Math.random()}>
                    {item.word}
                    <button className="btn btn-outline-success" onClick={() => {
                      setSvaedWords((savedWords) => {
                        const tempList = savedWords.concat();
                        tempList.push(item.word)
                        return tempList
                      })
                    }}>(save)</button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }
      return result;
    } else{
      return data.map((item) => (
        <li key={Math.random()}>
          {item.word}
          <button className="btn btn-outline-success" onClick={() => {
            setSvaedWords((savedWords) => {
              const tempList = savedWords.concat();
              tempList.push(item.word);
              return tempList
            })
          }}>(save)</button>
        </li>
      ))
    }
}



const clickOnRhyme = () => {
  setshowName('...loading');
  setShowList();
  fetch(
    `https://api.datamuse.com/words?${new URLSearchParams({
      rel_rhy: input,
    }).toString()}`
  ).then((response) => response.json())
  .then((data) => {
    setshowName(`Words that rhyme with ${input}: `);
    setShowList(makeShowList(data, true));
  }, 
  (err) => {
    console.log('err');
  });
}


const clickOnSynonyms = () => {
  setshowName('...loading');
  setShowList();
  fetch(
    `https://api.datamuse.com/words?${new URLSearchParams({
      ml: input,
    }).toString()}`
  ).then((response) => response.json())
  .then((data) => {
    setshowName(`Words with a meaning similar to ${input}: `);
    setShowList(makeShowList(data, false));
  }, 
  (err) => {
    console.log('err');
  });
}


// HITS "ENTER", SHOW RHYMING WORDS
const pressEnter = (event) =>{
  if (event.key === 'Enter'){
    clickOnRhyme()
  }
}

return (
  <div className="App">
    <div>Repo Address: <a href="https://github.com/yunleeumich/si579_problemset_6" 
        target="_blank">https://github.com/yunleeumich/si579_problemset_6</a>
    </div>
    <div>
      <h1 className="row">Rhyme Finder (579 Probelm Set 6)</h1>
      <div className="row">
        <div className="col">
          Saved words: <span id="saved_words">{savedWords.join(", ")}</span>
        </div>
      </div>
      <div className="row">
        <div className="input-group col">
          <input className="form-control" type="text" placeholder="Enter a word" value={input} onChange={(e) => {
            setInput(e.target.value);
            }} onKeyDown={pressEnter}/>
          
          <button id="show_rhymes" type = "button" className="btn btn-primary" onClick={clickOnRhyme}>
            Show rhyming words
          </button>
          <button id="show_synonyms" type="button" className="btn btn-secondary" onClick={clickOnSynonyms}>
            Show synonyms
          </button>
        </div>
      </div>
      <div className="row">
        <h2 className="col" id="output_description">
          {showName}
        </h2>
      </div>
      <div className="output row">
        <output id="word_output" className="col">
          {showList}
        </output>
      </div>
    </div>
  </div>
);
}

export default App;