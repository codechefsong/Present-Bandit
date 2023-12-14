import Image from "next/image";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

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
              </div>
            </div>
            <div className="relative mt-2 bg-sky-400" style={{ width: "1000px", height: "600px" }}>
              {gridData &&
                gridData.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "w-20 h-20 border border-gray-300 font-bold bg-white" + " " + BOARD_STYLES[index] || "grid-1"
                    }
                  >
                    {item.typeGrid}
                    {isPaid && you?.toString() === item.id.toString() && (
                      <Image className="mb-3" src="/santa.png" width={50} height={50} alt="Fake Santa" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
