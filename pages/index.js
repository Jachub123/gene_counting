import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import cloneDeep from "lodash/cloneDeep";

export default function Home() {
  const [C1step1, setC1step1] = useState("");
  const [C2step1, setC2step1] = useState("");
  const [C1step2, setC1step2] = useState("");
  const [C2step2, setC2step2] = useState("");
  const [crossbreedR, setcrossbreedR] = useState([]);
  let [cloneWithHighestRating, setCloneWithHighestRating] = useState([]);

  let genePool = [];
  let commonGeneList = [];
  let cloneList = [];
  let geneWeightingList = [];
  let geneWeighting = [];
  let clonesWithMostCommonGenes = [];
  let commonPosition = [];
  let genes = [];
  let otherGenes = [];
  let weakGenesRating = 0;
  let perfectHempSeedY = 4;
  let perfectHempSeedG = 2;
  let neededClones = [];
  let potentialGClones = [];
  let potentialYClones = [];
  let usableGeneList_g = [];
  let usableGeneList_y = [];
  let finalGClones = [];
  let finalYClones = [];
  let crossbreedResults = [];
  let gPositionOfClones = [];
  let yPositionOfClones = [];
  let highestRating = 0;
  let clone = [];
  let copy = [];
  let positionsToChangeToG = [];

  function addGenes() {
    for (let i = 0; i < 6; i++) {
      if (clone) {
        clone[i] = document.getElementById(i).value;
        if (document.getElementById(i).value === "") {
          clone = false;
          return;
        }
      } else {
        if (document.getElementById(i).value !== "") {
          clone = [];
          clone[i] = document.getElementById(i).value;
        } else {
          clone = false;
          return;
        }
      }
    }
  }

  function addClone() {
    if (!clone) {
      return;
    }
    genePool.push(clone.slice());
    const inputFields = document.querySelectorAll(".geneInput");
    inputFields.forEach((input) => {
      input.value = "";
    });

    clone = [];
    giveGeneWeighting();
    rateClone();
    findBestClone();
    findUsableClones();
  }

  function giveGeneWeighting() {
    for (let i = 0; i < genePool.length; i++) {
      genePool[i].map((gene, index) => {
        if (gene === "w" || gene === "x") {
          geneWeighting.push(0.9);
        } else {
          geneWeighting.push(0.5);
        }
        if (index === 5) {
          geneWeightingList[i] = geneWeighting;
          geneWeighting = [];
        }
      });
    }
  }

  function rateClone() {
    let geneCounterY = 0;
    let geneCounterG = 0;
    let weakGenes = [];
    let positionBadGenes = [];

    for (let i = 0; i < genePool.length; i++) {
      genePool[i].map((gene, index) => {
        if (gene === "y") {
          if (geneCounterY < perfectHempSeedY) {
            geneCounterY++;
            weakGenesRating = weakGenesRating + 1;
          } else {
            geneCounterY++;
            weakGenesRating = weakGenesRating + 0.6;
          }
        } else if (gene === "g") {
          if (geneCounterG < perfectHempSeedG) {
            geneCounterG++;
            weakGenesRating = weakGenesRating + 1;
          } else {
            geneCounterG++;
            weakGenesRating = weakGenesRating + 0.6;
          }
        } else {
          if (gene === "h") {
            weakGenesRating = weakGenesRating + 0.5;
          }
          weakGenes.push(gene);
          positionBadGenes.push(index);
        }
        if (index === 5) {
          otherGenes[i] = weakGenes;
          weakGenes = [];
          cloneList[i] = {
            clone: genePool[i],
            cloneWeighting: geneWeightingList[i],
            y: geneCounterY,
            g: geneCounterG,
            badGenes: otherGenes[i],
            positionBadGenes: positionBadGenes,
            rating: parseFloat(weakGenesRating).toFixed(2),
          };
          weakGenesRating = 0;
          geneCounterY = 0;
          geneCounterG = 0;
          positionBadGenes = [];
        }
      });
    }
    console.log("genePool");
    console.log(genePool);
    console.log("cloneList");
    console.log(cloneList);
    console.log("cloneWithHighestRating");
    console.log(cloneWithHighestRating);
    console.log(usableGeneList_g);
    console.log(usableGeneList_y);
  }
  function findBestClone() {
    cloneList.map((clones) => {
      if (highestRating < clones.rating) {
        highestRating = clones.rating;
        cloneWithHighestRating = clones;
      }
    });
  }

  function findUsableClones() {
    //how many G or Y Genes does the best Clone need
    let needG = perfectHempSeedG - cloneWithHighestRating.g;
    let needY = perfectHempSeedY - cloneWithHighestRating.y;
    let iteration = "";
    let stepIteration = 0;

    //If it needs both G and Y Genes it loops through the bad positions of the cloneWithHighestRating(CWHR)
    //for each bad gene Position of the CWHR it searches the "genePool" for g or y genes at the same position
    /* yyyygg
yyyggy
yyggyy
yggyyy
ggyyyy
gyyyyg
gyyygy
gyygyy
gygyyy
ygygyy
ygyygy
ygyyyg
yygygy
yygyyg
yyygyg */

    if (needG > 0) {
      //Braucht der Clone G Gene?

      if (needY < 0) {
        //falls der Clone zu viele, also mehr als 4 Y Gene hat, dann hat er keine schlechten Gene an diesen Positionen. Dann muss für jedes benötigte G-Gen irgend ein Y-Gen ersetzt werden.
        needY = needY * -1; //negativ wird positiv

        for (let i = 0; i < cloneWithHighestRating.clone.length; i++) {
          //jedes CWHR Gen wird durchsucht
          if (needY === 0) {
            return;
          }
          if (cloneWithHighestRating.clone[i] === "y") {
            //wenn es ein y ist
            let cloneListCopy = cloneDeep(cloneList);
            cloneList.map((clone, index) => {
              if (clone.clone[i] === "g") {
                // wird die CloneList nach einem G-Gen an dieser Position durchsucht
                console.log("cloneListCopy");
                console.log(cloneListCopy);
                console.log("cloneList");
                console.log(cloneList);
                cloneListCopy.splice(index, 1);
                positionsToChangeToG.push(i); // wenn gefunden, wird die Position gespeichert
                console.log(positionsToChangeToG);
                positionsToChangeToG.map((position) => {
                  //ein weiteres G-Gen muss dann an der Position bei einem anderen Clone der CloneList gefunden werden.
                  cloneListCopy.map((clone) => {
                    if (clone[position] === "g") {
                      console.log("zweiter Clone gefunden!");
                    }
                  });
                });
                positionsToChangeToG = [];
                needY = needY - 1;
              }
            });
          }
        }
      }
      if (needG > 0) {
        for (let i = 0; i < genePool.length; i++) {
          cloneWithHighestRating.positionBadGenes.map((position) => {
            if (genePool[i][position] === "g") {
              usableGeneList_g.push({
                position: position,
                clone: cloneList[i],
              });
            }
          });
        }
      }
    }
    if (needY > 0 || needG < 0) {
      for (let i = 0; i < genePool.length; i++) {
        cloneWithHighestRating.positionBadGenes.map((position) => {
          if (genePool[i][position] === "y") {
            usableGeneList_y.push({
              position: position,
              clone: cloneList[i],
            });
          }
        });
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Gene Counting</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <label htmlFor="text">Enter Genes:</label>
      <div className="flex">
        <input
          className="geneInput"
          type="text"
          id="0"
          onChange={(e) =>
            e.target.value === "y" ||
            e.target.value === "g" ||
            e.target.value === "h" ||
            e.target.value === "x" ||
            e.target.value === "w"
              ? addGenes()
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="1"
          onChange={(e) =>
            e.target.value === "y" ||
            e.target.value === "g" ||
            e.target.value === "h" ||
            e.target.value === "x" ||
            e.target.value === "w"
              ? addGenes()
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="2"
          onChange={(e) =>
            e.target.value === "y" ||
            e.target.value === "g" ||
            e.target.value === "h" ||
            e.target.value === "x" ||
            e.target.value === "w"
              ? addGenes()
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="3"
          onChange={(e) =>
            e.target.value === "y" ||
            e.target.value === "g" ||
            e.target.value === "h" ||
            e.target.value === "x" ||
            e.target.value === "w"
              ? addGenes()
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="4"
          onChange={(e) =>
            e.target.value === "y" ||
            e.target.value === "g" ||
            e.target.value === "h" ||
            e.target.value === "x" ||
            e.target.value === "w"
              ? addGenes()
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="5"
          onChange={(e) =>
            e.target.value === "y" ||
            e.target.value === "g" ||
            e.target.value === "h" ||
            e.target.value === "x" ||
            e.target.value === "w"
              ? addGenes()
              : (e.target.value = "")
          }
        ></input>
        <button onClick={addClone} formAction="">
          Add Clone
        </button>
      </div>

      <div className="flex">
        <div>
          <h1>Step One: </h1>
          <div>
            <p>{C1step1}</p>
            <p>{C2step1}</p>
            <p>{cloneWithHighestRating.clone}</p>
            <p>{cloneWithHighestRating.clone}</p>
          </div>
        </div>
        {cloneWithHighestRating.positionBadGenes ? (
          cloneWithHighestRating.positionBadGenes.length > 1 ? (
            <div>
              <h1>Step Two: </h1>

              <div>
                <p>{C1step2}</p>
                <p>{C2step2}</p>
                <p>{crossbreedR[0] ? crossbreedR[0].clone : ""}</p>
                <p>{crossbreedR[0] ? crossbreedR[0].clone : ""}</p>
              </div>
            </div>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {cloneWithHighestRating.positionBadGenes ? (
          cloneWithHighestRating.positionBadGenes.length > 2 ? (
            <div>
              <h1>Step Three: </h1>

              <div>
                <p>{C1step2}</p>
                <p>{C2step2}</p>
                <p>{crossbreedR[1] ? crossbreedR[1].clone : ""}</p>
                <p>{crossbreedR[1] ? crossbreedR[1].clone : ""}</p>
              </div>
            </div>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
      {/*         <button type="submit" action="post" onClick={findCrossbreadPair()}>
          check for best Genes
        </button> */}
    </div>
  );
}
