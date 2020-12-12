import React from "react"
const url = 'https://docs.google.com/spreadsheets/d/1z5ZQq9zxV-tOLR3dj_-4fTHgvchs8EYh74De6wTqOBw/export?format=csv';

const fetchBufferString = async (url) => {
  const response = await fetch(url);
  return response.text();
};

function App() {
  const [appState, setAppState] = React.useState({
    textBuffer: '',
    JSON: [],
    headers: []
  });
  React.useEffect( () => {

    function ProcessAndSave(stringBuffer) {
      let arr = stringBuffer.split('\n');
      let jsonObj = [];
      let headers = arr[0].split(',');

      for (let i = 1; i < arr.length; i++) {
        let data = arr[i].split(',');
        let obj = {};
        for (let j = 0; j < data.length; j++) {
          obj[headers[j].trim()] = data[j].trim();
        }
        jsonObj.push(obj);
      }

      setAppState({
        textBuffer: appState.textBuffer,
        JSON: jsonObj,
        headers: headers
      });
    }

    //pre-loaded
    fetchBufferString(url).then((response) => {
      ProcessAndSave(response);
    });

    //set interval
    const interval = setInterval(() => {
      fetchBufferString(url).then((response) => {
        ProcessAndSave(response);
        console.log('Data was updated')
      });
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);

  }, [appState.textBuffer]);

  return (
      <table>
        <thead>
        <tr>{appState.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
        {
          Object.keys(appState.JSON).map((k, i) => {
            return (
                <tr key={i}>
                  {
                    Object.keys(appState.JSON[k]).map((key, i) => {
                      return (
                          <td key={i}>{appState.JSON[k][key]}</td>
                      );
                    })
                  }
                </tr>
            );
          })
        }
        </tbody>
      </table>
  );
}

export default App;
