import React, { SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { AppState, AnalysisConfig, AnalysisResult } from '../../../types/types';
import { colorHarmony } from '../evaluator/extension-side/color-harmony';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache()
});

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
  public state = {
    loginUsername: '',
    loginPassword: '',
    position: 'loading', // loading | loggedout | loggedin
  };

  constructor(props: any) {
    super(props);
    this.handleHTMLInputElement = this.handleHTMLInputElement.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get('token', (token) => {
      console.log(token);
      this.setState({
        position: token ? 'loggedin' : 'loggedout'
      });
    });
  }

  handleHTMLInputElement(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit() {
    client
      .query({
        query: gql`query ($username: String!, $password: String!) {
          login(username: $username, password: $password) {
              token
          }
      }`,
        variables: {
          username: this.state.loginUsername,
          password: this.state.loginPassword
        }
      })
      .then(result => {
        chrome.storage.local.set({token: result.data.token}, () => {
          this.setState({
            position: 'loggedin'
          });
        });
      })
      .catch(err => console.log(err));
  }

  logout() {
    chrome.storage.local.set({token: undefined}, () => {
      this.setState({
        position: 'loggedout'
      });
    });
  }

  render() {
    return (
      <div className="container">
        { this.state.position === 'loggedout' &&
          <>
            <form>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" name="loginUsername" onChange={this.handleHTMLInputElement} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" name="loginPassword" onChange={this.handleHTMLInputElement} />
              </div>
            </form>
            <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
          </>
        }
        {
          this.state.position === 'loggedin' &&
          <>
            <button type="button" className="btn btn-link" onClick={this.logout}>Log Out</button>
            <Analyzer />
          </>
        }
      </div>
    )
  }
}

class Analyzer extends React.Component {
  public state: AppState = {
    analyzingStatus: '',
    config: {
      textSize: {
        marking: false,
        minimumSize: 12
      }
    },
    result: {},
    snapshot: null,
  };

  constructor(props: any) {
    super(props);
    init().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { message: "textSize-marking", config: this.state.config });
    });

    this.analyzeHandler = this.analyzeHandler.bind(this);
    this.marktextSizeToggle = this.marktextSizeToggle.bind(this);
    this.setMinimumFontSize = this.setMinimumFontSize.bind(this);
  }

  async analyzeHandler() {
    const tabId = await init();
    this.setState(() => ({ analyzingStatus: 'Please wait...' }));

    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { message: "analyze", config: this.state.config }, (response: AnalysisResult) => {
        console.log(response);

        chrome.tabs.captureVisibleTab({}, async (image) => {
          const colorHarmonyResult = await colorHarmony(image);

          this.setState((prevState: Readonly<AppState>) => {
            const result: AnalysisResult = {
              ...prevState.result,
              colorHarmonyResult,
            }

            return {
              result,
              snapshot: image
            };
          });
        });

        this.setState(() => ({ analyzingStatus: 'Done!', result: response }));
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
          <input type="checkbox" checked={this.state.config.textSize.marking} onChange={this.marktextSizeToggle} /> Show small text marks
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
        {
          this.state.result &&
          <>
            <h2>Result</h2>
            {
              this.state.snapshot &&
              <img src={this.state.snapshot} alt="" width="300px" />
            }
            <h3>Text Size</h3>
            <table>
              <tbody>
                <tr>
                  <th>Total characters in page</th><td>{this.state.result.textSizeResult?.totalCharacters}</td>
                </tr>
                <tr>
                  <th>Total small characters</th><td>{this.state.result.textSizeResult?.totalSmallCharacters}</td>
                </tr>
                <tr>
                  <th>Score</th><td>{this.state.result.textSizeResult?.score}</td>
                </tr>
              </tbody>
            </table>
            <h3>Text Font Type</h3>
            <ul>
              {this.state.result.textFontTypeResult?.fonts.map((stack, i) => (
                <li key={i}>{stack}</li>
              ))}
            </ul>
            <h3>Images</h3>
            <table>
              <tbody>
                <tr>
                  <th>Total images</th><td>{this.state.result.picturesResult?.count}</td>
                </tr>
              </tbody>
            </table>
            {
              this.state.result.colorHarmonyResult?.vibrant &&
              <div>
                <h3>Vibrant / Color Harmony</h3>
                <p>Vibrant: {this.state.result.colorHarmonyResult?.vibrant.Vibrant?.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.result.colorHarmonyResult?.vibrant.Vibrant?.hex }}></span>
                </p>
                <p>Muted: {this.state.result.colorHarmonyResult?.vibrant.Muted?.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.result.colorHarmonyResult?.vibrant.Muted?.hex }}></span>
                </p>
                <p>LightVibrant: {this.state.result.colorHarmonyResult?.vibrant.LightVibrant?.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.result.colorHarmonyResult?.vibrant.LightVibrant?.hex }}></span>
                </p>
                <p>LightMuted: {this.state.result.colorHarmonyResult?.vibrant.LightMuted?.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.result.colorHarmonyResult?.vibrant.LightMuted?.hex }}></span>
                </p>
                <p>DarkVibrant: {this.state.result.colorHarmonyResult?.vibrant.DarkVibrant?.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.result.colorHarmonyResult?.vibrant.DarkVibrant?.hex }}></span>
                </p>
                <p>DarkMuted: {this.state.result.colorHarmonyResult?.vibrant.DarkMuted?.hex}
                  <span style={{ display: 'inline-block', height: 30, width: 75, backgroundColor: this.state.result.colorHarmonyResult?.vibrant.DarkMuted?.hex }}></span>
                </p>
              </div>
            }
          </>
        }
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
