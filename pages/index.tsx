import { useAddress, useContract, Web3Button, useClaimedNFTSupply, useUnclaimedNFTSupply, ThirdwebNftMedia, useContractMetadata, useNFTs } from "@thirdweb-dev/react";
import { ClaimCondition, ClaimOptions, SignedPayload721WithQuantitySignature } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import { type } from "os";
import { id, _toEscapedUtf8String } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const signatureDropAddress = "0xE1fa992aC192186eF50Adf4F4CEa80E6a07cfd48";  {/*adresa test/Wotify signature drop*/}

const Home: NextPage = () => {
  const address = useAddress();
  {/*povezivanje sa test/Wotify contract-om*/}
  const { contract: signatureDrop } = useContract(
    signatureDropAddress,
    "signature-drop"
  );

  // new - conecting to NFTs

  const{data: nfts, isLoading} = useNFTs(signatureDrop);
  const{data: metadata, isLoading: loadingMetadata} = useContractMetadata(signatureDrop);

  {/*useState koji prati alerte koji idu kroz userAlert promenljivu*/}
  const[userAlert, setAlert] = useState('WALLET CONNECTED!..READY TO MINT 1 TANK..');

  


      // Load claimed supply and unclaimed supply
  const { data: unclaimedSupply } = useUnclaimedNFTSupply(signatureDrop);
  const { data: claimedSupply } = useClaimedNFTSupply(signatureDrop);



  

  // useEffect for minted event
 
  //original animate arg ([{opacity: 0}, {opacity: 1}, {opacity: 0}], {duration: 4000, iterations: 3 })

    useEffect(() => {
      
      setTimeout(() => {
        document.getElementById("card1")?.animate([{opacity: 0.2}, {opacity: 1}], {duration: 1500, iterations: 6 });
        document.getElementById("card2")?.animate([{opacity: 0.2}, {opacity: 1}], {duration: 1500, iterations: 6 }); 
      }, 3000);
    }, [claimedSupply?.toNumber()])

    // function for css dot animation

    useEffect(() => {
      document.getElementById("dot1")?.animate([{opacity: 1}, {opacity: 0.1}], {duration: 4000, iterations: Infinity });
      setTimeout(() => {
        document.getElementById("dot2")?.animate([{opacity: 1}, {opacity: 0.1}], {duration: 4000, iterations: Infinity });
        setTimeout(() => {
          document.getElementById("dot3")?.animate([{opacity: 1}, {opacity: 0.1}], {duration: 4000, iterations: Infinity });
          setTimeout(() => {
            document.getElementById("dot4")?.animate([{opacity: 1}, {opacity: 0.1}], {duration: 4000, iterations: Infinity });
          }, 1000)
        }, 1000)
      }, 1000)
    },[])

    useEffect(() => {
     
        document.getElementById("quantityAddressTrue")?.animate([{opacity: 0}, {opacity: 1}], {duration: 6000, iterations: 1 });
      
        document.getElementById("quantityAddressFalse")?.animate([{opacity: 0}, {opacity: 1}], {duration: 6000, iterations: 1 });
      
      
    },[address])



  



  // kod za pristup user inputu za mint quantity

  {/*
  var finalMintQuantity : number = 0;
  function changeMintQuantity(){
    const userInput = document.getElementById("userInput") as HTMLInputElement | null;
    if ((userInput != null)){
      finalMintQuantity = Number(userInput.value);
      console.log("changed to " + finalMintQuantity);
      setAlert(`Success!...ready.to.mint_${finalMintQuantity}_tanks(s)...`);
    }else{
      console.log(finalMintQuantity);
      setAlert(`oops!...browser.glitch...please.choose.again...`);
      return; 
    }
  }
*/}

 // var mintQuantity : number = 0;
  const[mintQuantity , editMintQuantity] = useState(1);

  //set
  function setMintQuantity(){
    const userInput = document.getElementById("userInput") as HTMLInputElement | null;

    if(userInput == null){
      setAlert(`oops!...browser.glitch...please.choose.again...`);
      return;
    }else{
      let tempVar : number = Number(userInput.value);
      if((Number.isInteger(tempVar)) && (0 < tempVar) && (tempVar <= 5)){
        editMintQuantity(tempVar);
        console.log("quantity is now: " + mintQuantity);
        setAlert(`all.good!...quantity.set.to.${tempVar}...ready.to.mint.some.tanks...pick.one.mint.button...`);
      }else{
        setAlert(`oops!...can't.mint.${tempVar}.tank(s)...pick.a.whole.number.between.0.and.6...`);
        editMintQuantity(0);
        return;
      }
    }
  }

  //reset
  function resetMintQuantity(){
    editMintQuantity(0);
    setAlert(`reset.done!...quantity.set.to.0...pick.a.new.whole.number.between.0.and.6...`);
  }
 
  //increase
  function increaseMintQuantity(){
    const shutterSound = new Audio("/finger.wav");
    shutterSound.play();
    if(mintQuantity < 5){
      let plusVar : number = mintQuantity;
      plusVar = plusVar + 1;
      editMintQuantity(plusVar);
      setAlert(`READY TO MINT ${plusVar} TANKS..PICK ONE MINT BUTTON..`);
    }else{
      setAlert("MAX QUANTITY PER TRANSACTION IS 5..READY TO MINT 5 TANKS..");
      return;
    }
  }

  //decrease
  function decreaseMintQuantity(){
    const shutterSoundDec = new Audio("/finger.wav");
    shutterSoundDec.play();
    if(mintQuantity > 1){
      let minusVar : number = mintQuantity;
      minusVar = minusVar - 1;
      editMintQuantity(minusVar);
      setAlert(`READY TO MINT ${minusVar} TANK(S)..PICK ONE MINT BUTTON..`);
    }else{
      setAlert("MIN QUANTITY PER TRANSACTION IS 1..READY TO MINT 1 TANK..");
      return;
    }
  }

  //on address disconect resets mintQuantity and userAlert
  function resetQtAndAlert(){
    editMintQuantity(1);
    setAlert('wallet.connected...ready.to.mint.1.Tank...reset.quantity.or.pick.one.mint.button...');
    return;
  }


  // claim function..............................................
  

  async function claim() {

    const claimSound = new Audio("/finger.wav");
    claimSound.play();

    document.getElementById("minusButton")?.setAttribute("disabled", "");
    document.getElementById("plusButton")?.setAttribute("disabled", "");

    try {
      setAlert(`MINTING ${mintQuantity} TANK(S) FOR ${(0.05*mintQuantity).toFixed(4)} ETH..PLEASE WAIT..`); //uneti cenu i valutu
      const tx = await signatureDrop?.claim(mintQuantity);
      setAlert(`SUCCESS!..${mintQuantity} WOTIFY TANK(S) MINTED!`);
      editMintQuantity(1);
      const endClaimSound = new Audio("/spaceship.wav");
      endClaimSound.play();

      document.getElementById("minusButton")?.removeAttribute("disabled");
      document.getElementById("plusButton")?.removeAttribute("disabled");
            
    } catch (error: any) {
      console.log(error?.message);
      setAlert(`FAILED TXN!..REJECTED BY USER, SHORT FUNDS, SOLD OUT..RETRY?`);
      const endClaimSound2 = new Audio("/fail.wav");
      endClaimSound2.play();

      document.getElementById("minusButton")?.removeAttribute("disabled");
      document.getElementById("plusButton")?.removeAttribute("disabled");
    }
  }


  //  claim with signature
  async function claimWithSignature() {

    document.getElementById("minusButton")?.setAttribute("disabled", "");
    document.getElementById("plusButton")?.setAttribute("disabled", "");

    const claimSoundSig = new Audio("/finger.wav");
    claimSoundSig.play();
    setAlert(`PREMIUM KEY CHECK..`);
   
    const signedPayloadReq = await fetch(`/api/generate-mint-signature`, {
      method: "POST",
      body: JSON.stringify({
        address: address, mintQuantity: mintQuantity,
      }),
    });       {/*dodao mintQuantity i prosledjujem ga sa address ka API*/}

    console.log(signedPayloadReq);

    if (signedPayloadReq.status === 400) {
      setAlert('KEY NOT FOUND!..USE REGULAR MINT OR MINT THE KEY FIRST..');
      const endClaimSoundSig2 = new Audio("/fail.wav");
      endClaimSoundSig2.play();

      document.getElementById("minusButton")?.removeAttribute("disabled");
      document.getElementById("plusButton")?.removeAttribute("disabled");

      return;
    } else {
      try {
        const keyFoundSound = new Audio("/key.wav");
        keyFoundSound.play();
        setAlert(`KEY FOUND!..MINTING ${mintQuantity} TANK(S) FOR ${(0.025*mintQuantity).toFixed(4)} ETH..PLEASE WAIT..`);
        const signedPayload =
          (await signedPayloadReq.json()) as SignedPayload721WithQuantitySignature;

        console.log(signedPayload);

        const nft = await signatureDrop?.signature.mint(signedPayload);

        setAlert(`SUCCESS!..${mintQuantity} WOTIFY TANK(S) MINTED WITH DISCOUNT!`);
        const endClaimSoundSig = new Audio("/spaceship.wav");
        endClaimSoundSig.play();

       document.getElementById("minusButton")?.removeAttribute("disabled");
       document.getElementById("plusButton")?.removeAttribute("disabled");
        
      } catch (error: any) {
        console.log(error?.message);
        setAlert(`FAILED TXN!..REJECTED BY USER, SHORT FUNDS, SOLD OUT..RETRY?`);
        const endClaimSoundSig3 = new Audio("/fail.wav");
        endClaimSoundSig3.play();

        document.getElementById("minusButton")?.removeAttribute("disabled");
        document.getElementById("plusButton")?.removeAttribute("disabled");
      }
    }
  
  }

  {/*MINTER..............................................................................*/}

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={styles.h1}>Wotify Minting DApp - Test</h1>    {/*title*/}
      {/*description*/}
      <p className={styles.describe}>     
        <b>Wotify Premium Key</b> is a free-to-mint community and benefits key that gives you a 50% minting discount for  Wotify collection and more benefits and discounts in future collections.{" "}
        <a href="https://tokenrolla.com/wotify-premium-key" target="_blank" rel="noreferrer">Mint the Key</a>{" "}first or mint a Tank using the regular mint button.
      </p>
      {/*new - metadata and nfts*/}
      {/*<img src={metadata?.image} width="20" />*/}
      

    {/*walllet, messages and claimed so far*/}
    <div className={styles.contractAndAppData}>
      {/*connected wallet final*/}
        {
          address?(
            <code>CONNECTED WALLET : {address}</code>
          ):(
            <code>CONNECTED WALLET : WAITING..CONNECT YOUR WALLET..</code>
          )
        }
      

      {/*alerts display - my css*/}
      <div>
      {
        address?(
            <p><span className={styles.blinker}>▶</span><code>{userAlert}</code></p>
            
        ):(
            <p><span className={styles.blinker}>▶</span><code>WELCOME!..CONNECT YOUR WALLET TO START MINTING..</code></p>
        )
      }     
      </div>


      {/*my version of "claimed so far" */}
      
        {
          claimedSupply && unclaimedSupply ? (
              <code>
              TANKS MINTED SO FAR :<span className={styles.claimedSoFarNumber}>{" "}{claimedSupply.toNumber()}{" | "}{claimedSupply.toNumber() + unclaimedSupply.toNumber()}</span>
              </code>
          ):(
              <code>
              <span>TANKS MINTED SO FAR :{" "}LOADING CONTRACT DATA..</span>
              </code>
          )
        }
    </div>


      
      {/*input box
      {
      address?(
      <div className={styles.quantityContainer}>
      <label><code>enter mint quantity:</code></label>
      <br/><br/>
      <button className={styles.mainButton} type="submit" onClick={() => setMintQuantity()}>S</button>
      <input id="userInput" type="number" name="userInput" min="1" max="5" autoFocus/>
      <button className={styles.mainButton} type="reset" onClick={() => resetMintQuantity()}>R</button>
      </div>
      ):(<div className={styles.quantityContainerNoAddress}>
        <code>...waiting for the wallet address to load the <b>MINT QUANTITY SECTION</b>...</code>

      </div>)}*/}


         {/*set mint quantity box v2*/}
         {
      address?(
      <div className={styles.quantityContainer} id="quantityAddressTrue">
        <span className={styles.quantityBoxText}>QUANTITY</span>
        <button className={styles.mainButton} onClick={() => decreaseMintQuantity()} id="minusButton">-</button>
        <span className={styles.quantityNumber}>{mintQuantity}</span>
        <button className={styles.mainButton} onClick={() => increaseMintQuantity()} id="plusButton">+</button>
        <span className={styles.quantityBoxText}>QUANTITY</span>
      </div>):(
        <div className={styles.quantityContainer} id="quantityAddressFalse">
        <span className={styles.quantityBoxText}>OFF</span>
        <button className={styles.mainButton} disabled>-</button>
        <span className={styles.quantityNumber}>Qty</span>
        <button className={styles.mainButton} disabled>+</button>
        <span className={styles.quantityBoxText}>OFF</span>
      </div>
      )
      } 

 






      <div className={styles.nftBoxGrid}>
        <div className={styles.optionSelectBox}>
          <img src={`/blue_tank.png`} alt="wotify tank" className={styles.cardImg}/>
          
          {/*title or sold out state if claimedSupply.toNumber() == 0*/}
          {
            unclaimedSupply?.toNumber() == 0?(
              <p className={styles.soldOutText}>SOLD OUT ▶ BUY A TANK ON <a href="https://opensea.io/Wotify-NFTs" className={styles.linkBelowButton} target="_blank" rel="noreferrer">OPENSEA</a></p>
            ):(
              <h2 className={styles.selectBoxTitle}>Mint</h2>
            )
          }


          {/*mint detector*/}
          <p className={styles.mintDetectorText}>
            new mint
            <img src="/blue_bulb3.png" alt="blue light bilb" width={28} id="card1" className={styles.mintAlertImage}></img>
            detector
          </p>
          
          <p className={styles.selectBoxDescription}>
             Tank price 0.05 ETH | 5 per transaction | unlimited per address | max supply 30k | Ethereum
          </p>

          <Web3Button
            contractAddress={signatureDropAddress}
            action={() => claim()}
            colorMode="light"
          >
            MINT
          </Web3Button>
          {/*if uclaimedSupply == 0 show "sold out" text*/}
          {
            unclaimedSupply?.toNumber() == 0?(
              <p className={styles.soldOutText}>SOLD OUT ▶ BUY A TANK ON <a href="https://opensea.io/Wotify-NFTs" className={styles.linkBelowButton} target="_blank" rel="noreferrer">OPENSEA</a></p>
            ):(
              <p className={styles.priceBelowButton}>
                Total mint amount : {(mintQuantity * 0.05).toFixed(4)} ETH + fee 
              </p>
            )
          }

          
        </div>


        <div className={styles.optionSelectBox}>
          <img
            src={`/blue_tank_wkey.png`}
            alt="signature-mint"
            className={styles.cardImg}
          />

          {/*title or sold out state if claimedSupply.toNumber() == 0*/}
          {
            unclaimedSupply?.toNumber() == 0?(
              <p className={styles.soldOutText}>SOLD OUT ▶ BUY A TANK ON <a href="https://opensea.io/Wotify-NFTs" className={styles.linkBelowButton} target="_blank" rel="noreferrer">OPENSEA</a></p>
            ):(
              <h2 className={styles.selectBoxTitle}>Mint With Key</h2>
            )
          }

          {/*mint detector*/}
          <p className={styles.mintDetectorText}>
            new mint
            <img src="/blue_bulb3.png" alt="blue light bulb" width={28} id="card2" className={styles.mintAlertImage} ></img>
            detector
          </p>
      
          <p className={styles.selectBoxDescription}>
          <b>- 50%</b> | Tank price 0.025 ETH | 5 per transaction | unlimited per address | max supply 30k | Ethereum
          </p>

          <Web3Button
            contractAddress={signatureDropAddress}
            action={() => claimWithSignature()}
            colorMode="light"
          >
            MINT WITH KEY
          </Web3Button>
          {/*if uclaimedSupply == 0 show "sold out" text*/}
          {
            unclaimedSupply?.toNumber() == 0?(
              <p className={styles.soldOutText}>SOLD OUT ▶ BUY A TANK ON <a href="https://opensea.io/Wotify-NFTs" className={styles.linkBelowButton} target="_blank" rel="noreferrer">OPENSEA</a></p>
            ):(
              <p className={styles.priceBelowButton}>
                Total mint amount : {(mintQuantity * 0.025).toFixed(4)} ETH + fee 
              </p>
            )
          }


         
        </div>
      </div>
      
      

      {/*thirdweb logo*/}
      <p className={styles.thirdwebLink}>
        powered by <a href="https://thirdweb.com/" target="_blank" rel="noreferrer">thirdweb</a><br/><br/>
        <span className={styles.dot1} id="dot1"></span>
        <span className={styles.dot2} id="dot2"></span>
        <span className={styles.dot3} id="dot3"></span>
        <span className={styles.dot4} id="dot4"></span>
      </p>




    </div>
  );
};

export default Home;
