import React from "react";
import Input from "../Input";
import Button from "../Button";
import { FaTimes } from "react-icons/fa";

type Props = {
  value: string;
  onChange: (value: string) => void;
  show?: boolean;
};

const GlobalSearch: React.FC<Props> = ({ value, onChange, show }) => {
  if (show === false) {
    return null;
  }

  return (
    <div className="join">
      <Input
        className="max-w-sx join-item"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="Søk..."
      />
      <Button
        className="join-item"
        outline
        onClick={() => {
          onChange("");
        }}
      >
        <FaTimes />
      </Button>
    </div>
  );
};

export default GlobalSearch;
