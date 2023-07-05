import { useEffect, useState } from "react";
import "./App.scss";

//const url: string = "http://167.99.141.158:10001/";
const url: string = "http://localhost:10001/";

function App() {
  const [candidates, setCandidates] =
    useState<{ id: string; name: string }[]>();
  const [statistic, setStatistic] =
    useState<Map<string, { name: string; votes: number }>>();

  const getVariants = async () => {
    const data = await fetch(`${url}variants`).then((value) => value.json());
    return setCandidates(data);
  };

  const getStatistic = async () => {
    const data = await fetch(`${url}stat`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
    }).then((value) => value.json());
    setStatistic(new Map(Object.entries(data)));
  };

  const onButtonClick = async (id: string) => {
    await fetch(`${url}vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({ id }),
    });
    getStatistic();
  };

  useEffect(() => {
    Promise.all([getVariants(), getStatistic()]);
  }, []);

  const createCandidate = (name: string, i: string) => {
    return (
      <div key={i} className="candidate">
        <div className="candidate__title">
          {name}: {statistic!.get(i)!.votes}
        </div>
        <button
          className="candidate__vote-btn"
          onClick={() => onButtonClick(i)}
        >
          Проголосовать
        </button>
      </div>
    );
  };
  return (
    <div className="App">
      <div className="container">
        <h1 className="header">Выборы</h1>
        <div className="candidates-list">
          {!!candidates && !!statistic
            ? candidates.map((candidate) => {
                return createCandidate(candidate.name, candidate.id);
              })
            : "Loading..."}
        </div>
      </div>
    </div>
  );
}

export default App;
