import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Present Bandit</span>
          </h1>
          <Image className="ml-8" alt="Game" width={500} height={350} src="/game.png" />
          <p className="text-center text-lg">Mint your Santa ERC-721, steal presents, and make it to the finish</p>
          <div className="flex justify-center mb-2">
            <Link
              href="/game"
              passHref
              className=" py-2 px-16 mb-1 mt-3 bg-green-500 rounded baseline hover:bg-green-400 disabled:opacity-50"
            >
              Play
            </Link>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="text-center">
            <h2 className="mt-3 text-4xl">Gameplay</h2>
          </div>
          <div className="flex justify-center">
            <ul className="list-disc" style={{ width: "600px" }}>
              <li>Each player start with 100 mins</li>
              <li>Player can move 1 space</li>
              <li>Each movement costs 1 min</li>
              <li>
                If you land on a house space, you can mint a present token, which can cost (between 5-20 mins) to steal
                that present
              </li>
              <li>If you land on an event space, you might win or lose a present, or lose 10 mins</li>
              <li>Each present you have increases your movement cost by 2 mins</li>
              <li>Players must reach the finish line to claim the prizes</li>
              <li>If a player`&apos;`s time is zero, they will lose all their presents</li>
            </ul>
          </div>
          <p className="text-3xl text-center">Requirements</p>
          <div className="flex justify-center">
            <ul className="list-disc" style={{ width: "600px" }}>
              <li>To play, you must mints a Fake Santa NFT to play</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
