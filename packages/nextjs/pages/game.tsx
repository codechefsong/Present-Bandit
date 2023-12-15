import Image from "next/image";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const BOARD_STYLES = [
  "grid-1",
  "grid-2",
  "grid-3",
  "grid-4",
  "grid-5",
  "grid-6",
  "grid-7",
  "grid-8",
  "grid-9",
  "grid-10",
  "grid-11",
  "grid-12",
  "grid-13",
  "grid-14",
];

const Game: NextPage = () => {
  const { address } = useAccount();

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "tbaList",
    args: [address],
  });

  const { data: gridData } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "getGrid",
  });

  const { data: you } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "player",
    args: [tbaAddress],
  });

  const { data: playerTimeLeft } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "playerTimeLeft",
    args: [tbaAddress],
  });

  const { data: weight } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "playerWeight",
    args: [tbaAddress],
  });

  const { data: isPaid } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "isPaid",
    args: [tbaAddress],
  });

  const { data: presents } = useScaffoldContractRead({
    contractName: "PresentToken",
    functionName: "balanceOf",
    args: [tbaAddress],
  });

  const { writeAsync: playGame, isLoading: playLoading } = useScaffoldContractWrite({
    contractName: "PresentBandit",
    functionName: "addPlayer",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: movePlayer, isLoading: moveLoading } = useScaffoldContractWrite({
    contractName: "PresentBandit",
    functionName: "movePlayer",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: stealPresent, isLoading: stealLoading } = useScaffoldContractWrite({
    contractName: "PresentBandit",
    functionName: "stealPresent",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: randomEvent, isLoading: eventLoading } = useScaffoldContractWrite({
    contractName: "PresentBandit",
    functionName: "randomEvent",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: dropPresent, isLoading: dropLoading } = useScaffoldContractWrite({
    contractName: "PresentBandit",
    functionName: "dropPresent",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: gameOver, isLoading: overLoading } = useScaffoldContractWrite({
    contractName: "PresentBandit",
    functionName: "gameOver",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "PresentBandit",
    eventName: "PlayEvent",
    listener: (data: any) => {
      console.log(data);
      notification.info(data[0].args.detail);
    },
  });

  return (
    <>
      <MetaHeader />
      <div className="mt-2">
        <div className="flex items-center flex-col flex-grow">
          <div>
            <div className="grid lg:grid-cols-2 flex-grow gap-3">
              <div className="rounded overflow-hidden shadow-lg bg-white px-3">
                <p>{tbaAddress}</p>
                <p>{Number(playerTimeLeft)} Time Left</p>
                <p>{formatEther(presents || 0n)} Presents</p>
                <p>Cost {Number(weight)} Mins to Move</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded overflow-hidden shadow-lg bg-white">
                {!isPaid && tbaAddress === "0x0000000000000000000000000000000000000000" && (
                  <p className="text-red-600">You need a Fake Santa NFT to play</p>
                )}
                {!isPaid && tbaAddress !== "0x0000000000000000000000000000000000000000" && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50 w-[200px] ml-2"
                    onClick={() => playGame()}
                    disabled={playLoading}
                  >
                    {playLoading ? "Adding..." : "Play"}
                  </button>
                )}
                {isPaid && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                    onClick={() => movePlayer()}
                    disabled={moveLoading}
                  >
                    Move
                  </button>
                )}
                {isPaid && gridData && gridData[Number(you)]?.typeGrid === "house" && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                    onClick={() => stealPresent()}
                    disabled={stealLoading}
                  >
                    Steal
                  </button>
                )}
                {isPaid && gridData && gridData[Number(you)]?.typeGrid === "house" && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                    onClick={() => dropPresent()}
                    disabled={dropLoading}
                  >
                    Discard
                  </button>
                )}
                {isPaid && gridData && gridData[Number(you)]?.typeGrid === "event" && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                    onClick={() => randomEvent()}
                    disabled={eventLoading}
                  >
                    Play Event
                  </button>
                )}
                {isPaid && Number(playerTimeLeft) == 0 && (
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                    onClick={() => gameOver()}
                    disabled={overLoading}
                  >
                    Start Over
                  </button>
                )}
              </div>
            </div>
            <div className="relative mt-2 bg-white-100" style={{ width: "1000px", height: "600px" }}>
              {gridData &&
                gridData.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "w-20 h-20 z-20 border border-gray-300 font-bold bg-white" + " " + BOARD_STYLES[index] || "grid-1"
                    }
                  >
                    {item.typeGrid}
                    {isPaid && you?.toString() === item.id.toString() && (
                      <Image className="mb-3" src="/santa.png" width={50} height={50} alt="Fake Santa" />
                    )}
                  </div>
                ))}
              <Image className="house-1 z-30" src="/house.png" width={90} height={90} alt="House" />
              <Image className="house-2 z-30" src="/house.png" width={90} height={90} alt="House" />
              <Image className="house-3 z-30" src="/house.png" width={90} height={90} alt="House" />
              <Image className="house-4 z-30" src="/house.png" width={90} height={90} alt="House" />
              <div className="line-1 bg-blue-100 w-[800px] h-[70px] z-10"></div>
              <div className="line-2 bg-blue-100 w-[70px] h-[450px] z-10"></div>
              <div className="line-3 bg-blue-100 w-[800px] h-[70px] z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
