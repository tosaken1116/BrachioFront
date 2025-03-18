import { Container } from "@/components/ui/container";
import { WithBackCard } from "@/components/ui/withBackCard";
import { Link } from "@tanstack/react-router";
import { type FC, Suspense } from "react";
import type { Deck as DeckType } from "../../types";
import { useGetDeckList } from "../../usecase/cache";
import { DeckCase } from "../DeckCase";
import { NewDeckButton } from "../NewDeckButton";

const Internal = () => {
  const { data: decks } = useGetDeckList();
  return (
    <div className="grid grid-cols-2 w-fit mx-auto gap-8">
      <div className=" w-56 aspect-card">
        <NewDeckButton />
      </div>
      {decks.map((deck, index) => {
        return (
          <Link key={deck.id} to={"/decks/$id"} params={{ id: deck.id }}>
            <Deck deck={deck} index={index} />
          </Link>
        );
      })}
    </div>
  );
};
type DeckProps = {
  deck: Pick<DeckType, "id" | "color" | "thumbnailCard" | "name">;
  index?: number;
};
const Deck: FC<DeckProps> = ({ deck, index }) => {
  return (
    <Container className="flex flex-col overflow-hidden h-fit drop-shadow-xl">
      <WithBackCard color={deck.color} className=" px-8 py-4">
        {index !== undefined && (
          <strong className="absolute left-4 top-2 text-5xl text-white">
            {`0${index + 1}`.slice(-2)}
          </strong>
        )}
        <DeckCase energy={deck.color} thumbnailCard={deck.thumbnailCard} />
        <div className=" py-2 my-2 rounded-sm shadow-slate-500 w-full text-center shadow-inner ">
          <p className="text-sm">{deck.name}</p>
        </div>
      </WithBackCard>
    </Container>
  );
};

export const DeckList = () => {
  return (
    <Suspense>
      <Internal />
    </Suspense>
  );
};
