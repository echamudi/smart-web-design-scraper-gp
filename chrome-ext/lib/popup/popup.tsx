import React, { SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { AppState, AnalysisConfig, AnalysisResult, ImageProcessingSpringTestAll } from 'Shared/types/types';
import { DominantColorsResult, SymmetryResult, ColorCountResult } from 'Shared/types/factors';
import { dominantColors } from '../evaluator/extension-side/dominant-colors';
import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql } from 'Shared/node_modules/@apollo/client/core';
import { login } from 'Shared/apollo-client/auth'
import { symmetry } from '../evaluator/extension-side/symmetry';
import { colorCount } from '../evaluator/extension-side/color-count';
import { density } from '../evaluator/extension-side/density';

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
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
    chrome.storage.local.get((items) => {
      console.log(items);
      this.setState({
        position: items.token ? 'loggedin' : 'loggedout'
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
    login(client, this.state.loginUsername, this.state.loginPassword)
    .then(result => {
        chrome.storage.local.set({ token: result.data.login.token }, () => {
          this.setState({
            position: 'loggedin'
          });
        });
      })
      .catch(err => console.log(err));
  }

  logout() {
    chrome.storage.local.set({ token: false }, () => {
      this.setState({
        position: 'loggedout'
      });
    });
  }

  render() {
    return (
      <div className="container">
        {this.state.position === 'loggedout' &&
          <>
            <div className="h3">Smart Web Design Scraper</div>
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
      },
      pictures: {
        acceptableThreshold: 10
      },
      symmetry: {
        acceptablePercentage: 80
      },
      dominantColors: {
        vibrantMaxAreaPercentage: 5
      },
      density: {
        acceptableThreshold: 80
      }
    },
    result: {},
    snapshot: null,
    lastReceiptId: undefined
  };

  constructor(props: any) {
    super(props);
    init().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { message: "textSize-marking", config: this.state.config });
    });

    this.analyzeHandler = this.analyzeHandler.bind(this);
    this.marktextSizeToggle = this.marktextSizeToggle.bind(this);
    this.setMinimumFontSize = this.setMinimumFontSize.bind(this);
    this.openQuickReport = this.openQuickReport.bind(this);
  }

  async analyzeHandler() {
    const tabId = await init();
    this.setState(() => ({ analyzingStatus: 'processing', lastReceiptId: undefined }));

    // Get screenshots
    const image: string = await new Promise<string>((resolve, reject) => {
      chrome.tabs.captureVisibleTab({}, async (image) => {
        resolve(image);
      });
    });

    // Fetch Java ImageProcessingSpring TestAll

    const ipsTestAll = await new Promise<ImageProcessingSpringTestAll>((resolve, reject) => {
      fetch("http://localhost:3003/test/all", {
          method: "POST",
          body: JSON.stringify({img: image}),
          headers: {
              'Content-Type': 'application/json'
          },
      }).then((res) => {
          res.json().then((obj) => {
              resolve(obj);
          })
      }).catch(err => {
          reject(err);
      })
    });

    console.log('ipsTestAll', ipsTestAll);

    // Calculate all sync values
    const symmetryResult = symmetry(ipsTestAll.symmetryResult);
    const densityResult = density(ipsTestAll.densityResult);

    // Calculate all async values
    let [analysisResult, dominantColorsResult, colorCountResult] = await Promise.allSettled([
      new Promise<Partial<AnalysisResult>>((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, { message: "analyze", config: this.state.config }, (response: Partial<AnalysisResult>) => {
          resolve(response);
        });
      }),
      new Promise<DominantColorsResult>((resolve, reject) => {
        chrome.tabs.captureVisibleTab({}, async (image) => {
          const result = await dominantColors(image);
          resolve(result);
        });
      }),
      new Promise<ColorCountResult>(async (resolve, reject) => {
        const result = await colorCount(image);
        resolve(result);
      }),
    ]);

    if (analysisResult.status === 'rejected') {
      console.log('Can\'t get analysisResult');
      return;
    }

    // Combine contentside result with extensionside result
    const finalAnalysisResult: Partial<AnalysisResult> = {
      ...analysisResult.value,
      html: '', // remove html for now
      symmetryResult,
      densityResult,
      dominantColorsResult: dominantColorsResult.status === 'fulfilled' ? dominantColorsResult.value : undefined,
      colorCountResult: colorCountResult.status === 'fulfilled' ? colorCountResult.value : undefined,
      screenshot: image
    };

    // if (this.state.snapshot) {
    //   analysisResult.screnshot = this.state.snapshot;
    // }

    // Get token
    const token: string = await new Promise<string>((resolve, reject) => {
      chrome.storage.local.get('token', (items) => {
        resolve(items.token);
      });
    });

    console.log('finalAnalysisResult', finalAnalysisResult);

    // Send result to server
    const sentReceipt = await client.mutate({
      mutation: gql`mutation ($data: String!, $url: String!) {
        saveAnalysis(data: $data, url: $url)
      }`,
      variables: {
        data: JSON.stringify(finalAnalysisResult),
        url: finalAnalysisResult.browserInfoResult?.url
      },
      context: {
          headers: {
            'x-access-token': token
          }
      }
    });

    console.log('sentReceipt', sentReceipt);

    this.setState(() => ({ analyzingStatus: 'Done!', result: finalAnalysisResult, snapshot: image, lastReceiptId: sentReceipt.data?.saveAnalysis }));
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

  openQuickReport() {
    if (typeof this.state.lastReceiptId === 'string' && this.state.lastReceiptId.length > 1) {
      chrome.tabs.create({ url: 'http://localhost:3000/analysis-result?q=' + this.state.lastReceiptId });
    }
  }

  render() {
    return ( 
      <div>
        <div className="card">
          <div className="card-header">
            Analyze
          </div>
          <div className="card-body">
            {/* <h5 className="card-title">Font Size</h5>
            <label>
              <input type="checkbox" checked={this.state.config.textSize.marking} onChange={this.marktextSizeToggle} /> Show small text marks
            </label>
            <br />
            <div>
              <input type="range" min="1" max="30" value={this.state.config.textSize.minimumSize} onChange={this.setMinimumFontSize} />
            </div>
            <div>
              Minimum Font Size: {this.state.config.textSize.minimumSize ?? 16}
            </div> */}
            <button type="button" className="btn btn-primary" onClick={this.analyzeHandler}>Analyze</button>
          </div>
        </div>

        <div className="card" style={{marginTop: '20px'}}>
          <div className="card-body">
            {
              this.state.analyzingStatus === 'processing' &&
              <div className="spinner-border text-primary" role="status">
              </div>
            }
            {
              this.state.lastReceiptId &&
              <button type="button" className="btn btn-primary" onClick={this.openQuickReport}>Open Report</button>
            }
          </div>
          </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
