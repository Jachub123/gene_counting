import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import deleteImg from "/public/delete.png";
import { useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useCookies } from "react-cookie";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import paypalImg from "/public/btn_donateCC_LG.gif";

export default function Home() {
  const [secondBestCrossbreedR, setSecondBestCrossbreedR] = useState({});
  const [resultCrossbreedList, setCrossbreedList] = useState([]);
  const [geneCountG, setGeneCountG] = useState(2);
  const [geneCountY, setGeneCountY] = useState(4);
  const [crossbreedR, setcrossbreedR] = useState({});
  let [cloneWithHighestRating, setCloneWithHighestRating] = useState([]);
  const [cookies, setCookie] = useCookies(["cloneList"]);
  let cookieCache = [];
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
  let showInfo = false;

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
  /*   if (typeof window !== "undefined") {
    document.getElementById("0").focus();
  } */

  function perfectClone(gene) {
    let otherValue;
    let yCount = document.getElementById("y").value;
    let gCount = document.getElementById("g").value;
    if (gene.target.id === "y") {
      otherValue = gCount;
      document.getElementById("g").value = 6 - gene.target.value;
    } else {
      otherValue = yCount;
      document.getElementById("y").value = 6 - gene.target.value;
    }
    if (Number(gCount) + Number(yCount) > 6 || gene.target.value < 0) {
      gene.target.value = 6 - otherValue;
      if (gene.target.id === "y") {
        yCount = gene.target.value;
        perfectHempSeedY = gene.target.value;
        perfectHempSeedG = otherValue;
      } else {
        gCount = gene.target.value;
        perfectHempSeedG = gene.target.value;
        perfectHempSeedY = otherValue;
      }
    }
    if (Number(gCount) + Number(yCount) === 6) {
      perfectHempSeedY = yCount;
      perfectHempSeedG = gCount;

      setGeneCountG(perfectHempSeedG);
      setGeneCountY(perfectHempSeedY);
      document.getElementById("defaultGenes").classList.add("hidden");
      document.getElementById("customGenes").classList.remove("hidden");
    } else {
      document.getElementById("defaultGenes").classList.remove("hidden");
      document.getElementById("customGenes").classList.add("hidden");

      setGeneCountG(2);
      setGeneCountY(4);
    }
  }

  function addGenes(e) {
    if (e) {
      if (
        e.target.value.toLowerCase() === "x" ||
        e.target.value.toLowerCase() === "w"
      ) {
        e.target.classList.add("badGene");
        e.target.classList.remove("goodGene");
      } else {
        e.target.classList.add("goodGene");
        e.target.classList.remove("badGene");
      }
    }
    for (let i = 0; i < 6; i++) {
      if (clone) {
        clone[i] = document.getElementById(i).value.toLowerCase();
        if (clone[i] === "") {
          clone = false;
          return;
        }
      } else {
        if (clone[i] !== "") {
          clone = [];
          clone[i] = document.getElementById(i).value.toLowerCase();
        } else {
          clone = false;
          return;
        }
      }
    }
  }

  /*   function handleKeyDown(e) {
    let pastedArray = [];
    let index = 0;
    console.log(e.target.id);
    e.target.addEventListener("keydown", (event) => {
      if (event.key === "v" && e.key === "Control") {
        e.target.addEventListener("input", () => {
          pastedArray = e.target.value.split("");
          console.log(pastedArray);
          pastedArray.forEach((char) => {
            if (
              char !== " " &&
              (char === "y" ||
                char === "g" ||
                char === "h" ||
                char === "x" ||
                char === "w")
            ) {
              if (char.toLowerCase() === "x" || char.toLowerCase() === "w") {
                document.getElementById(index).classList.add("badGene");
                document.getElementById(index).classList.remove("goodGene");
              } else {
                document.getElementById(index).classList.add("goodGene");
                document.getElementById(index).classList.remove("badGene");
              }
              document.getElementById(index).value = char;
              index++;
            }
          });
        });
      } else {
        console.log(event.key);
        /* if (
          event.key.toLowerCase() === "y" ||
          event.key.toLowerCase() === "g" ||
          event.key.toLowerCase() === "h" ||
          event.key.toLowerCase() === "x" ||
          event.key.toLowerCase() === "w"
        ) {
          document.getElementById(event.target.id + 1).focus();
        } else {
          document.getElementById(event.target.id).value = "";
        }

        

        if (event.key === "Backspace") {
          event.target.classList.remove("badGene");
          event.target.classList.remove("goodGene");
          if (event.target.value === "") {
            if (event.target.id - 1 < 0) {
              return;
            }
            document
              .getElementById(event.target.id - 1)
              .classList.remove("badGene");
            document
              .getElementById(event.target.id - 1)
              .classList.remove("goodGene");
            document.getElementById(event.target.id - 1).focus();
          }
        } else {
          addGenes(e);

          let id = parseInt(e.target.id) + 1;
          console.log(id);
          document.getElementById(id.toString()).focus();
        }
      }
    });
  } */

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      addClone();
    }
  }

  function keyDown(e, id) {
    if (e.key === "Backspace") {
      e.target.classList.remove("badGene");
      e.target.classList.remove("goodGene");
      if (e.target.value === "") {
        if (id - 1 < 0) {
          return;
        }
        document.getElementById(id - 1).classList.remove("badGene");
        document.getElementById(id - 1).classList.remove("goodGene");
        document.getElementById(id - 1).focus();
      }
    }
  }

  function paste(e) {
    e.preventDefault();
    let pastedArray = e.clipboardData.getData("Text").split("");
    console.log(e);
    let i = 0;
    pastedArray.map((letter) => {
      if (
        letter === "y" ||
        letter === "g" ||
        letter === "h" ||
        letter === "x" ||
        letter === "w"
      ) {
        if (letter === "w" || letter === "x") {
          document.getElementById(i).classList.add("badGene");
          document.getElementById(i).classList.remove("goodGene");
          document.getElementById(i).value = letter;
          console.log(i);
        } else {
          document.getElementById(i).classList.add("goodGene");
          document.getElementById(i).classList.remove("badGene");
          document.getElementById(i).value = letter;
          console.log(i);
        }
        document.getElementById(i).focus();
        i++;
      }
    });
  }

  function addClone() {
    addGenes();
    if (!clone) {
      return;
    }

    genePool.push(clone.slice());

    if (cookies.cloneList) {
      cookieCache = cookies.cloneList;
    }

    genePool.map((clone) => {
      cookieCache.push(clone);
    });

    setCookie("cloneList", cookieCache, { path: "/" });
    const inputFields = document.querySelectorAll(".geneInput");
    inputFields.forEach((input) => {
      input.value = "";
      input.classList.remove("badGene");
      input.classList.remove("goodGene");
    });

    clone = [];
    document.getElementById("0").focus();
  }

  function clearList() {
    setCookie("cloneList", [], { path: "/" });
  }

  function crossbreed() {
    let cloneList = [];
    giveGeneWeighting(cookies.cloneList, geneWeightingList);
    rateClone(cookies.cloneList, cloneList, geneWeightingList);

    console.log("cookies.cloneList");
    console.log(cookies.cloneList);

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
              if (geneCounterY < geneCountY) {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 1;
              } else {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 0.6;
              }
            }
          } else if (gene.includes("g")) {
            if (geneCounterG < geneCountG) {
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
              if (geneCounterY < geneCountY) {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 1;
              } else {
                geneCounterY++;
                weakGenesRating = weakGenesRating + 0.6;
              }
            }
          } else if (gene.includes("g")) {
            if (geneCounterG < geneCountG) {
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
    needG = geneCountG - cloneWithHighestRating.g;
    needY = geneCountY - cloneWithHighestRating.y;
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
                potentialCrossbreedClone.push(
                  cloneA + "/" + cloneB + "/" + cloneD
                ); //werden alle überführt
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
              crossbreedList.push({
                clone: potentialCrossbreedClone,
                crossbreedClones: [j, k, m],
              });
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

        if (bestRating > cloneWithHighestRating.rating) {
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
                potentialCrossbreedClone.push(
                  cloneA + "/" + cloneB + "/" + cloneD + "/" + cloneC
                );
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
                crossbreedList.push({
                  clone: potentialCrossbreedClone,
                  crossbreedClones: [j, k, l, n],
                });
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
    } else if (
      resultCrossbreedList.length > 0 &&
      Object.values(crossbreedR).length === 0
    ) {
      return (
        <div>
          <h1 className="red">Feed me more clones </h1>
          <h3>results aren`&apos;`t better than your Best Clone!</h3>
          <p>Best clone:</p>
          <div className="clone">
            {cloneWithHighestRating.clone.map((gene) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <p>Best result:</p>
          <div className="clone">
            {secondBestCrossbreedR.cloneA.map((gene, index) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.cloneB.map((gene, index) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.cloneC.map((gene, index) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.cloneD.map((gene, index) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {secondBestCrossbreedR.result.map((gene, index) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
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
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {crossbreedR.cloneB.map((gene) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="clone">
            {crossbreedR.cloneC
              ? crossbreedR.cloneC.map((gene) => {
                  if (
                    gene.includes("y") ||
                    gene.includes("h") ||
                    gene.includes("g")
                  ) {
                    return <p className="green">{gene}</p>;
                  } else {
                    return <p className="red">{gene}</p>;
                  }
                })
              : ""}
          </div>
          <div className="clone">
            {crossbreedR.cloneD.map((gene) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
                return <p className="green">{gene}</p>;
              } else {
                return <p className="red">{gene}</p>;
              }
            })}
          </div>
          <div className="line"></div>
          <div className="clone">
            {crossbreedR.result.map((gene) => {
              if (
                gene.includes("y") ||
                gene.includes("h") ||
                gene.includes("g")
              ) {
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

  function deleteClone(e) {
    cookies.cloneList.map((clone, index) => {
      if (clone.equals(cookies.cloneList[e])) {
        cookies.cloneList.splice(index, 1);
        setCookie("cloneList", cookies.cloneList, { path: "/" });
      }
    });
  }

  function renderCloneList() {
    if (cookies.cloneList) {
      return (
        <div>
          {cookies.cloneList.map((clone, index) => {
            return (
              <div key={clone} className="clone">
                <Image
                  onClick={() => deleteClone(index)}
                  className="deleteClone"
                  alt="delete Clone"
                  src={deleteImg}
                />

                {clone.map((gene) => {
                  if (
                    gene.includes("y") ||
                    gene.includes("h") ||
                    gene.includes("g")
                  ) {
                    return <p className="green">{gene}</p>;
                  } else {
                    return <p className="red">{gene}</p>;
                  }
                })}
              </div>
            );
          })}
        </div>
      );
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Crossbreeder For Rust</title>
        <meta
          name="description"
          content="Rust Crossbreeder for Hemp and Berrie Clones"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/Hemp.png" />
      </Head>
      <div className="titleContainer">
        <h1 id="title">The Rust Crossbreeder </h1>
        <h4 className="by">by Jachub123</h4>
      </div>
      <h3 id="userInputHeader">
        Set The Amount of G/Y Genes for your desired Crossbreed Result{" "}
      </h3>
      <h4 id="defaultGenes">
        default is 4 <span className="green">Y</span> 2{" "}
        <span className="green">G</span>{" "}
      </h4>
      <h4 id="customGenes" className="hidden">
        you set {geneCountY} <span className="green">Y</span> {geneCountG}{" "}
        <span className="green">G</span>{" "}
      </h4>
      <div className="column">
        <div>
          <label htmlFor="y">Amount of Y-Genes: </label>
          <input
            onChange={(e) => perfectClone(e)}
            type="range"
            id="y"
            min="0"
            max="6"
            name="gene"
          />
        </div>
        <div>
          <label htmlFor="g">Amount of G-Genes: </label>
          <input
            onChange={(e) => perfectClone(e)}
            type="range"
            id="g"
            min="0"
            max="6"
            name="gene"
          />
        </div>
      </div>
      <label id="label" htmlFor="0">
        Enter Genes:{" "}
        <p className="info">(you can now Paste Genes with CTRL + V)</p>
      </label>
      <div className="flex1">
        <input
          className="geneInput"
          type="text"
          id="0"
          onPaste={(e) => paste(e)}
          onKeyDown={(e) => keyDown(e, 0)}
          onKeyUp={(e) => handleKeyPress(e)}
          onChange={(e) =>
            e.target.value.toLowerCase() === "y" ||
            e.target.value.toLowerCase() === "g" ||
            e.target.value.toLowerCase() === "h" ||
            e.target.value.toLowerCase() === "x" ||
            e.target.value.toLowerCase() === "w"
              ? (addGenes(e), document.getElementById("1").focus())
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="1"
          onKeyDown={(e) => keyDown(e, 1)}
          onKeyUp={(e) => handleKeyPress(e)}
          onChange={(e) =>
            e.target.value.toLowerCase() === "y" ||
            e.target.value.toLowerCase() === "g" ||
            e.target.value.toLowerCase() === "h" ||
            e.target.value.toLowerCase() === "x" ||
            e.target.value.toLowerCase() === "w"
              ? (addGenes(e), document.getElementById("2").focus())
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="2"
          onKeyDown={(e) => keyDown(e, 2)}
          onKeyUp={(e) => handleKeyPress(e)}
          onChange={(e) =>
            e.target.value.toLowerCase() === "y" ||
            e.target.value.toLowerCase() === "g" ||
            e.target.value.toLowerCase() === "h" ||
            e.target.value.toLowerCase() === "x" ||
            e.target.value.toLowerCase() === "w"
              ? (addGenes(e), document.getElementById("3").focus())
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="3"
          onKeyDown={(e) => keyDown(e, 3)}
          onKeyUp={(e) => handleKeyPress(e)}
          onChange={(e) =>
            e.target.value.toLowerCase() === "y" ||
            e.target.value.toLowerCase() === "g" ||
            e.target.value.toLowerCase() === "h" ||
            e.target.value.toLowerCase() === "x" ||
            e.target.value.toLowerCase() === "w"
              ? (addGenes(e), document.getElementById("4").focus())
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="4"
          onKeyDown={(e) => keyDown(e, 4)}
          onKeyUp={(e) => handleKeyPress(e)}
          onChange={(e) =>
            e.target.value.toLowerCase() === "y" ||
            e.target.value.toLowerCase() === "g" ||
            e.target.value.toLowerCase() === "h" ||
            e.target.value.toLowerCase() === "x" ||
            e.target.value.toLowerCase() === "w"
              ? (addGenes(e), document.getElementById("5").focus())
              : (e.target.value = "")
          }
        ></input>
        <input
          className="geneInput"
          type="text"
          id="5"
          onKeyDown={(e) => keyDown(e, 5)}
          onKeyUp={(e) => handleKeyPress(e)}
          onChange={(e) =>
            e.target.value.toLowerCase() === "y" ||
            e.target.value.toLowerCase() === "g" ||
            e.target.value.toLowerCase() === "h" ||
            e.target.value.toLowerCase() === "x" ||
            e.target.value.toLowerCase() === "w"
              ? addGenes(e)
              : (e.target.value = "")
          }
        ></input>
      </div>
      <div className="flex1 break">
        <button onClick={addClone}>Add Clone</button>
        <button onClick={crossbreed}>Start Crossbreed</button>
        <button className="delete" onClick={clearList}>
          Clear List
        </button>
      </div>
      <input hidden className="geneInput" type="text" id="6"></input>
      <div className="flex">
        <div>{renderCrossbreedResult()}</div>
        <div>
          <h1>Your List </h1>

          {renderCloneList()}
        </div>
      </div>

      <Analytics />
      <div className="powr-form-builder" id="18a39f72_1681306315"></div>
      <Script src="https://www.powr.io/powr.js?platform=html"></Script>
      <form
        className="donate"
        action="https://www.paypal.com/donate"
        method="post"
        target="_top"
      >
        <input type="hidden" name="hosted_button_id" value="YSS2VHFZ8FPC2" />
        <input
          type="image"
          src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif"
          border="0"
          name="submit"
          title="PayPal - The safer, easier way to pay online!"
          alt="Donate with PayPal button"
        />
        <Image alt="" border="0" src={paypalImg} width="1" height="1" />
      </form>
    </div>
  );
}
