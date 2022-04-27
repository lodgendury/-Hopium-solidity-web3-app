import React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";
import Progressbar from './Progress_bar';





export default function App() {
   const [currentAccount, setCurrentAccount] = React.useState("");
  const [allWaves, setAllWaves] = React.useState([]);
    const [load, setLoad] = React.useState(0);
    const [waveText, setWaveText] = React.useState("");
  const [def, setDef] = React.useState("This is where the quotes show up but not to worry we would have something up for you in a moment.");
  const [allMemes, setAllMemes] = React.useState("");
  const [text, setText] = React.useState("Author");
  const [count, setCount] = React.useState(0);
    const [hasError, setError] = React.useState(false);
  const [answer, setAnswer] = React.useState(false);
   const [textareaheight, setTextareaheight] = React.useState(1); 


  
    const contractAddress = "0xf894056619076a2A472fE9408eeA0967e9E1A2Db";
   /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  let start;


    
    React.useEffect(() => {
        //const ail = text[0].word
        fetch(`https://api.quotable.io/random`)
            .then(res => res.json())
            .then(data => setAllMemes(data))
    }, [])
    
    
    //function getImage() {
        //setText()
        //const memesArray = text
        //const randomNumber = Math.floor(Math.random() * memesArray.length)
        //const tit = memesArray[randomNumber]
        //setWord(tit);
        //}
    
    //console.log(allMemes)
    
    

    //doSomething()   // <---- measured code goes between startTime and endTime
    //var startTime = performance.now()

    const getMemeImage = async() => { 
      
      try { 
           setError(false);
        
        const memesArr = allMemes
        //const randomNumber = Math.floor(Math.random() * memesArray.length)
        const url = memesArr.content
        const author = memesArr.author
        const quote = await setDef(url);
        const authr = await setText(author);
        setAnswer(true);
        } catch(error) {
            clearTimeout(start);
            setAnswer(false);
            //console.log(error)
            setError(true);
            //clearTimeout(start);
        }
        
    }

  
    
    //var endTime = performance.now()

    //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
  const showAnswer = () => setAnswer(true)
    
    const repCount = async() => {
      const changeAnswer = await setAnswer(false);
      const clearStart = await clearTimeout(start);
      setCount((c) => c + 1);
    }
    

   /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
  React.useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        
        setCurrentAccount(account);
        getAllWaves();
        
        
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
       setCount(50);
    try {
      const { ethereum } = window;
      

      if (!ethereum) {
        alert("Get MetaMask!");
        setCount(25);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
      setCount(100);
    } catch (error) {
      console.log(error);
      setCount(25);
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  const wave = async () => {
   if (waveText) {    
     setLoad(50);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

   
   let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        

        /*
        * Execute the actual wave from your smart contract
     { gasLimit: 300000 }   */
        
  const waveTxn = await wavePortalContract.wave(waveText);
        
        console.log("Mining...", waveTxn.hash);
        

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setLoad(100);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setLoad(75);
    }
  }
    else {
        console.log("No Text!");
      }
}
  
  function handleChange(event) {
        setWaveText(event.target.value);
         console.log( event.target.rows ) 
    const height = event.target.scrollHeight; 
    const rowHeight = 20; 
    const trows = Math.ceil(height / rowHeight) - 1; 
    
    if (trows, textareaheight) { 
      
      setTextareaheight(trows); 
      
    } 
    }
  
  return (
    <main>
       <header>
      <h2>!Hopium</h2>
      {!currentAccount && (<button id="connectButton" onClick={connectWallet}>
              { (count === 0) && (<p>Connect Wallet</p>)} { 
             (count === 50) && (<div class="loader">
  <span class="loader__element"></span>
  <span class="loader__element"></span>
  <span class="loader__element"></span>
</div>)}{(count === 100) && (<p>Connected!</p>)}{(count === 25) && (<p>Retry</p>)}
          </button>)}
      
      </header>
    <div className="mainContainer">
     
      <div className="dataContainer">
       
        

     <div className="dblue">
      <section className="projects">
       <h3>Win Crypto by Journaling</h3>

        <p className="bio">Hit the GM box for today's awesome quote before you <a href="#animated-shadow-quote">get started?</a>
        </p>
       <div className="button" onClick={getMemeImage}>
            <div className="marquee">
              <p> GM GM GM GM GM GM GM GM GM GM GM GM GM GM GM GM</p>
            <p className="marquee2"> GM GM GM GM GM GM GM GM GM GM GM GM GM GM GM GM</p>
            </div>
        
       
       </div>

    
        
      <article>
         
           
           {hasError && <p className="textbox"     onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}>Oops! Click Play Again</p>}
           <div id="animated-shadow-quote">
  {!hasError, answer && (<blockquote>
    <p onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}>{def}</p>
    <cite>{text}</cite>
  </blockquote>)}
  </div> 
       </article>  
    </section></div>
    
    <div id="second--dblue">
      <section id="second--projects">
      
        <h3>Start Journaling!</h3>
      <article>
         
           
           {hasError && <p className="textbox"     onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}>Oops! Click Play Again</p>}
           <div class="second--section">
  {!hasError && (<div className="section--text">
    <p id="textbox"     onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}>Hey fren, note down something cool you've done or achieved recently, doesn't matter how little it may seem, it matters! you could also mention whatever you are looking to achieve next or soon. {!currentAccount && (<p className="connectReminder"> Connect Wallet to Proceed!</p>)} </p>
    <textarea 
                rows={textareaheight} 
                placeholder="Click here to type..." 
                onChange={handleChange}
                onClick={() => setLoad(0)}
                name="comments"
                id="answer--input"
                    value={waveText}  />
    
    <p className="funfact">Fun Fact: Every day a random wallet address gets 1 ETH to support their dreams!</p>
  </div>)}

             
  </div> 
       </article> 
         <div className="header">
       {currentAccount && (<div className="sendButton" onClick={wave}>
           { (load === 0) && (<p>SEND & SAVE </p>)} { 
             (load === 50) && (<div class="loader">
  <span class="loader__element"></span>
  <span class="loader__element"></span>
  <span class="loader__element"></span>
</div>)}{(load === 100) && (<p>SENT & SAVED!</p>)}{(load === 75) && (<p>RETRY</p>)}
          </div>)}
           {!currentAccount && (<div className="sendButton" >
           <p>SEND & SAVE</p>
          </div>)}
           
       
       </div>

    
    </section></div>
    <div className="second--dblue">
      <section className="third--projects">
              
        
      <article>
         
           
           {hasError && <p className="textbox"     onCopy={(e)=>{
      e.preventDefault()
      return false;
    }}>Oops! Click Play Again</p>}
         <div>
   {allWaves.map((wave, index) => {
          return (<div>
            {(index % 2 == 0) && (<div key={index} class="left-message-div">
              <div className="leftMessage">Address: {wave.address}</div>
              <div className="leftMessage">Time: {wave.timestamp.toString()}</div>
              <div className="leftMessage">Notes: {wave.message}</div> </div>)}
            {
            !(index % 2 == 0) && (<div key={index} className="right-message-div">
              <div className="rightMessage">Address: {wave.address}</div>
              <div className="rightMessage">Time: {wave.timestamp.toString()}</div>
              <div className="rightMessage">Notes: {wave.message}</div>
            </div>)
            } 
          </div>)
        })}
  </div> 
          
       </article> 

    
    </section></div>
        





        
     
  
      </div>
    </div>
    </main>
  );
    
}
