import { AnimatedLetters } from "./AnimatedLetters";

export const MainTitle = ({ title }) => {
  return (
    <div className="flex items-center">
      <div className="">
        <AnimatedLetters title={title} />
      </div>
    </div>
  );
};
