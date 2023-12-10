import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";

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

  return (
    <>
      <MetaHeader />
      <div className="ml-6">
        <div className="flex items-center flex-col flex-grow">
          <div>
            <h2 className="mt-4 text-3xl">Board</h2>
            <p>{address}</p>
            <button
              className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => console.log("play")}
            >
              Play
            </button>
            <button
              className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => console.log("roll")}
            >
              Roll
            </button>
            <div className="relative mt-10 bg-sky-400" style={{ width: "1000px", height: "600px" }}>
              {BOARD_STYLES &&
                BOARD_STYLES.map((item, index) => (
                  <div
                    key={index}
                    className={
                      "w-20 h-20 border border-gray-300 font-bold bg-white" + " " + BOARD_STYLES[index] || "grid-1"
                    }
                  >
                    {item}
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
