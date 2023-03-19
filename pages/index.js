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
  let positionsToChange = "";
  let cloneListCopy = undefined;
  let findClonesForCrossbreedingG = [];
  let findClonesForCrossbreedingY = [];
  let needG = 0;
  let needY = 0;
  // Warn if overriding existing method
  if (Array.prototype.equals)
    console.warn(
      "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
    );
  // attach the .equals method to Array's prototype to call it on any array
  Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false;
    // if the argument is the same array, we can be sure the contents are same as well
    if (array === this) return true;
    // compare lengths - can save a lot of time
    if (this.length != array.length) return false;

    for (var i = 0, l = this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i])) return false;
      } else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }
    }
    return true;
  };
  // Hide method from for-in loops
  Object.defineProperty(Array.prototype, "equals", { enumerable: false });

  function addGenes() {
    for (let i = 0; i < 6; i++) {
      if (clone) {
        clone[i] = document.getElementById(i).value;
        if (clone[i] === "") {
          clone = false;
          return;
        }
      } else {
        if (clone[i] !== "") {
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
    addGenes();
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
    findUsableClones(needG, "g");
    findUsableClones(needY, "y");
    findClonesForCrossbreeding(usableGeneList_g);
    findClonesForCrossbreeding(usableGeneList_y);
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
  }
  function findBestClone() {
    cloneList.map((clones) => {
      if (highestRating < clones.rating) {
        highestRating = clones.rating;
        cloneWithHighestRating = clones;
      }
    });
    needG = perfectHempSeedG - cloneWithHighestRating.g;
    needY = perfectHempSeedY - cloneWithHighestRating.y;
    console.log("genePool");
    console.log(genePool);
    console.log("cloneList");
    console.log(cloneList);
    console.log("cloneWithHighestRating");
    console.log(cloneWithHighestRating);
    console.log("usableGeneList_g");
    console.log(usableGeneList_g);
    console.log("usableGeneList_y");
    console.log(usableGeneList_y);
  }

  function findUsableClones(geneCount, gene) {
    //how many G or Y Genes does the best Clone need
    //If it needs both G and Y Genes it loops through the bad positions of the cloneWithHighestRating(CWHR)
    //for each bad gene Position of the CWHR it searches the "genePool" for g or y genes at the same position

    //Braucht der Clone G Gene?
    if (gene == "y") {
      usableGeneList(usableGeneList_y);
    } else {
      usableGeneList(usableGeneList_g);
    }

    function usableGeneList(list) {
      if (geneCount > 0) {
        cloneListCopy = cloneDeep(cloneList); //create deep copies here to later maipulate their values without touching the originals.
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < cloneListCopy.length; j++) {
            if (list[i].clone.clone.equals(cloneListCopy[j].clone)) {
              cloneListCopy.splice(j, 1); //if there has been a previous Call of this function (by adding a new Clone)
            } //there might be usable Y Clones already. If so: remove them from the copied cloneList again
          } //because the copy of the original will reinclude them every time we add a new Clone.
        } //This would cause the function to find a match for the same Clone every time we iterate through the Copy.

        let badGenePositionsCopy = cloneDeep(cloneWithHighestRating.positionBadGenes);
        for (let j = 0; j < cloneWithHighestRating.positionBadGenes.length; j++) {
          let currentBadGenePosition = badGenePositionsCopy[0];
          badGenePositionsCopy.splice(0, 1); //throw current bad Gene Position out of the copy of the array,
          for (let i = 0; i < cloneListCopy.length; i++) {
            let currentGene = cloneListCopy[i].clone[currentBadGenePosition];
            if (currentGene === gene) {
              //so in case of a match of the y gene on the position we need
              list.push({
                position: currentBadGenePosition,
                clone: cloneListCopy[i],
              });

              if (badGenePositionsCopy.length > 0) {
                //we can search the same clone for other possible matches with the remaining bad Positions of the copy
                if (needY > 1) {
                  badGenePositionsCopy.map((otherBadGenePosition) => {
                    if (cloneListCopy[i].clone[otherBadGenePosition] === gene) {
                      list.push({
                        position: otherBadGenePosition,
                        clone: cloneListCopy[i],
                      });
                    }
                  });
                }
              }
              cloneListCopy.splice(i, 1);
            }
          }
        }
      }
      if (geneCount < 0) {
        //falls der Clone zu viele, also mehr als 4, Y/G Gene hat, dann hat er keine schlechten Gene an diesen Positionen. Dann muss für jedes benötigte G-Gen ein beliebiges Y-Gen ersetzt werden.
        geneCount = geneCount * -1; //negativ wird positiv

        for (let i = 0; i < cloneWithHighestRating.clone.length; i++) {
          console.log(cloneWithHighestRating.clone[i]);
          //jedes CWHR-Gen wird durchsucht
          if (geneCount === 0) {
            return;
          }
          if (cloneWithHighestRating.clone[i] === gene) {
            //An jeder Stelle an der es das entsprechende Gen hat ist ein potentieller Austausch mit anderen Clonen möglich.
            let cloneListCopy = cloneDeep(cloneList);
            let cloneAbleGPositions = [];
            for (let j = 0; j < list.length; j++) {
              for (let k = 0; k < cloneListCopy.length; k++) {
                if (list[j].clone.clone.equals(cloneListCopy[k].clone)) {
                  cloneListCopy.splice(j, 1); //if there has been a previous Call of this function (by adding a new Clone)
                } //there might be usable Y Clones already. If so: remove them from the copied cloneList again
              } //because the copy of the original will reinclude them every time we add a new Clone.
            } //This would cause the function to find a match for the same Clone every time we iterate through the Copy.

            for (let l = 0; l < cloneListCopy.length; l++) {
              if (cloneListCopy[i].clone[i] === gene) {
                // wird die CloneList nach einem G-Gen an dieser Position durchsucht
                positionsToChange = i; // wenn gefunden, wird die Position gespeichert der gefunde Clone wird aus der Liste entfernt

                //in neuer Liste wird nach weiterem G-Gen gesucht an selber Position.
                for (let j = 1; j <= cloneListCopy.length; j++) {
                  if (cloneListCopy[j].clone[positionsToChange] === gene) {
                    //Wenn gefunden, werden beide Clone gespeichert und deren gemeinsame G-Position. Abfrage ob diese gemeinsame rote Gene haben fehlt!
                    geneCount = geneCount - 1;
                    /*                  list.push({
                      position: otherBadGenePosition,
                      clone: cloneListCopy[i],
                    });
                    list.push({
                      clone1: firstClone,
                      clone2: secondClone,
                      position: positionsToChange,
                    }); */
                    positionsToChange = "";
                    /*                     cloneListCopy.splice(index, 1);
                    cloneListCopy.splice(index, 1); */
                    return;
                  } else {
                    if (cloneListCopy[cloneListCopy.length - 1] !== firstClone) {
                      //Wenn kein zweiter Clone gefunden wurde wird der entfernte Clone der Liste wieder hinzugefügt.
                      cloneListCopy.push(firstClone);
                    }
                  }
                }

                console.log("cloneAbleGPositions");
                console.log(cloneAbleGPositions);
              }
            }
          }
        }
      }
    }
  }

  function findClonesForCrossbreeding(list) {
    for (let i = 0; i < list.length; i++) {
      for (let j = 1; j <= list.length; j++) {
        let gen1 = list[i];
        let gen2 = list[j];
        if (gen1 == gen2) {
          console.log(gen1);
          console.log(gen2);
        }
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
