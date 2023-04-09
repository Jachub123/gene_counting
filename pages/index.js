import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import cloneDeep from "lodash/cloneDeep";

export default function Home() {
  const [secondBestCrossbreedR, setSecondBestCrossbreedR] = useState({});
  const [resultCrossbreedList, setCrossbreedList] = useState([]);
  const [crossbreedR, setcrossbreedR] = useState({});
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
  let needG = 0;
  let needY = 0;
  let usablePositionExists;
  let foundGene = false;
  let bestRating = 0;
  let crossbreedWeighting = [];
  let needR2 = false;
  let result1 = {};
  let secondBestresult1;

  let result2 = {};
  let secondBestresult2;
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
  }

  function crossbreed() {
    let cloneList = [];
    giveGeneWeighting(genePool, geneWeightingList);
    rateClone(genePool, cloneList, geneWeightingList);
    findBestClone(cloneList);
    findClonesForCrossbreedingR1(cloneList);
    findClonesForCrossbreedingR2(cloneList);
  }

  function giveGeneWeighting(geneArr, list, crossbreed) {
    if (crossbreed === undefined) {
      crossbreed = false;
    }
    if (crossbreed === false) {
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
    } else {
      for (let i = 0; i < geneArr.length; i++) {
        geneArr[i].clone.map((gene, index) => {
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
  }

  function rateClone(geneArr, list, weighting, crossbreed) {
    let geneCounterY = 0;
    let geneCounterG = 0;
    let weakGenes = [];
    let positionBadGenes = [];

    if (crossbreed === undefined) {
      crossbreed = false;
    }
    if (crossbreed === false) {
      for (let i = 0; i < geneArr.length; i++) {
        geneArr[i].map((gene, index) => {
          if (gene.includes("y")) {
            if (gene.includes("g")) {
              weakGenesRating = weakGenesRating + 1;
            } else {
              if (geneCounterY < perfectHempSeedY) {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 1;
              } else {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 0.6;
              }
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
    } else {
      for (let i = 0; i < geneArr.length; i++) {
        geneArr[i].clone.map((gene, index) => {
          if (gene.includes("y")) {
            if (gene.includes("g")) {
              weakGenesRating = weakGenesRating + 1;
            } else {
              if (geneCounterY < perfectHempSeedY) {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 1;
              } else {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 0.6;
              }
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
              clone: geneArr[i].clone,
              crossbreedPartners: geneArr[i].crossbreedClones,
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
            if (cloneListCopy[i].clone[l] === searchedGene) {
              if (cloneWithHighestRating.clone[l] === gene) {
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

    if (list.length <= 1) {
      return;
    }

    let potentialCrossbreedClone = [];
    let crossbreedList = [];
    let weighting = [];
    let crossbreedCloneList = [];

    for (let j = 0; j < list.length; j++) {
      for (let k = j + 1; k < list.length; k++) {
        for (let m = 0; m < list.length; m++) {
          for (let l = 0; l < list[j].clone.length; l++) {
            let cloneA = list[j].clone[l];
            let cloneB = list[k].clone[l];
            let cloneD = list[m].clone[l];
            let cloneAWeighting = list[j].cloneWeighting[l];
            let cloneBWeighting = list[k].cloneWeighting[l];
            let cloneDWeighting = list[m].cloneWeighting[l];

            if (cloneA === cloneB) {
              //Wenn das erste Gen an einer Stelle Gleich dem Zweiten ist
              potentialCrossbreedClone.push(cloneA); //wird dieses Gen in den potentiellen CrossbreedClone überführt
            } else if (cloneA === cloneD) {
              //Wenn das Gen des ersten Clones An einer Stelle Gleich dem Besten Clone ist
              potentialCrossbreedClone.push(cloneA); //wird dieses Gen in den potentiellen CrossbreedClone überführt
            } else if (cloneB === cloneD) {
              //Wenn das Gen des zweiten Clones An einer Stelle Gleich dem Besten Clone ist
              potentialCrossbreedClone.push(cloneB); //....
            } else if (cloneAWeighting > cloneBWeighting) {
              //Andernfalls sind alle Gene an der Stelle unterschiedlich und das höchst gewichtete Gen muss überführt werden. Erstes größer Zweites:
              if (cloneAWeighting > cloneDWeighting) {
                //und Erstes größer Bestes
                potentialCrossbreedClone.push(cloneA); //Erstes ist am höchsten gewichtet und wird überführt
              } else if (cloneAWeighting === cloneDWeighting) {
                //Wenn Erstes und Bestes gleich gewichtet sind
                potentialCrossbreedClone.push(cloneA + "/" + cloneD); //Werden beide überführt
              } else {
                potentialCrossbreedClone.push(cloneD); //Sonst wird das beste überführt, da es das am höchsten gewichtete sein muss.
              }
            } else if (cloneAWeighting === cloneBWeighting) {
              //wenn Erstes und Zweites gleich sind
              if (cloneBWeighting === cloneDWeighting) {
                //Wenn alle gleich sind
                potentialCrossbreedClone.push(cloneA + "/" + cloneB + "/" + cloneD); //werden alle überführt
              } else if (cloneDWeighting > cloneBWeighting) {
                potentialCrossbreedClone.push(cloneD);
              } else {
                potentialCrossbreedClone.push(cloneA + "/" + cloneB); //sonst nur Erstes und Zweites
              }
            } else {
              //Sonst ist das Zweite größer als das Erste
              if (cloneBWeighting > cloneDWeighting) {
                //wenn das Zweite auch größer als das Beste ist
                potentialCrossbreedClone.push(cloneB); //Wird Zweites überführt
              } else if (cloneBWeighting === cloneDWeighting) {
                //Wenn das Zweite gleich groß wie das Beste ist
                potentialCrossbreedClone.push(cloneB + "/" + cloneD); //Werden beide Überführt
              } else {
                potentialCrossbreedClone.push(cloneD); //Sonst wird nur das Beste überführt
              }
            }

            if (l === 5) {
              crossbreedList.push({ clone: potentialCrossbreedClone, crossbreedClones: [j, k, m] });
              //Wenn alle Gene des Clones überführt wurden muss der potentielle Crossbreed Clone gewichtet werden. Und die Gewichtung mit der des Besten Clones verglichen werden.
              potentialCrossbreedClone = [];
            }
          }
        }
      }
    }

    giveGeneWeighting(crossbreedList, crossbreedWeighting, true);
    rateClone(crossbreedList, crossbreedCloneList, crossbreedWeighting, true);

    for (const clone of crossbreedCloneList) {
      if (clone.rating > bestRating) {
        bestRating = clone.rating;

        if (bestRating <= cloneWithHighestRating.rating && list.length >= 3) {
          needR2 = true;
        } else if (bestRating > cloneWithHighestRating.rating) {
          setcrossbreedR({
            cloneA: list[clone.crossbreedPartners[0]].clone,
            cloneB: list[clone.crossbreedPartners[1]].clone,
            cloneD: list[clone.crossbreedPartners[2]].clone,
            result: clone.clone,
          });

          setCrossbreedList(crossbreedCloneList);
          setCloneWithHighestRating(cloneWithHighestRating);
        }
      }
    }
  }

  function findClonesForCrossbreedingR2(list) {
    if (needR2 !== true) {
      return;
    }

    if (list.length <= 1) {
      return;
    }

    let potentialCrossbreedClone = [];
    let crossbreedList = [];
    let weighting = [];
    let crossbreedCloneList = [];
    let crossbreedWeighting = [];
    for (let j = 0; j < list.length; j++) {
      for (let k = j + 1; k < list.length; k++) {
        for (let n = k + 1; n < list.length; n++) {
          for (let l = 0; l < list.length; l++) {
            for (let m = 0; m < list[j].clone.length; m++) {
              let cloneA = list[j].clone[m];
              let cloneB = list[k].clone[m];
              let cloneC = list[l].clone[m];
              let cloneD = list[n].clone[m];
              let cloneAWeighting = list[j].cloneWeighting[m];
              let cloneBWeighting = list[k].cloneWeighting[m];
              let cloneCWeighting = list[l].cloneWeighting[m];
              let cloneDWeighting = list[n].cloneWeighting[m];

              if (cloneA === cloneB && cloneA === cloneD) {
                potentialCrossbreedClone.push(cloneA);
              } else if (cloneA === cloneB && cloneA === cloneC) {
                potentialCrossbreedClone.push(cloneB);
              } else if (cloneA === cloneC && cloneA === cloneD) {
                potentialCrossbreedClone.push(cloneC);
              } else if (cloneB === cloneC && cloneB === cloneD) {
                potentialCrossbreedClone.push(cloneD);
              } else if (cloneC === cloneD) {
                if (cloneA !== cloneB) {
                  potentialCrossbreedClone.push(cloneC);
                } else {
                  if (cloneCWeighting > cloneBWeighting) {
                    potentialCrossbreedClone.push(cloneC);
                  } else if (cloneCWeighting === cloneBWeighting) {
                    potentialCrossbreedClone.push(cloneC + "/" + cloneB);
                  } else {
                    potentialCrossbreedClone.push(cloneB);
                  }
                }
              } else if (cloneA === cloneB) {
                if (cloneC !== cloneD) {
                  potentialCrossbreedClone.push(cloneA);
                } else {
                  if (cloneAWeighting > cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneA);
                  } else if (cloneAWeighting === cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneA + "/" + cloneD);
                  } else {
                    potentialCrossbreedClone.push(cloneD);
                  }
                }
              } else if (cloneA === cloneC) {
                if (cloneB !== cloneD) {
                  potentialCrossbreedClone.push(cloneA);
                } else {
                  if (cloneAWeighting > cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneA);
                  } else if (cloneAWeighting === cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneA + "/" + cloneD);
                  } else {
                    potentialCrossbreedClone.push(cloneD);
                  }
                }
              } else if (cloneA === cloneD) {
                if (cloneB !== cloneC) {
                  potentialCrossbreedClone.push(cloneA);
                } else {
                  if (cloneAWeighting > cloneCWeighting) {
                    potentialCrossbreedClone.push(cloneA);
                  } else if (cloneAWeighting === cloneCWeighting) {
                    potentialCrossbreedClone.push(cloneA + "/" + cloneC);
                  } else {
                    potentialCrossbreedClone.push(cloneC);
                  }
                }
              } else if (cloneB === cloneC) {
                if (cloneA !== cloneD) {
                  potentialCrossbreedClone.push(cloneB);
                } else {
                  if (cloneBWeighting > cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneB);
                  } else if (cloneBWeighting === cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneB + "/" + cloneD);
                  } else {
                    potentialCrossbreedClone.push(cloneD);
                  }
                }
              } else if (cloneB === cloneD) {
                if (cloneA !== cloneC) {
                  potentialCrossbreedClone.push(cloneB);
                } else {
                  if (cloneBWeighting > cloneCWeighting) {
                    potentialCrossbreedClone.push(cloneB);
                  } else if (cloneBWeighting === cloneCWeighting) {
                    potentialCrossbreedClone.push(cloneB + "/" + cloneC);
                  } else {
                    potentialCrossbreedClone.push(cloneC);
                  }
                }
              } else if (
                cloneAWeighting === cloneBWeighting &&
                cloneAWeighting === cloneDWeighting &&
                cloneAWeighting === cloneCWeighting
              ) {
                potentialCrossbreedClone.push(cloneA + "/" + cloneB + "/" + cloneD + "/" + cloneC);
              } else if (
                cloneAWeighting > cloneBWeighting &&
                cloneAWeighting > cloneCWeighting &&
                cloneAWeighting > cloneDWeighting
              ) {
                potentialCrossbreedClone.push(cloneA);
              } else if (
                cloneBWeighting > cloneCWeighting &&
                cloneBWeighting > cloneDWeighting &&
                cloneBWeighting > cloneAWeighting
              ) {
                potentialCrossbreedClone.push(cloneB);
              } else if (
                cloneCWeighting > cloneAWeighting &&
                cloneCWeighting > cloneDWeighting &&
                cloneCWeighting > cloneBWeighting
              ) {
                potentialCrossbreedClone.push(cloneC);
              } else if (
                cloneDWeighting > cloneAWeighting &&
                cloneDWeighting > cloneCWeighting &&
                cloneDWeighting > cloneBWeighting
              ) {
                potentialCrossbreedClone.push(cloneD);
              } else if (cloneCWeighting === cloneDWeighting) {
                if (cloneAWeighting !== cloneBWeighting) {
                  potentialCrossbreedClone.push(cloneC + "/" + cloneD);
                } else {
                  if (cloneCWeighting > cloneBWeighting) {
                    potentialCrossbreedClone.push(cloneC + "/" + cloneD);
                  } else {
                    potentialCrossbreedClone.push(cloneB + "/" + cloneA);
                  }
                }
              } else if (cloneAWeighting === cloneBWeighting) {
                if (cloneCWeighting !== cloneDWeighting) {
                  potentialCrossbreedClone.push(cloneA + "/" + cloneB);
                } else {
                  if (cloneAWeighting > cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneA + "/" + cloneB);
                  } else {
                    potentialCrossbreedClone.push(cloneD + "/" + cloneC);
                  }
                }
              } else if (cloneAWeighting === cloneCWeighting) {
                if (cloneBWeighting !== cloneDWeighting) {
                  potentialCrossbreedClone.push(cloneA + "/" + cloneC);
                } else {
                  if (cloneAWeighting > cloneDWeighting) {
                    potentialCrossbreedClone.push(cloneA + "/" + cloneC);
                  } else {
                    potentialCrossbreedClone.push(cloneB + "/" + cloneD);
                  }
                }
              } else if (cloneAWeighting === cloneDWeighting) {
                if (cloneBWeighting !== cloneCWeighting) {
                  potentialCrossbreedClone.push(cloneA + "/" + cloneD);
                } else {
                  if (cloneAWeighting > cloneCWeighting) {
                    potentialCrossbreedClone.push(cloneA + "/" + cloneD);
                  } else {
                    potentialCrossbreedClone.push(cloneB + "/" + cloneC);
                  }
                }
              } else if (cloneBWeighting === cloneCWeighting) {
                if (cloneAWeighting !== cloneDWeighting) {
                  potentialCrossbreedClone.push(cloneB + "/" + cloneC);
                }
              } else if (cloneBWeighting === cloneDWeighting) {
                if (cloneAWeighting !== cloneCWeighting) {
                  potentialCrossbreedClone.push(cloneB + "/" + cloneD);
                }
              }
              if (m === 5) {
                crossbreedList.push({ clone: potentialCrossbreedClone, crossbreedClones: [j, k, l, n] });
                potentialCrossbreedClone = [];
              }

              if (j === list.length - 1) {
                needR2 = false;
              }
            }
          }
        }
      }
    }

    giveGeneWeighting(crossbreedList, crossbreedWeighting, true);
    rateClone(crossbreedList, crossbreedCloneList, crossbreedWeighting, true);

    for (const clone of crossbreedCloneList) {
      if (clone.rating > bestRating) {
        bestRating = clone.rating;

        if (bestRating > cloneWithHighestRating.rating) {
          setcrossbreedR({
            cloneA: list[clone.crossbreedPartners[0]].clone,
            cloneB: list[clone.crossbreedPartners[1]].clone,
            cloneC: list[clone.crossbreedPartners[2]].clone,
            cloneD: list[clone.crossbreedPartners[3]].clone,
            result: clone.clone,
          });
        } else {
          setSecondBestCrossbreedR({
            cloneA: list[clone.crossbreedPartners[0]].clone,
            cloneB: list[clone.crossbreedPartners[1]].clone,
            cloneC: list[clone.crossbreedPartners[2]].clone,
            cloneD: list[clone.crossbreedPartners[3]].clone,
            result: clone.clone,
          });
        }
      }
    }

    setCrossbreedList(crossbreedCloneList);
    setCloneWithHighestRating(cloneWithHighestRating);
  }

  function renderCrossbreedResult() {
    if (Object.values(crossbreedR).length === 0) {
      return <h1>Feed me clones!</h1>;
    } else if (resultCrossbreedList.length > 0 && Object.values(crossbreedR).length === 0) {
      return (
        <div>
          <h1 className="red">Feed me more clones </h1>
          <h3>results aren't better than your Best Clone!</h3>
          <p>Best clone:</p>
          <div className="clone">
            {cloneWithHighestRating.clone.map((gene) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <p>Best result:</p>
          <div className="clone">
            {secondBestCrossbreedR.cloneA.map((gene, index) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.cloneB.map((gene, index) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.cloneC.map((gene, index) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.cloneD.map((gene, index) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.result.map((gene, index) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
        </div>
      );
    } else if (Object.keys(crossbreedR).length !== 0) {
      return (
        <div>
          <h1>I have a result:</h1>
          <div className="clone">
            {crossbreedR.cloneA.map((gene) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {crossbreedR.cloneB.map((gene) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {crossbreedR.cloneC
              ? crossbreedR.cloneC.map((gene) => {
                  if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                    return <p className="green">{gene}</p>;
                  } else {
                    return <p className="red">{gene}</p>;
                  }
                })
              : ""}
          </div>
          <div className="clone">
            {crossbreedR.cloneD.map((gene) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="line"></div>
          <div className="clone">
            {crossbreedR.result.map((gene) => {
              if (gene.includes("y") || gene.includes("h") || gene.includes("g")) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
        </div>
      );
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
        <button onClick={crossbreed} formAction="">
          Start Crossbreed
        </button>
      </div>

      <div className="flex">
        <div>{renderCrossbreedResult()}</div>
      </div>
    </div>
  );
}
