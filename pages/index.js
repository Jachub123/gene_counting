import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";

export default function Home() {
  const [C1step1, setC1step1] = useState("");
  const [C2step1, setC2step1] = useState("");
  const [C1step2, setC1step2] = useState("");
  const [C2step2, setC2step2] = useState("");
  const [crossbreedR, setcrossbreedR] = useState([]);
  const [cloneWithHighestRating, setCloneWithHighestRating] = useState([]);

  let genePool = [];
  /* const genePool = [
    ["g", "h", "x", "w", "h", "y"],
    ["y", "g", "y", "w", "x", "y"],
    ["y", "h", "h", "x", "g", "h"],
    ["y", "h", "h", "g", "g", "h"],
    ["x", "h", "g", "y", "g", "x"],
    ["w", "g", "y", "g", "g", "w"],
    ["h", "h", "y", "h", "w", "h"],
    ["y", "y", "y", "h", "x", "h"],
    ["g", "h", "g", "h", "w", "x"],
    ["g", "y", "y", "y", "w", "h"],
    ["y", "g", "y", "y", "h", "h"],
    ["g", "h", "w", "g", "h", "y"],
  ]; */
  /* const genePool = [
    ["y", "g", "h", "h", "y", "y"],
    ["x", "y", "h", "h", "g", "x"],
    ["x", "x", "y", "h", "g", "g"],
    ["h", "y", "y", "h", "h", "g"],
    ["y", "h", "x", "y", "y", "h"],
    ["y", "h", "w", "y", "y", "h"],
    ["y", "g", "g", "x", "g", "h"],
    ["y", "g", "g", "h", "g", "h"],
    ["y", "g", "h", "x", "g", "w"],
    ["h", "h", "y", "x", "w", "y"],
    ["y", "h", "y", "y", "x", "x"],
    ["y", "y", "x", "y", "x", "g"],
  ]; */
  /*   const genePool = [
    ["y", "x", "x", "h", "y", "y"],
    ["y", "y", "y", "h", "h", "h"],
    ["y", "y", "h", "h", "x", "y"],
    ["g", "x", "y", "x", "g", "g"],
    ["y", "g", "y", "h", "x", "w"],
    ["x", "x", "g", "h", "h", "g"],
    ["g", "x", "w", "h", "y", "y"],
    ["x", "h", "x", "y", "y", "g"],
    ["y", "h", "w", "y", "h", "g"],
    ["y", "x", "g", "x", "g", "h"],
    ["y", "w", "g", "h", "g", "h"],
    ["y", "g", "w", "x", "g", "y"],
    ["g", "h", "y", "x", "w", "y"],
    ["y", "h", "h", "y", "x", "g"],
    ["g", "y", "x", "y", "x", "g"],
  ]; */
  let commonGeneList = [];
  let singleCloneList = [];
  let geneWeightingList = [];
  let geneWeighting = [];
  let clonesWithMostCommonGenes = [];
  let commonPosition = [];
  let genes = [];
  let otherGenes = [];
  let weakGenesRating = 0;
  let perfectHempSeedY = 4;
  let perfectHempSeedG = 2;
  let usableGeneList_g = [];
  let usableGeneList_y = [];
  let potentialGClones = [];
  let potentialYClones = [];
  let finalGClones = [];
  let finalYClones = [];
  let crossbreedResults = [];
  let gPositionOfClones = [];
  let yPositionOfClones = [];
  let highestRating = 0;

  let clone = [];

  function addGenes(e) {
    clone[e.target.id] = e.target.value;
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
            weakGenesRating = weakGenesRating + 0.5;
          }
        } else if (gene === "g") {
          if (geneCounterG < perfectHempSeedG) {
            geneCounterG++;
            weakGenesRating = weakGenesRating + 0.5;
          }
        } else {
          if (gene === "x" || gene === "w") {
            weakGenesRating = weakGenesRating - 0.9;
          }
          weakGenes.push(gene);
          positionBadGenes.push(index);
        }
        if (index === 5) {
          otherGenes[i] = weakGenes;
          weakGenes = [];
          singleCloneList[i] = {
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
    singleCloneList.map((clones) => {
      if (highestRating < clones.rating) {
        highestRating = clones.rating;
        setCloneWithHighestRating(clones);
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

    if (needG > 0) {
      for (let i = 0; i < genePool.length; i++) {
        cloneWithHighestRating.positionBadGenes.map((position) => {
          if (genePool[i][position] === "g") {
            usableGeneList_g.push({
              position: position,
              clone: singleCloneList[i],
            });
          }
        });
      }
    }
    if (needY > 0) {
      for (let i = 0; i < genePool.length; i++) {
        cloneWithHighestRating.positionBadGenes.map((position) => {
          if (genePool[i][position] === "y") {
            usableGeneList_y.push({
              position: position,
              clone: singleCloneList[i],
            });
          }
        });
      }
    }
  }

  function findCrossbreadPair(cloneList) {
    for (let i = 0; i < cloneList.length - 1; i++) {
      for (let j = i + 1; j <= cloneList.length - 1; j++) {
        let geneOne = cloneList[i] ? cloneList[i].clone[position] : "";
        let geneTwo = cloneList[j] ? cloneList[j].clone[position] : "";
        let badClone = false;

        if (geneOne === geneTwo) {
          if (geneOne === "g" || geneOne === "y") {
            cloneList[i].clone.map((gene, index2) => {
              if (gene === "w" || gene === "x") {
                if (cloneList[j].clone[index2] === gene) {
                  badClone = true;
                }
              }
            });

            if (!badClone) {
              if (geneOne === "y") {
                if (needY > 0) {
                  potentialYClones.push({
                    position: position,
                    cloneInfo: cloneList[i],
                  });
                  potentialYClones.push({
                    position: position,
                    cloneInfo: cloneList[j],
                  });
                  let positionExists = (element) => element === position;
                  let indexOfPosition =
                    yPositionOfClones.findIndex(positionExists);
                  if (indexOfPosition !== -1) {
                    yPositionOfClones.splice(indexOfPosition, 1, position);
                  } else {
                    yPositionOfClones.push(position);
                  }
                }
              }
              if (geneOne === "g") {
                if (needG > 0) {
                  potentialGClones.push({
                    position: position,
                    cloneInfo: neededClones[i],
                  });
                  potentialGClones.push({
                    position: position,
                    cloneInfo: neededClones[j],
                  });
                  let positionExists = (element) => element === position;
                  let indexOfPosition =
                    gPositionOfClones.findIndex(positionExists);
                  if (indexOfPosition !== -1) {
                    gPositionOfClones.splice(indexOfPosition, 1, position);
                  } else {
                    gPositionOfClones.push(position);
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /*   let stepIteration = 0;

  yPositionOfClones.map((positionY) => {
    gPositionOfClones.map((positionG, index) => {
      if (positionY === positionG) {
        if (yPositionOfClones.length === gPositionOfClones.length) {
          let deletePosition = gPositionOfClones.indexOf(positionG);
          gPositionOfClones.splice(deletePosition, 1, "");
          return;
        }
        if (yPositionOfClones.length > gPositionOfClones.length) {
          let deletePosition = yPositionOfClones.indexOf(positionY);
          yPositionOfClones.splice(deletePosition, 1, "");
          return;
        }
        if (yPositionOfClones.length < gPositionOfClones.length) {
          let deletePosition = gPositionOfClones.indexOf(positionG);
          gPositionOfClones.splice(deletePosition, 1, "");
          return;
        }
      }
    });
  });

  gPositionOfClones.map((positionNeeded, counter) => {
    let crossbreedCloneStepbefore = "";

    for (let i = 0; i < potentialGClones.length; i += 2) {
      let lastIndexOfCrossbreedResults = crossbreedResults.length - 1;
      let lastCBResult = "";
      if (crossbreedResults[lastIndexOfCrossbreedResults]) {
        lastCBResult = crossbreedResults[lastIndexOfCrossbreedResults];
      }

      if (lastCBResult === "") {
        crossbreedCloneStepbefore = cloneWithHighestRating.clone.slice();
      } else {
        crossbreedCloneStepbefore = lastCBResult.clone.slice();
      }
      if (potentialGClones[i].position === positionNeeded) {
        if (
          potentialGClones[i] !== undefined &&
          potentialGClones[i + 1] !== undefined
        ) {
          finalGClones.push({
            [positionNeeded]: potentialGClones[i].cloneInfo.clone,
          });
          finalGClones.push({
            [positionNeeded]: potentialGClones[i + 1].cloneInfo.clone,
          });
          if (lastCBResult !== "") {
            if (lastCBResult.position !== positionNeeded) {
              crossbreedResults.push({
                position: positionNeeded,
                clone: crossbreedCloneStepbefore,
              });
              crossbreedResults[stepIteration].clone.splice(
                positionNeeded,
                1,
                potentialGClones[i].cloneInfo.clone[positionNeeded]
              );
              setcrossbreedR(crossbreedResults);
              stepIteration++;
            }
          } else {
            crossbreedResults.push({
              position: positionNeeded,
              clone: crossbreedCloneStepbefore,
            });
            crossbreedResults[stepIteration].clone.splice(
              positionNeeded,
              1,
              potentialGClones[i].cloneInfo.clone[positionNeeded]
            );
            setcrossbreedR(crossbreedResults);
            stepIteration++;
          }
        }
      }
    }
  });
  yPositionOfClones.map((positionNeeded, counter) => {
    let crossbreedCloneStepbefore = "";

    for (let i = 0; i < potentialYClones.length; i += 2) {
      let lastIndexOfCrossbreedResults = crossbreedResults.length - 1;
      let lastCBResult = "";
      if (crossbreedResults[lastIndexOfCrossbreedResults]) {
        lastCBResult = crossbreedResults[lastIndexOfCrossbreedResults];
      }

      if (lastCBResult === "") {
        crossbreedCloneStepbefore = cloneWithHighestRating.clone.slice();
      } else {
        crossbreedCloneStepbefore = lastCBResult.clone.slice();
      }
      if (potentialYClones[i].position === positionNeeded) {
        if (
          potentialYClones[i] !== undefined &&
          potentialYClones[i + 1] !== undefined
        ) {
          finalYClones.push({
            [positionNeeded]: potentialYClones[i].cloneInfo.clone,
          });
          finalYClones.push({
            [positionNeeded]: potentialYClones[i + 1].cloneInfo.clone,
          });
          if (lastCBResult) {
            if (lastCBResult.position !== positionNeeded) {
              crossbreedResults.push({
                position: positionNeeded,
                clone: crossbreedCloneStepbefore,
              });
              crossbreedResults[stepIteration].clone.splice(
                positionNeeded,
                1,
                potentialYClones[i].cloneInfo.clone[positionNeeded]
              );
              setcrossbreedR(crossbreedResults);
              stepIteration++;
            }
          } else {
            crossbreedResults.push({
              position: positionNeeded,
              clone: crossbreedCloneStepbefore,
            });
            crossbreedResults[stepIteration].clone.splice(
              positionNeeded,
              1,
              potentialYClones[i].cloneInfo.clone[positionNeeded]
            );
            setcrossbreedR(crossbreedResults);
            stepIteration++;
          }
        }
      }
    }
  }); */

  console.log(commonGeneList);
  console.log(singleCloneList);
  console.log(geneWeightingList);
  console.log(geneWeighting);
  console.log(cloneWithHighestRating);
  console.log(clonesWithMostCommonGenes);
  console.log(commonPosition);
  console.log(genes);
  console.log(otherGenes);
  console.log(weakGenesRating);
  console.log(perfectHempSeedY);
  console.log(perfectHempSeedG);
  console.log(neededClones);
  console.log(gPositionOfClones);
  console.log(yPositionOfClones);

  function addClone() {
    genePool.push(clone.slice());
    const inputFields = document.querySelectorAll(".geneInput");
    inputFields.forEach((input) => {
      input.value = "";
    });

    giveGeneWeighting();
    findBestClone();
    findUsableClones();
    //findBestTwoClones();
    //findBestSingleClone();
    findCrossbreadPair();
    /*     step1();
    step2();
    step3(); */

    function findBestTwoClones() {
      let counter = 0;
      let commonCounter = 0;
      let highestAmount = 0;

      for (let i = 0; i < genePool.length - 1; i++) {
        for (let j = i; j < genePool.length - 1; j++) {
          genePool[j + 1].map((x, index) => {
            if (x === "y" || x === "g") {
              if (x === genePool[i][index]) {
                const clone1 = i;
                const clone2 = parseFloat(j) + parseFloat(1);

                commonPosition.push(index);
                genes.push(x);
                counter++;
                commonCounter++;
                commonGeneList[counter] = {
                  commonGeneAmount: commonCounter,
                  commonPositions: commonPosition,
                  genes: genes,
                  clone1: genePool[clone1],
                  clone2: genePool[clone2],
                };
              }
            }
            if (index === 5) {
              commonCounter = 0;
              commonPosition = [];
              genes = [];
            }
          });
        }
      }
      commonGeneList.map((commons) => {
        if (highestAmount < commons.commonGeneAmount) {
          highestAmount = commons.commonGeneAmount;
          clonesWithMostCommonGenes.push(commons);
        }
      });
    }

    function step1() {
      if (!cloneWithHighestRating.positionBadGenes) {
        return;
      }
      cloneWithHighestRating.positionBadGenes.map((position, count) => {
        if (count === 0) {
          finalGClones.map((clone, index) => {
            if (
              clone[position] !== undefined &&
              finalGClones[index + 1] !== undefined
            ) {
              if (finalGClones[index + 1][position] !== undefined) {
                setC1step1(clone[position]);
                setC2step1(finalGClones[index + 1][position]);
              }
            }
          });
        }
      });
      cloneWithHighestRating.positionBadGenes.map((position, count) => {
        if (count === 0) {
          finalYClones.map((clone, index) => {
            if (
              clone[position] !== undefined &&
              finalYClones[index + 1] !== undefined
            ) {
              if (finalYClones[index + 1][position] !== undefined) {
                setC1step1(clone[position]);
                setC2step1(finalYClones[index + 1][position]);
              }
            }
          });
        }
      });
    }
    function step2() {
      if (!cloneWithHighestRating.positionBadGenes) {
        return;
      }
      cloneWithHighestRating.positionBadGenes.map((position, count) => {
        if (count === 1) {
          finalGClones.map((clone, index) => {
            if (
              clone[position] !== undefined &&
              finalGClones[index + 1] !== undefined
            ) {
              if (finalGClones[index + 1][position] !== undefined) {
                setC1step2(clone[position]);
                setC2step2(finalGClones[index + 1][position]);
              }
            }
          });
        }
      });
      cloneWithHighestRating.positionBadGenes.map((position, count) => {
        if (count === 1) {
          finalYClones.map((clone, index) => {
            if (
              clone[position] !== undefined &&
              finalYClones[index + 1] !== undefined
            ) {
              if (finalYClones[index + 1][position] !== undefined) {
                setC1step2(clone[position]);
                setC2step2(finalYClones[index + 1][position]);
              }
            }
          });
        }
      });
    }
    function step3() {
      if (!cloneWithHighestRating.positionBadGenes) {
        return;
      }
      cloneWithHighestRating.positionBadGenes.map((position, count) => {
        if (count === 2) {
          finalGClones.map((clone, index) => {
            if (
              clone[position] !== undefined &&
              finalGClones[index + 1] !== undefined
            ) {
              if (finalGClones[index + 1][position] !== undefined) {
                setC1step2(clone[position]);
                setC2step2(finalGClones[index + 1][position]);
              }
            }
          });
        }
      });
      cloneWithHighestRating.positionBadGenes.map((position, count) => {
        if (count === 2) {
          finalYClones.map((clone, index) => {
            if (
              clone[position] !== undefined &&
              finalYClones[index + 1] !== undefined
            ) {
              if (finalYClones[index + 1][position] !== undefined) {
                setC1step2(clone[position]);
                setC2step2(finalYClones[index + 1][position]);
              }
            }
          });
        }
      });
    }
  }

  return (
    <div className={styles.container}>
      {giveGeneWeighting()}
      {findBestTwoClones()}
      {findBestClone()}

      {findCrossbreadPair()}
      {step1()}
      {step2()}
      {step3()}

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
              ? addGenes(e)
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
              ? addGenes(e)
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
              ? addGenes(e)
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
              ? addGenes(e)
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
              ? addGenes(e)
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
              ? addGenes(e)
              : (e.target.value = "")
          }
        ></input>
        <button onClick={addClone()} formAction="/">
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
