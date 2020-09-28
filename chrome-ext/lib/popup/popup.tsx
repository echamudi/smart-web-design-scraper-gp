import React from 'react';
import ReactDOM from 'react-dom';
import { AppState, AnalysisConfig, AnalysisResult } from '../../../types/types';
import Vibrant from 'node-vibrant';

// Returns tabId number
async function init(): Promise<number> {
  return new Promise((resolve) => {
    let tabId: number | undefined;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0].id;
      if (tabId === undefined) throw new Error('Tab id is undefined');

      chrome.tabs.executeScript(tabId, { file: 'content.js' }, function () {
        resolve(tabId);
      });
    });
  });
}

// chrome.tabs.captureVisibleTab({}, function (image) {
//   console.log(image);
// });

// chrome.windows.create({
//   url: '/report.html',
//   type: 'popup'
// }, function (window) { });

class App extends React.Component {
  public state: AppState = {
    analyzingStatus: '',
    config: {
      textSize: {
        marking: false,
        minimumSize: 12
      }
    },
    result: null,
    vibrantTemp: null,
    imageTemp: null,
  };

  constructor(props:any) {
    super(props);
    init().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { message: "textSize-marking", config: this.state.config});
    });
    
    this.analyzeHandler = this.analyzeHandler.bind(this);
    this.marktextSizeToggle = this.marktextSizeToggle.bind(this);
    this.setMinimumFontSize = this.setMinimumFontSize.bind(this);
  }

  async analyzeHandler() {
    const tabId = await init();
    this.setState(() => ({ analyzingStatus: 'Please wait...' }));
    const $this = this;
  
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { message: "analyze", config: this.state.config}, (response: AnalysisResult) => {
        console.log(response);

        // TODO: refactor vibrant
        chrome.tabs.captureVisibleTab({}, function (image) {
          $this.setState(() => ({ imageTemp: image }));
          // You can add that image HTML5 canvas, or Element.
          Vibrant.from(image).getPalette((err, palette) => {
            console.log(palette);
            $this.setState(() => ({ vibrantTemp: palette }));
          });
        });
       
        $this.setState(() => ({ analyzingStatus: 'Done!', result: response }));
      });
    }, 100);
  };

  marktextSizeToggle(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState((prevState: Readonly<AppState>) => {
      const config: AnalysisConfig = {
        ...prevState.config,
        textSize: {
          ...prevState.config.textSize,
          marking: !prevState.config.textSize.marking
        }
      }

      return { config };
    });
  };

  setMinimumFontSize(e: React.ChangeEvent<HTMLInputElement>) {
    e.persist();
    this.setState((prevState: Readonly<AppState>) => {
      const config: AnalysisConfig = {
        ...prevState.config,
        textSize: {
          ...prevState.config.textSize,
          minimumSize: e.target.value as unknown as number
        }
      }

      return { config };
    });
  }

  render() {
    return (
      <div>
        <h1>Web Design Scraper</h1>
        <h2>Parameters</h2>
        <h3>Text Size</h3>
        <label>
          <input type="checkbox" checked={this.state.config.textSize.marking} onChange={this.marktextSizeToggle}/> Show small text marks
        </label>
        <br />
        <div>
          <input type="range" min="1" max="30" value={this.state.config.textSize.minimumSize} onChange={this.setMinimumFontSize} />
        </div>
        <div>
          Minimum Font Size: {this.state.config.textSize.minimumSize ?? 16}
        </div>
        <h2>Analyze</h2>
        <button onClick={this.analyzeHandler} className="main-button">
          Analyze
        </button>
        <div>{this.state.analyzingStatus}</div>
        <h2>Result</h2>
        {
          this.state.result &&
          <div>
            {
              this.state.imageTemp &&
              <img src={this.state.imageTemp} alt="" width="300px"/>
            }
            <h3>Text Size</h3>
            <table>
              <tbody>
                <tr>
                  <th>Total characters in page</th><td>{this.state.result.textSizeResult.totalCharacters}</td>
                </tr>
                <tr>
                  <th>Total small characters</th><td>{this.state.result.textSizeResult.totalSmallCharacters}</td>
                </tr>
                <tr>
                  <th>Score</th><td>{this.state.result.textSizeResult.score}</td>
                </tr>
              </tbody>
            </table>
            <h3>Text Font Type</h3>
            <ul>
              {this.state.result.textFontTypeResult.fonts.map((stack, i) => (
                <li key={i}>{stack}</li>
              ))}
            </ul>
            <h3>Images</h3>
            <table>
              <tbody>
                <tr>
                  <th>Total images</th><td>{this.state.result.picturesResult.count}</td>
                </tr>
              </tbody>
            </table>
            {
              this.state.vibrantTemp &&
              <div>
                <h3>Vibrant / Color Harmony</h3>
                <p>Vibrant: {this.state.vibrantTemp.Vibrant.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.vibrantTemp.Vibrant.hex }}></span>
                </p>
                <p>Muted: {this.state.vibrantTemp.Muted.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.vibrantTemp.Muted.hex }}></span>
                </p>
                <p>LightVibrant: {this.state.vibrantTemp.LightVibrant.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.vibrantTemp.LightVibrant.hex }}></span>
                </p>
                <p>LightMuted: {this.state.vibrantTemp.LightMuted.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.vibrantTemp.LightMuted.hex }}></span>
                </p>
                <p>DarkVibrant: {this.state.vibrantTemp.DarkVibrant.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.vibrantTemp.DarkVibrant.hex }}></span>
                </p>
                <p>DarkMuted: {this.state.vibrantTemp.DarkMuted.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.vibrantTemp.DarkMuted.hex }}></span>
                </p>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
