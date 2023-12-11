import type { NextPage } from "next";
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

  const { data: gridData } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "getGrid",
  });

  const { data: you } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "player",
    args: [address],
  });

  const { data: playerTimeLeft } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "playerTimeLeft",
    args: [address],
  });

  const { data: isPaid } = useScaffoldContractRead({
    contractName: "PresentBandit",
    functionName: "isPaid",
    args: [address],
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

  return (
    <>
      <MetaHeader />
      <div className="ml-6">
        <div className="flex items-center flex-col flex-grow">
          <div>
            <h2 className="mt-4 text-3xl">Board</h2>
            <p>{address}</p>
            <p>{Number(playerTimeLeft)} Time Left</p>
            {!isPaid && (
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
            <div className="relative mt-10 bg-sky-400" style={{ width: "1000px", height: "600px" }}>
              {gridData &&
                gridData.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "w-20 h-20 border border-gray-300 font-bold bg-white" + " " + BOARD_STYLES[index] || "grid-1"
                    }
                  >
                    {item.typeGrid}
                    {you?.toString() === item.id.toString() && <p>You</p>}
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
