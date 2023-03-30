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
  let findClonesForCrossbreedingR1G = [];
  let findClonesForCrossbreedingR1Y = [];
  let needG = 0;
  let needY = 0;
  let usablePositionExists;
  let foundGene = false;
  let bestRating = 0;
  let crossbreedWeighting = [];
  let needR2 = false;

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
    let cloneList = [];

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
    giveGeneWeighting(genePool, geneWeightingList);
    rateClone(genePool, cloneList, geneWeightingList);
    findBestClone(cloneList);
    findUsableClones(needG, "g", cloneList);
    findUsableClones(needY, "y", cloneList);
    findClonesForCrossbreedingR1(usableGeneList_g);
    findClonesForCrossbreedingR1(usableGeneList_y);
  }

  function giveGeneWeighting(geneArr, list) {
    for (let i = 0; i < geneArr.length; i++) {
      geneArr[i].map((gene, index) => {
        if (gene.includes("w") || gene.includes("x")) {
          geneWeighting.push(0.9);
        } else {
          geneWeighting.push(0.5);
        }
        if (index === 5) {
          list[i] = geneWeighting;
          geneWeighting = [];
        }
      });
    }
  }

  function rateClone(geneArr, list, weighting) {
    let geneCounterY = 0;
    let geneCounterG = 0;
    let weakGenes = [];
    let positionBadGenes = [];

    for (let i = 0; i < geneArr.length; i++) {
      geneArr[i].map((gene, index) => {
        if (gene.includes("y")) {
          if (geneCounterY < perfectHempSeedY) {
            geneCounterY++;
            weakGenesRating = weakGenesRating + 1;
          } else {
            geneCounterY++;
            weakGenesRating = weakGenesRating + 0.6;
          }
        } else if (gene.includes("g")) {
          if (geneCounterG < perfectHempSeedG) {
            geneCounterG++;
            weakGenesRating = weakGenesRating + 1;
          } else {
            geneCounterG++;
            weakGenesRating = weakGenesRating + 0.6;
          }
        } else {
          if (gene.includes("h")) {
            weakGenesRating = weakGenesRating + 0.5;
          }
          weakGenes.push(gene);
          positionBadGenes.push(index);
        }
        if (index === 5) {
          otherGenes[i] = weakGenes;
          weakGenes = [];
          list.push({
            clone: geneArr[i],
            cloneWeighting: weighting[i],
            y: geneCounterY,
            g: geneCounterG,
            badGenes: otherGenes[i],
            positionBadGenes: positionBadGenes,
            rating: Number(parseFloat(weakGenesRating).toFixed(2)),
          });
          weakGenesRating = 0;
          geneCounterY = 0;
          geneCounterG = 0;
          positionBadGenes = [];
        }
      });
    }
  }

  function findBestClone(list) {
    list.map((clones) => {
      if (highestRating < clones.rating) {
        highestRating = clones.rating;
        cloneWithHighestRating = clones;
        usableGeneList_g = [];
        usableGeneList_y = [];
      }
    });
    needG = perfectHempSeedG - cloneWithHighestRating.g;
    needY = perfectHempSeedY - cloneWithHighestRating.y;
    console.log("genePool");
    console.log(genePool);
    console.log("cloneList");
    console.log(list);
    console.log("cloneWithHighestRating");
    console.log(cloneWithHighestRating);
    console.log("usableGeneList_g");
    console.log(usableGeneList_g);
    console.log("usableGeneList_y");
    console.log(usableGeneList_y);
  }

  function findUsableClones(geneCount, gene, list) {
    //how many G or Y Genes does the best Clone need
    //If it needs both G and Y Genes it loops through the bad positions of the cloneWithHighestRating(CWHR)
    //for each bad gene Position of the CWHR it searches the "genePool" for g or y genes at the same position

    //Braucht der Clone G Gene?
    if (gene === "y") {
      usableGeneList(usableGeneList_y, list);
    } else {
      usableGeneList(usableGeneList_g, list);
    }

    function usableGeneList(usableList, list) {
      if (geneCount > 0) {
        cloneListCopy = cloneDeep(list); //create deep copies here to later maipulate their values without touching the originals.
        for (let i = 0; i < usableList.length; i++) {
          for (let j = 0; j < cloneListCopy.length; j++) {
            if (usableList[i].clone.clone.equals(cloneListCopy[j].clone)) {
              cloneListCopy.splice(j, 1); //if there has been a previous Call of this function (by adding a new Clone)
            } //there might be usable Y Clones already. If so: remove them from the copied cloneList again
          } //because the copy of the original will reinclude them every time we add a new Clone.
        } //This would cause the function to find a match for the same Clone every time we iterate through the Copy.

        for (let j = 0; j < cloneWithHighestRating.positionBadGenes.length; j++) {
          let currentBadGenePosition = cloneWithHighestRating.positionBadGenes[j];

          for (let i = 0; i < cloneListCopy.length; i++) {
            let currentGene = cloneListCopy[i].clone[currentBadGenePosition];
            if (currentGene === gene) {
              //so in case of a match of the gene on the position we need
              usableList.push({
                position: currentBadGenePosition,
                clone: cloneListCopy[i],
              });
              if (i === 5) {
                cloneListCopy.splice(i, 1);
              }
            }
          }
        }
      }
      if (geneCount < 0) {
        //falls der Clone zu viele, also mehr als 4, Y/G Gene hat, dann hat er keine schlechten Gene an diesen Positionen. Dann muss für jedes benötigte G-Gen ein beliebiges Y-Gen ersetzt werden.
        geneCount = geneCount * -1; //negativ wird positiv
        let searchedGene = "";
        let cloneListCopy = cloneDeep(list);

        if (gene === "y") {
          searchedGene = "g";
        } else {
          searchedGene = "y";
        }

        for (let j = 0; j < usableList.length; j++) {
          for (let k = 0; k < cloneListCopy.length; k++) {
            if (usableList[j].clone.clone.equals(cloneListCopy[k].clone)) {
              cloneListCopy.splice(k, 1); //if there has been a previous Call of this function (by adding a new Clone)
            } //there might be usable Y Clones already. If so: remove them from the copied cloneList again
          } //because the copy of the original will reinclude them every time we add a new Clone.
        } //This would cause the function to find a match for the same Clone every time we iterate through the Copy.

        for (let i = cloneListCopy.length - 1; i >= 0; i--) {
          //jedes CWHR-Gen wird durchsucht
          //An jeder Stelle an der es das entsprechende Gen hat ist ein potentieller Austausch mit anderen Clonen möglich.

          for (let l = 0; l < 6; l++) {
            if (cloneListCopy[i].clone[m] === searchedGene) {
              if (cloneWithHighestRating.clone[m] === gene) {
                foundGene = true;
                // wird die CloneList nach dem Benötigten Gen an dieser Position durchsucht (wenn gene = "y" wird "g" benötigt)
                // wenn gefunden, wird der Clone gespeichert und wird aus der Liste entfernt

                let clone = cloneDeep(cloneListCopy[i]);
                usableList.push({ clone: clone, position: l });
                /*                 usablePositionExists = list.find((el) => el.position === l); //Wenn ein Clone für eine Position hinzugefügt wird, er aber noch eine weitere position mit dem gesuchten gen hat, wird er nur für diejenige gefunden für die er hinzugefügt wurde. Es sollten vielleicht nicht nur Clone deren Genposition bei mindestens zwei Clonen enthalten sind hinzugefügt werden.
                if (usablePositionExists) {
                  list.push({ clone: clone, position: l });
                  usablePositionExists = "";
                } */
              }
            }

            if (l === 5 && foundGene === true) {
              cloneListCopy.splice(i, 1);
              foundGene = false;
            }
          }
        }
      }
    }
  }

  function findClonesForCrossbreedingR1(list) {
    //alle clone deren positionen 2 oder mehrmals vorkommen in list Liste werden in list gepusht.

    let potentialCrossbreedClone = [];
    let crossbreedList = [];
    let weighting = [];
    let crossbreedCloneList = [];

    for (let j = 0; j < list.length; j++) {
      for (let k = j + 1; k < list.length; k++) {
        if (list[j].position === list[k].position) {
          for (let l = 0; l < list[j].clone.clone.length; l++) {
            let cloneA = list[j].clone.clone[l];
            let cloneB = list[k].clone.clone[l];
            let cloneAWeighting = list[j].clone.cloneWeighting[l];
            let cloneBWeighting = list[k].clone.cloneWeighting[l];
            let bestClone = cloneWithHighestRating.clone[l];
            let bestCloneWeighting = cloneWithHighestRating.cloneWeighting[l];

            if (cloneA === cloneB) {
              //Wenn das erste Gen an einer Stelle Gleich dem Zweiten ist
              potentialCrossbreedClone.push(cloneA); //wird dieses Gen in den potentiellen CrossbreedClone überführt
            } else if (cloneA === bestClone) {
              //Wenn das Gen des ersten Clones An einer Stelle Gleich dem Besten Clone ist
              potentialCrossbreedClone.push(cloneA); //wird dieses Gen in den potentiellen CrossbreedClone überführt
            } else if (cloneB === bestClone) {
              //Wenn das Gen des zweiten Clones An einer Stelle Gleich dem Besten Clone ist
              potentialCrossbreedClone.push(cloneB); //....
            } else if (cloneAWeighting > cloneBWeighting) {
              //Andernfalls sind alle Gene an der Stelle unterschiedlich und das höchst gewichtete Gen muss überführt werden. Erstes größer Zweites:
              if (cloneAWeighting > bestCloneWeighting) {
                //und Erstes größer Bestes
                potentialCrossbreedClone.push(cloneA); //Erstes ist am höchsten gewichtet und wird überführt
              } else if (cloneAWeighting === bestCloneWeighting) {
                //Wenn Erstes und Bestes gleich gewichtet sind
                potentialCrossbreedClone.push(cloneA + "/" + bestClone); //Werden beide überführt
              } else {
                potentialCrossbreedClone.push(bestClone); //Sonst wird das beste überführt, da es das am höchsten gewichtete sein muss.
              }
            } else if (cloneAWeighting === cloneBWeighting) {
              //wenn Erstes und Zweites gleich sind
              if (cloneBWeighting === bestCloneWeighting) {
                //Wenn alle gleich sind
                potentialCrossbreedClone.push(cloneA + "/" + cloneB + "/" + bestClone); //werden alle überführt
              } else if (bestCloneWeighting > cloneBWeighting) {
                potentialCrossbreedClone.push(bestClone);
              } else {
                potentialCrossbreedClone.push(cloneA + "/" + cloneB); //sonst nur Erstes und Zweites
              }
            } else {
              //Sonst ist das Zweite größer als das Erste
              if (cloneBWeighting > bestCloneWeighting) {
                //wenn das Zweite auch größer als das Beste ist
                potentialCrossbreedClone.push(cloneB); //Wird Zweites überführt
              } else if (cloneBWeighting === bestCloneWeighting) {
                //Wenn das Zweite gleich groß wie das Beste ist
                potentialCrossbreedClone.push(cloneB + "/" + bestClone); //Werden beide Überführt
              } else {
                potentialCrossbreedClone.push(bestClone); //Sonst wird nur das Beste überführt
              }
            }

            if (l === 5) {
              crossbreedList.push(potentialCrossbreedClone);
              //Wenn alle Gene des Clones überführt wurden muss der potentielle Crossbreed Clone gewichtet werden. Und die Gewichtung mit der des Besten Clones verglichen werden.

              potentialCrossbreedClone = [];
            }
          }
        }
      }
    }
    console.log("crossbreedList");
    console.log(crossbreedList);
    console.log("crossbreedCloneList");
    console.log(crossbreedCloneList);

    giveGeneWeighting(crossbreedList, crossbreedWeighting);
    rateClone(crossbreedList, crossbreedCloneList, crossbreedWeighting);

    for (const clone of crossbreedCloneList) {
      if (clone.rating > bestRating) {
        bestRating = clone.rating;
        if (bestRating <= cloneWithHighestRating.rating && crossbreedList.length >= 3) {
          needR2 = true;
        }
      }
    }
  }

  function findClonesForCrossbreedingR2() {
    let potentialCrossbreedClone = [];
    let crossbreedList = [];
    let weighting = [];
    let crossbreedCloneList = [];

    for (let j = 0; j < list.length; j++) {
      for (let k = j + 1; k < list.length; k++) {
        if (list[j].position === list[k].position) {
          for (let l = k + 1; l < list.length; l++) {
            if (list[j].position === list[m].position) {
              for (let m = 0; l < list[j].clone.clone.length; m++) {
                let cloneA = list[j].clone.clone[m];
                let cloneB = list[k].clone.clone[m];
                let cloneC = list[l].clone.clone[m];
                let cloneAWeighting = list[j].clone.cloneWeighting[m];
                let cloneBWeighting = list[k].clone.cloneWeighting[m];
                let cloneCWeighting = list[l].clone.cloneWeighting[m];
                let bestClone = cloneWithHighestRating.clone[m];
                let bestCloneWeighting = cloneWithHighestRating.cloneWeighting[m];

                if ((cloneA === cloneB) === cloneC) {
                  //Wenn das erste Gen an einer Stelle Gleich dem Zweiten ist
                  potentialCrossbreedClone.push(cloneA); //wird dieses Gen in den potentiellen CrossbreedClone überführt
                } else if ((cloneA === cloneB) === bestClone) {
                  //Wenn das Gen des ersten Clones An einer Stelle Gleich dem Besten Clone ist
                  potentialCrossbreedClone.push(cloneA); //wird dieses Gen in den potentiellen CrossbreedClone überführt
                } else if (cloneB === bestClone) {
                  //Wenn das Gen des zweiten Clones An einer Stelle Gleich dem Besten Clone ist
                  potentialCrossbreedClone.push(cloneB); //....
                } else if (cloneAWeighting > cloneBWeighting) {
                  //Andernfalls sind alle Gene an der Stelle unterschiedlich und das höchst gewichtete Gen muss überführt werden. Erstes größer Zweites:
                  if (cloneAWeighting > bestCloneWeighting) {
                    //und Erstes größer Bestes
                    potentialCrossbreedClone.push(cloneA); //Erstes ist am höchsten gewichtet und wird überführt
                  } else if (cloneAWeighting === bestCloneWeighting) {
                    //Wenn Erstes und Bestes gleich gewichtet sind
                    potentialCrossbreedClone.push(cloneA + "/" + bestClone); //Werden beide überführt
                  } else {
                    potentialCrossbreedClone.push(bestClone); //Sonst wird das beste überführt, da es das am höchsten gewichtete sein muss.
                  }
                } else if (cloneAWeighting === cloneBWeighting) {
                  //wenn Erstes und Zweites gleich sind
                  if (cloneBWeighting === bestCloneWeighting) {
                    //Wenn alle gleich sind
                    potentialCrossbreedClone.push(cloneA + "/" + cloneB + "/" + bestClone); //werden alle überführt
                  } else if (bestCloneWeighting > cloneBWeighting) {
                    potentialCrossbreedClone.push(bestClone);
                  } else {
                    potentialCrossbreedClone.push(cloneA + "/" + cloneB); //sonst nur Erstes und Zweites
                  }
                } else {
                  //Sonst ist das Zweite größer als das Erste
                  if (cloneBWeighting > bestCloneWeighting) {
                    //wenn das Zweite auch größer als das Beste ist
                    potentialCrossbreedClone.push(cloneB); //Wird Zweites überführt
                  } else if (cloneBWeighting === bestCloneWeighting) {
                    //Wenn das Zweite gleich groß wie das Beste ist
                    potentialCrossbreedClone.push(cloneB + "/" + bestClone); //Werden beide Überführt
                  } else {
                    potentialCrossbreedClone.push(bestClone); //Sonst wird nur das Beste überführt
                  }
                }

                if (l === 5) {
                  crossbreedList.push(potentialCrossbreedClone);
                  //Wenn alle Gene des Clones überführt wurden muss der potentielle Crossbreed Clone gewichtet werden. Und die Gewichtung mit der des Besten Clones verglichen werden.

                  potentialCrossbreedClone = [];
                }
              }
            }
          }
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
