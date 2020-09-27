import React from 'react';
import ReactDOM from 'react-dom';
import { AppState, AnalysisConfig } from '../../../types/types';

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
        minimumSize: 16
      }
    }
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
    this.render();
  
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { message: "analyze", config: this.state.config}, (response) => {
        console.log(response);
        this.setState(() => ({ analyzingStatus: 'Done!' }));
        this.render();
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
        <button onClick={this.analyzeHandler} className="main-button">
          Analyze
        </button>
        <div>{this.state.analyzingStatus}</div>
        <h2>Parameters</h2>
        <h3>Small Texts</h3>
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
        {/* Report button Logout button */}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
